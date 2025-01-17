import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserType } from 'src/lib/decorator/User.decorator';

@Injectable()
export class VoteService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any
    ) {}

    async createVote(user: UserType, pollId: string, votes: { vote_id: string, candidate_id: string }[]) {
        const getPollResult = await this.sql`
            SELECT * FROM poll
            WHERE id = ${pollId}
        `

        if(!getPollResult.length) {
            throw new NotFoundException('poll does not exist')
        }

        if(getPollResult[0].status === 'closed') {
            throw new ForbiddenException('poll is closed')
        }

        const getVoteResult = await this.sql`
            SELECT * FROM vote
            WHERE poll_id = ${pollId}
            AND user_id = ${user.id}
        `

        if(getVoteResult.length) {
            throw new ForbiddenException('you have already voted')
        }

        // is this a transaction??
        await this.sql.begin(async (sql: any) => {
            const createVote = await sql`
                INSERT INTO votes (poll_id, user_id)
                VALUES (${pollId}, ${user.id})
                RETURNING *;
            `

            if(!createVote.length) {
                throw new Error('failed to create vote')
            }

            await sql`
                INSERT INTO candidatesvoted (vote_id, candidate_id)
                VALUES ${votes.map((vote, idx) => 
                    `(${createVote[0].id}, ${vote.candidate_id})${idx === votes.length - 1 ? '' : ','}`
                )}
            `
        })

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
