import { ForbiddenException, GoneException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserType } from 'src/lib/decorator/User.decorator';
import { CreatePollDto } from './dto/poll.dto';

@Injectable()
export class PollService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any
    ) {}

    async createPoll(user: UserType, body: CreatePollDto) {
        if(user.role !== 'admin') {
            throw new ForbiddenException('only admin are allowed to create polls')
        }

        const pollCreate = await this.sql`
            INSERT INTO poll (title, description, branch, start_date, end_date, vote_type)
            VALUES (${body.title}, ${body.description}, ${user.branch} ,${body.start_date}, ${body.end_date}, ${body.vote_type})
            RETURNING *;
        `

        if(!pollCreate.length) {
            throw new GoneException('failed to create Poll')
        }

        return pollCreate[0]
    }

    async getPolls(user: UserType, search: string) {
        const branch = user.branch;

        const getPollsForUser = await this.sql`
            SELECT * FROM poll
            WHERE branch = ${branch}
        `

        return getPollsForUser
    }

    async getPoll(user: UserType, pollId: string) {
        const branch = user.branch; 
        
        const getPollForUser = await this.sql`
            SELECT * FROM poll
            WHERE branch = ${branch} AND id = ${pollId}
        `

        if(!getPollForUser.length) {
            throw new NotFoundException('Poll not found')
        }

        return getPollForUser[0]
    }

    async updatePoll(user: UserType, pollId: string, body: CreatePollDto) {
        const getPoll = await this.sql`
            SELECT * FROM poll
            WHERE id = ${pollId}
        `

        if(!getPoll.length) {
            throw new NotFoundException('Poll not found')
        }

        if(user.role !== 'admin') {
            throw new ForbiddenException('only admin are allowed to update polls')
        }

        if(user.branch !== getPoll[0].branch) {
            throw new ForbiddenException('only admin branch are allowed to update this poll')
        }

        const updatePoll = await this.sql`
            UPDATE poll 
            SET 
                title = ${body.title},
                description = ${body.description},
                start_date = ${body.start_date},
                end_date = ${body.end_date},
                vote_type = ${body.vote_type}
            WHERE id = ${pollId}
            RETURNING *;
        `

        if(!updatePoll.length) {
            throw new GoneException('failed to update Poll')
        }

        return updatePoll[0]
    }

    // should i delete or archive the poll?
    async deletePoll(user: UserType, pollId: string) {
        const getPoll = await this.sql`
            SELECT * FROM poll
            WHERE id = ${pollId}
        `

        if(!getPoll.length) {
            throw new NotFoundException('Poll not found')
        }

        if(user.branch !== getPoll[0].branch) {
            throw new ForbiddenException('only admin branch are allowed to delete this poll')
        }  
        
        if(user.role !== 'admin') {
            throw new ForbiddenException('only admin are allowed to delete polls')
        }

        const deletePoll = await this.sql`
            DELETE FROM poll
            WHERE id = ${pollId}
            RETURNING *;
        `

        if(!deletePoll.length) {
            throw new GoneException('failed to delete Poll')
        }

        return deletePoll[0]
    }
}
