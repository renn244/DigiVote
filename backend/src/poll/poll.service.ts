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
            SELECT p.*, 
            COALESCE(
                JSON_AGG(pa.name) FILTER (WHERE pa.name IS NOT NULL),
                '[]'
            ) AS parties
            FROM poll p
            LEFT JOIN parties pa ON p.id = pa.poll_id
            WHERE branch = ${branch}
            GROUP BY p.id;
        `

        return getPollsForUser
    }

    async getPoll(user: UserType, pollId: string) {
        const branch = user.branch; 
        
        const getPollForUser = await this.sql`
            SELECT p.*, 
            COALESCE(
                JSON_AGG(
                    DISTINCT JSON_BUILD_OBJECT(
                        'id', pa.id,
                        'name', pa.name,
                        'description', pa.description,
                        'banner', pa.banner
                    )::jsonb
                ) FILTER (WHERE pa.id IS NOT NULL),
                '[]'
            ) as parties,
            COALESCE(
                JSON_AGG(
                    DISTINCT JSON_BUILD_OBJECT(
                        'id', po.id,
                        'position', po.position,
                        'description', po.description
                    )::jsonb
                ) FILTER (WHERE po.id IS NOT NULL),
                '[]'
            ) as positions,
            (
                SELECT COUNT(DISTINCT v2.id) 
                FROM votes v2 
                WHERE v2.poll_id = p.id
            )::INT as votesCast,
            (
                SELECT EXISTS (
                    SELECT 1
                    FROM votes v2 
                    WHERE v2.user_id = ${user.id} 
                    AND v2.poll_id = p.id 
                )
            ) as hasVoted,
            p.end_date::DATE - NOW()::DATE as daysRemaining -- get day remaining
            FROM poll p
            LEFT JOIN parties pa ON p.id = pa.poll_id
            LEFT JOIN positions po ON p.id = po.poll_id
            WHERE p.branch = ${branch} AND p.id = ${pollId} 
            GROUP BY p.id;
        `

        if(!getPollForUser.length) {
            throw new NotFoundException('Poll not found')
        }

        return getPollForUser[0]
    }

    async getPollForVoting(user: UserType, pollId: string) {
        const branch = user.branch;

        const getVotes = await this.sql`
            SELECT id, poll_id, user_id 
            FROM votes
            WHERE poll_id = ${pollId} AND user_id = ${user.id};
        `

        if(getVotes.length) {
            throw new ForbiddenException('You have already voted')
        }

        const getPoll = await this.sql`
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
                                'party_id', c2.party_id
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
                COALESCE(pd.positions, '[]') as positions,
            FROM poll p
            LEFT JOIN position_data pd ON p.id = pd.poll_id
            WHERE p.branch = ${branch} AND p.id = ${pollId};
        `

        if(!getPoll.length) {
            throw new NotFoundException('Poll not found')
        }

        return getPoll[0];
    }

    async updatePoll(user: UserType, pollId: string, body: CreatePollDto) {
        const getPoll = await this.sql`
            SELECT branch FROM poll
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
            SELECT branch FROM poll
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
