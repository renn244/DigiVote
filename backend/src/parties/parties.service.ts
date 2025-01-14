import { BadRequestException, ConflictException, ForbiddenException, GoneException, HttpException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserType } from 'src/lib/decorator/User.decorator';
import { CreatePartiesDto } from './dto/parties.dto';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import photoFolder from 'src/lib/enum/photoFolder.enum';

@Injectable()
export class PartiesService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any,
        private readonly fileUploadService: FileUploadService
    ) {}

    async createParties(user: UserType, body: CreatePartiesDto, banner: Express.Multer.File) {
        // check if the one making the parties is actually admin and in branch
        try {
            if(user.role !== 'admin') throw new ForbiddenException('only admin are allowed to create parties')   
    
            const getPoll = await this.sql`
                SELECT branch, title FROM poll
                WHERE id = ${body.poll_id}
            `
    
            if(!getPoll.length) throw new NotFoundException('poll does not exist!')
    
            if(getPoll[0].branch !== user.branch) throw new ForbiddenException('only admin branch are allowed to create this poll')
    
            // upload to cloudinary
            if(!banner) throw new BadRequestException('banner is required')
            const uploadedBanner = await this.fileUploadService.upload(banner, { folder: photoFolder.BANNER })
    
            const createParty = await this.sql`
                INSERT INTO parties (name, description, banner, poll_id)
                VALUES (${body.name}, ${body.description}, ${uploadedBanner.secure_url}, ${body.poll_id})
                RETURNING *;
            `
    
            if(!createParty.length) throw new GoneException('failed to create parties!')
    
            return {
                ...createParty[0],
                branch: getPoll[0].branch,
                title: getPoll[0].title
            }
        } catch (error) {
            if(error.code === 'parties_name_poll_id_key') {
                throw new ConflictException('there is already a party with the same name')
            }
            throw error
        }
    }

    async getParties(user: UserType, pollId: string) {
        const branch = user.branch;
        
        const parties = await this.sql`
            SELECT p.*, po.branch, po.title
            FROM parties p
            JOIN poll po ON p.poll_id = po.id
            WHERE po.branch = ${branch};
        `

        return parties
    }

    async getParty(partyId: string) {
        
        const party = await this.sql`
            SELECT p.*, JSON_AGG(c) AS candidates 
            FROM parties p 
            LEFT JOIN candidates c
            ON p.id = c.party_id
            WHERE p.id = ${partyId}
            GROUP BY p.id
        `

        if(!party.length) throw new NotFoundException('party not found!')

        return party[0]
    }

    async getOverviewParty(partyId: string) {

        // get stats later
        const party = await this.sql`
            SELECT * FROM parties
            WHERE id = ${partyId}
        `

        if(!party.length) throw new NotFoundException('party not found')

        return party[0];
    }

    // if banner file exist then upload to cloudinary and delete the updatedParties
    async updatePartyBanner(partyId: string, banner: Express.Multer.File | undefined) {
        try {
            const bannerResult = await this.fileUploadService.upload(banner, {
                folder: 'sti-voting/banner'
            })

            const getParty = await this.sql`
                SELECT banner FROM parties
                WHERE id = ${partyId}
            `

            if(getParty.length && getParty[0].banner) {
                await this.fileUploadService.deleteFile(getParty[0].banner)
            }

            return bannerResult

        } catch (error) {
            if(error.code === 'parties_name_poll_id_key') {
                throw new ConflictException('there is already a party with the same name')
            }
            throw error
        }
    }

    async updateParty(user: UserType, body: CreatePartiesDto, partyId: string, banner: Express.Multer.File | undefined) {
        if(user.role !== 'admin') throw new ForbiddenException('only admin are allowed to update parties')

        // might be vunerable because the poll_id is relying on the frontend // might want to ahve better query
        const getPoll = await this.sql`
            SELECT id, branch FROM poll
            WHERE id = ${body.poll_id}
        `

        if(!getPoll.length) throw new NotFoundException('failed to found poll!')

        if(getPoll[0].branch !== user.branch) throw new ForbiddenException('only admin branch are allowed to update this parties')
        
        let bannerUrl: string | undefined = undefined;
        if(banner) {
            // upload
            const bannerResult = await this.updatePartyBanner(partyId, banner)
            bannerUrl = bannerResult.secure_url
        }
        
        const updatedParties = await this.sql`
            UPDATE parties SET
                name = ${body.name},
                description = ${body.description},
                banner = COALESCE(${bannerUrl}, banner)
            WHERE id = ${partyId}
            RETURNING *;
        `

        if(!updatedParties.length) throw new GoneException('failed to update parties')

        return updatedParties[0]
    }

    async deleteParty(user: UserType, partyId: string) {
        if(user.role !== 'admin') throw new ForbiddenException('only admin are allowed to delete parties')

        const getPoll = await this.sql`
            SELECT p.branch
            FROM parties pa
            JOIN poll p ON pa.poll_id = p.id
            WHERE pa.id = ${partyId}
        `;

        if(!getPoll.length) throw new NotFoundException('Poll or Party Not Found')

        if(getPoll[0].branch !== user.branch) throw new ForbiddenException('only admin branch are allowed to delete this parties')
    
        const deletedParty = await this.sql`
            DELETE FROM parties
            WHERE id = ${partyId}
            RETURNING *;
        `
        // delete images
        if(!deletedParty.length) throw new GoneException('failed to delete party')

        return deletedParty[0]
    }
}
