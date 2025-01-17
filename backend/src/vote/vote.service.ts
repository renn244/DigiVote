import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserType } from 'src/lib/decorator/User.decorator';

@Injectable()
export class VoteService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any
    ) {}

    async createVote(user: UserType, pollId: string, votes: { candidate_id: number }[]) {
        const getPollResult = await this.sql`
            SELECT * FROM poll
            WHERE id = ${pollId}
        `

        if(!getPollResult.length) {
            throw new NotFoundException('poll does not exist')
        }

        if(new Date(getPollResult[0].end_date) < new Date() ) {
            throw new ForbiddenException('poll is closed')
        }

        const getVoteResult = await this.sql`
            SELECT * FROM votes
            WHERE poll_id = ${pollId}
            AND user_id = ${user.id}
        `

        if(getVoteResult.length) {
            throw new ForbiddenException('you have already voted')
        }

        const createVote = await this.sql`
                INSERT INTO votes (poll_id, user_id)
                VALUES (${pollId}, ${user.id})
                RETURNING *;
         `

        if(!createVote.length) {
            throw new Error('failed to create vote')
        }
        
        try {

            for (const vote of votes) {
                await this.sql`
                    INSERT INTO candidatesvoted (vote_id, candidate_id)
                    VALUES (${createVote[0].id}, ${vote.candidate_id})
                `;
            }

        } catch (error) {
            // delete all the candidates voted associated with createVote
            await this.sql`
                DELETE FROM candidatesvoted
                WHERE vote_id = ${createVote[0].id}
            `
            
            // delete the vote
            await this.sql`
                DELETE FROM votes
                WHERE id = ${createVote[0].id}
            `
            
            throw error
        }

        return 'vote created'
    }

    async getVotes(user: UserType) {
        const getVotesResult = await this.sql`
            SELECT * FROM votes
            WHERE user_id = ${user.id}
        `

        return getVotesResult;;
    }

    async getVote(user: UserType, pollId: string) {
        const getVoteResult = await this.sql`
            SELECT * FROM votes
            WHERE poll_id = ${pollId}
        `

        if(!getVoteResult.length) {
            throw new NotFoundException('vote does not exist')
        }

        // if the vote does not belong to the user or the user is not an admin
        if(getVoteResult[0].user_id === user.id && user.role !== 'admin') {
            throw new ForbiddenException('the vote does not belong to you')
        }

        return getVoteResult;
    }
}
