import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserType } from 'src/lib/decorator/User.decorator';
import { LiveResultGateway } from 'src/live-result/liveResult.gateway';
import { PollService } from 'src/poll/poll.service';

@Injectable()
export class VoteService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any,
        private readonly pollService: PollService,
        private readonly LiveResultGateway: LiveResultGateway
    ) {}

    async updateElectionLiveResult(voteData: { candidate_id: number }[], pollId: string) {
        this.LiveResultGateway.io.to(pollId).emit("update-live-election-result", {
            pollId: pollId,
            voteData
        })
    }

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

        const isEligible = await this.pollService.isEligibleForPoll(user.id, pollId)

        if(!isEligible.allowed) {
            throw new ForbiddenException('you are not eligible to vote')
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

        // used for updating the sockets for live election results
        this.updateElectionLiveResult(votes, pollId)

        return createVote[0];
    }

    async getVoteElectionResult(user: UserType, pollId: string) {
        const branch = user.branch

        const getUpdatedVoteCount = await this.sql`
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
                                'party_id', c2.party_id,
                                'party', pa.name,
                                'votes', ( 
                                    SELECT COUNT(cv.id) 
                                    FROM candidatesvoted cv
                                    WHERE cv.candidate_id = c2.id 
                                )
                            ) as obj
                            FROM candidates c2
                            LEFT JOIN parties pa ON pa.id = c2.party_id
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
                (
                    SELECT COUNT(DISTINCT v.id)
                    FROM votes v
                    WHERE v.poll_id = p.id
                )::INT AS totalvotes,
                COALESCE(pd.positions, '[]'::json) as positions
            FROM poll p
            LEFT JOIN position_data pd ON p.id = pd.poll_id
            WHERE p.branch = ${branch} AND p.id = ${pollId}
        `

        return getUpdatedVoteCount[0];
    }

    async getVoteHistory(user: UserType, query: { page: string, search: string }) {
        const limit = 10;
        const offset = ((parseInt(query.page) || 1) - 1) * limit;

        const getVotesResult = await this.sql`
            SELECT 
                v.id, 
                p.title as election_name,
                v.created_at, 
                p.vote_type as vote_type,
                p.id as poll_id
            FROM votes v
            LEFT JOIN poll p ON v.poll_id = p.id
            WHERE user_id = ${user.id} 
            AND p.title ILIKE ${`%${query.search}%`}
            ORDER BY v.created_at DESC
            LIMIT ${limit}
            OFFSET ${offset};
        `

        const hasNext = await this.sql`
            SELECT EXISTS(
                SELECT 1 FROM votes v
                WHERE user_id = ${user.id}
                ORDER BY created_at DESC
                OFFSET ${offset + limit}
                LIMIT 1
            ) as has_next;
        `

        return {
            votes: getVotesResult,
            hasNext: hasNext[0].has_next
        };
    }

    async getVotesStatistics(user: UserType, partyId: string) {
        const getCandidatesWithVotes = await this.sql`
            SELECT c.id, c.name, COUNT(cv.id)::INT as votes
            FROM candidates c
            LEFT JOIN candidatesvoted cv ON c.id = cv.candidate_id
            WHERE c.party_id = ${partyId}
            GROUP BY c.id
        `

        return getCandidatesWithVotes;
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

}
