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

        return createVote[0];
    }

    async getVotes(user: UserType) {
        const getVotesResult = await this.sql`
            SELECT * FROM votes
            WHERE user_id = ${user.id}
        `

        return getVotesResult;;
    }

    async getReviewVotes(user: UserType, pollId: string) {
        const branch = user.branch;

        const getVote = await this.sql`
            SELECT id FROM votes
            WHERE poll_id = ${pollId} AND user_id = ${user.id}
        `

        if(!getVote.length) throw new NotFoundException('vote does not exist')

        const getPollResult = await this.sql`
            WITH candidate_data AS (
                SELECT 
                    c.position_id,
                    (
                        SELECT JSON_AGG(sub.obj)
                        FROM (
                            SELECT JSON_BUILD_OBJECT(
                                'id', c2.id,
                                'photo', c2.photo,
                                'name', c2.name,
                                'description', c2.description,
                                'party_id', c2.party_id,
                                'voted', (
                                    SELECT EXISTS(
                                        SELECT 1 FROM candidatesvoted cv
                                        WHERE cv.candidate_id = c2.id
                                        AND cv.vote_id = ${getVote[0].id}
                                    )
                                )
                            )::jsonb AS obj
                            FROM candidates c2
                            WHERE c2.position_id = c.position_id
                            ORDER BY party_id
                        ) sub
                    ) AS candidates
                FROM candidates c
                GROUP BY c.position_id
            ),
            position_data AS (
                SELECT 
                    po.poll_id,
                    JSON_AGG(
                        DISTINCT JSON_BUILD_OBJECT(
                            'id', po.id,
                            'description', po.description,
                            'position', po.position,
                            'candidates', COALESCE(cd.candidates, '[]')
                        )::jsonb
                    ) AS positions
                FROM positions po
                LEFT JOIN candidate_data cd ON po.id = cd.position_id
                GROUP BY po.poll_id
            )
            SELECT 
                p.*,
                COALESCE(pd.positions, '[]') as positions
            FROM poll p
            LEFT JOIN position_data pd ON p.id = pd.poll_id
            WHERE p.branch = ${branch} AND p.id = ${pollId};
        `

        if(!getPollResult.length) {
            throw new NotFoundException('poll does not exist')
        }

        return getPollResult[0];
    }

    async getVote(user: UserType, pollId: string) {
        const getVoteResult = await this.sql`
            SELECT * FROM votes
            WHERE poll_id = ${pollId} AND user_id = ${user.id}
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
