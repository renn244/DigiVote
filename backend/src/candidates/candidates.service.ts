import { BadRequestException, ConflictException, GoneException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { UserType } from 'src/lib/decorator/User.decorator';
import photoFolder from 'src/lib/enum/photoFolder.enum';
import { CreateCandidateDto, UpdateCandidateDto } from './dto/candidates.dto';

@Injectable()
export class CandidatesService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any,
        private readonly fileUploadService: FileUploadService
    ) {}

    async createCandidate(user: UserType, body: CreateCandidateDto, photo: Express.Multer.File) {
        try {
            if(!photo) throw new BadRequestException('photo is required!')
        
            const photoUrl = await this.fileUploadService.upload(photo, {
                folder: photoFolder.CANDIDATESPHOTO
            })
    
            const createCandidateResult = await this.sql`
                INSERT INTO candidates (photo, name, description, party_id, position_id)
                VALUES (${photoUrl.secure_url}, ${body.name}, ${body.description}, 
                ${body.party_id}, ${body.position_id})
                RETURNING *;
            `
    
            // so that it can be updated in the client
            const getPosition = await this.sql`
                SELECT position FROM positions
                WHERE id = ${body.position_id}
            `
    
            if(!createCandidateResult.length) throw new GoneException('failed to creaet candidate')
        
            return {
                position: getPosition[0]?.position,
                ...createCandidateResult[0]
            };
        } catch (error) {
            if(error.code === '23505') {
                if(error.constraint === 'candidates_party_id_position_id_key') {
                    throw new ConflictException('the position is already occupied')
                } else if(error.constraint === 'candidates_name_party_id_key') {
                    throw new ConflictException('a candidate can only apply to position once')
                } 
            }

            throw new InternalServerErrorException()
        }
    }

    async getCandidates(partyId: string) {
        const getCandidatesResults = await this.sql`
            SELECT c.*, p.position FROM candidates c
            LEFT JOIN positions p ON p.id = c.position_id
            WHERE party_id = ${partyId}
        `

        return getCandidatesResults;
    }


    async getCandidate(candidateId: string) {
        const getCandidate = await this.sql`
            SELECT * FROM candidates
            WHERE id = ${candidateId}
        `

        if(!getCandidate.length) throw new NotFoundException('failed to find candidate')
    
        return getCandidate[0];
    }

    async updateCandidate(user: UserType, body: UpdateCandidateDto, candidateId: string, photo: Express.Multer.File | undefined) {
        // check if he is admin within the branch
        let photoUrl = undefined;
        if(photo) {
            const getCandidate = await this.getCandidate(candidateId);

            // if there is an existing photo delete it
            if(getCandidate.photo) await this.fileUploadService.deleteFile(getCandidate.photo);

            const photoUpload = await this.fileUploadService.upload(photo);
            photoUrl = photoUpload.secure_url;
        }

        const updateCandidateResult = await this.sql`
            UPDATE candidates SET
                name = COALESCE(${body.name}, name),
                description = ${body.description},
                position_id = COALESCE(${body.position_id}, position_id),
                photo = COALESCE(${photoUrl}, photo)
            WHERE id = ${candidateId}
            RETURNING *;
        `

        // so that it can be updated in the client
        const getPosition = await this.sql`
            SELECT position FROM positions
            WHERE id = ${body.position_id}
        `
        
        if(!updateCandidateResult.length) throw new GoneException('failed to update candidate')

        return {
            position: getPosition[0].position,
            ...updateCandidateResult[0]
        }
    }

    async deleteCandidate(user: UserType, candidateId: string) {
        const deleteCandidateResult = await this.sql`
            DELETE FROM candidates
            WHERE id = ${candidateId}
            RETURNING *;
        `

        if(!deleteCandidateResult.length) throw new GoneException('failed to delete candidate')

        return deleteCandidateResult[0];
    }
}
