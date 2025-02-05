import { ForbiddenException, GoneException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserType } from 'src/lib/decorator/User.decorator';
import { CreatePollDto } from './dto/poll.dto';

@Injectable()
export class PollService {
    constructor(
        @Inject('POSTGRES_POOL') private readonly sql: any
    ) {}

    async createPoll(user: UserType, body: CreatePollDto) {
        // make this transaction
        const pollCreate = await this.sql`
            INSERT INTO poll (title, description, branch, start_date, end_date, vote_type)
            VALUES (${body.title}, ${body.description}, ${user.branch} ,${body.start_date}, ${body.end_date}, ${body.vote_type})
            RETURNING *;
        `

        if(!pollCreate.length) {
            throw new GoneException('failed to create Poll')
        }

        const createPollEligibleStudents = await this.sql`
            INSERT INTO poll_eligibility (poll_id, allowed_education_levels, allowed_courses)
            VALUES (${pollCreate[0].id}, ${body.allowed_education_levels}, ${body.allowed_courses})
        `

        return pollCreate[0]
    }

    // check if the user is eligible to vote
    async isEligibleForPoll(userId: number | string, pollId: number | string) {
        const getLatestUserInfo = await this.sql`
            SELECT education_level, course, branch
            FROM users
            WHERE id = ${userId}
        `

        const userEducation = getLatestUserInfo[0].education_level;
        const course = getLatestUserInfo[0].course;
        const branch = getLatestUserInfo[0].branch;

        const isElegibleResult = await this.sql`
            SELECT 
                (
                    CASE
                        WHEN ${userEducation} = ANY(pe.allowed_education_levels) AND 'ALL TERTIARY' = ANY(pe.allowed_courses) AND p.branch = ${branch}
                        THEN True
                        WHEN ${userEducation} = ANY(pe.allowed_education_levels) AND 'ALL SHS' = ANY(pe.allowed_courses) AND p.branch = ${branch}
                        THEN True

                        -- check if qualified
                        WHEN ${userEducation} = ANY(pe.allowed_education_levels) AND ${course} = ANY(pe.allowed_courses) AND p.branch = ${branch}
                        THEN True
                        ELSE False
                    END 
                )::boolean as allowed
            FROM poll_eligibility pe
            LEFT JOIN poll p ON p.id = pe.poll_id
            WHERE poll_id = ${pollId}
        `

        return isElegibleResult[0]
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
            AND (p.end_date + INTERVAL '5 days')> CURRENT_TIMESTAMP -- it will stay for 7 days before disappearing
            GROUP BY p.id;
        `

        return getPollsForUser
    }

    async getAdminDashboard(user: UserType) {
        const branch = user.branch;

        const getResultAdminDashboard = await this.sql`
            SELECT 
                COUNT(DISTINCT p.id)::INT as active_polls,
                COALESCE(SUM(DISTINCT total_parties), 0)::INT as total_parties,
                COALESCE(SUM(DISTINCT total_positions), 0)::INT as total_positions,
                COALESCE(SUM(DISTINCT total_candidates), 0)::INT as total_candidates,
                COALESCE(
                    JSON_AGG(
                        DISTINCT JSON_BUILD_OBJECT(
                            'id', p.id,
                            'name', p.title,
                            'branch', p.branch,
                            'end_date', p.end_date,
                            'vote_type', p.vote_type,
                            'votes', votes_counts.poll_votes::INT
                        )::jsonb
                    ) FILTER (WHERE p.id IS NOT NULL),
                    '[]'
                ) as active_polls_information,
                COALESCE(
                    JSON_AGG(
                        DISTINCT JSON_BUILD_OBJECT(
                            'id', p.id,
                            'name', p.title,
                            'branch', p.branch,
                            'eligible_education', pe.allowed_education_levels,
                            'eligible_course_strand', pe.allowed_courses
                        )::jsonb
                    ) FILTER (WHERE p.id IS NOT NULL),
                    '[]'
                ) as poll_eligibility_overview,
                COALESCE(
                    JSON_AGG(
                        DISTINCT JSON_BUILD_OBJECT(
                            'id', p.id,
                            'name', p.title,
                            'positions', total_positions,
                            'parties', total_parties,
                            'candidates', total_candidates
                        )::jsonb
                    ) FILTER (WHERE p.id IS NOT NULL),
                    '[]'
                ) as poll_stats_per_poll,
                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', most_voted.id,
                            'name', most_voted.name,
                            'party', most_voted.party_name,
                            'position', most_voted.position_name,
                            'totalVotes', most_voted.total_votes
                        )
                        ORDER BY most_voted.total_votes DESC
                    ),
                    '[]'
                ) as most_voted_candidates
            FROM poll p
            LEFT JOIN poll_eligibility pe ON pe.poll_id = p.id
            LEFT JOIN (
                SELECT 
                    c2.id, c2.name, pa.poll_id, pa.name AS party_name, po.position AS position_name,
                    COUNT(v.id) AS total_votes
                FROM candidates c2
                LEFT JOIN parties pa ON c2.party_id = pa.id
                LEFT JOIN positions po ON c2.position_id = po.id
                LEFT JOIN candidatesvoted v ON v.candidate_id = c2.id
                GROUP BY c2.id, pa.name, po.position, pa.poll_id
                ORDER BY total_votes DESC
                LIMIT 5
            ) most_voted ON most_voted.poll_id = p.id
            LEFT JOIN (
                SELECT p2.id as p2_id, COUNT(v.id) as poll_votes
                FROM poll p2
                LEFT JOIN votes v ON v.poll_id = p2.id
                GROUP BY p2.id
            ) votes_counts ON votes_counts.p2_id = p.id
            LEFT JOIN LATERAL (
                SELECT COUNT(pa.id) as total_parties
                FROM parties pa 
                WHERE pa.poll_id = p.id
            ) party_counts ON TRUE
            LEFT JOIN LATERAL (
                SELECT COUNT(po.id) as total_positions
                FROM positions po
                WHERE po.poll_id = p.id
            ) position_counts ON TRUE
            LEFT JOIN LATERAL (
                SELECT COUNT(c.id) as total_candidates
                FROM parties pa2
                LEFT JOIN candidates c ON c.party_id = pa2.id
                WHERE pa2.poll_id = p.id
            ) candidate_counts ON TRUE
            WHERE p.branch = ${branch}
            AND p.start_date <= CURRENT_TIMESTAMP AND p.end_date > CURRENT_TIMESTAMP
        `


        return getResultAdminDashboard[0];
    }
    
    async getAdminDashboardStats(user: UserType) {
        const branch = user.branch;
        
        const adminDashboardStats = await this.sql`
            SELECT JSON_AGG(
                JSON_BUILD_OBJECT(
                    'vote_date', TO_CHAR(vote_date, 'MM-DD'),
                    'votes_per_day', votes_count
                )
                ORDER BY vote_date
            ) as voting_trends
            FROM (
                SELECT
                    ds.vote_date,
                    COUNT(DISTINCT v.id) as votes_count
                FROM(
                    SELECT generate_series(
                    NOW()::DATE - INTERVAL '7 days', NOW()::DATE, '1 day'::INTERVAL
                    )::DATE AS vote_date
                ) ds
                LEFT JOIN poll p ON p.branch = ${branch}
                AND p.start_date <= CURRENT_TIMESTAMP AND p.end_date > CURRENT_TIMESTAMP
                LEFT JOIN votes v ON ds.vote_date = DATE(v.created_at)
                AND v.poll_id = p.id
                GROUP BY ds.vote_date
            ) AS daily_votes
        `

        const ParticipatingByEducationLevel = await this.sql`
            SELECT DISTINCT ON (u.education_level)
                u.education_level as name,
                COUNT(v.user_id)::INT as value
            FROM votes v 
            LEFT JOIN poll p ON p.id = v.poll_id
            LEFT JOIN users u ON v.user_id = u.id
            WHERE p.branch = ${branch}
            AND p.start_date <= CURRENT_TIMESTAMP AND p.end_date > CURRENT_TIMESTAMP
            GROUP BY u.education_level
        `

        const ParticipatingByCourse_and_Strand = await this.sql`
            SELECT DISTINCT ON (u.course)
                u.course as name,
                COUNT(v.user_id)::INT as value
            FROM poll p
            LEFT JOIN votes v  ON p.id = v.poll_id
            LEFT JOIN users u ON v.user_id = u.id
            WHERE p.branch = ${branch}
            AND p.start_date <= CURRENT_TIMESTAMP AND p.end_date > CURRENT_TIMESTAMP
            GROUP BY u.course
        `

        return {
            ...adminDashboardStats[0],
            participationByCourse: ParticipatingByCourse_and_Strand,
            participationByEducationLevel: ParticipatingByEducationLevel
        }
    }

    async getResults(user: UserType) {
        const branch = user.branch;

        const getResultsForUser = await this.sql`
            SELECT p.*,
            COALESCE(
                JSON_AGG(pa.name) FILTER (WHERE pa.id IS NOT NULL),
                '[]'
            ) as parties
            FROM poll p
            LEFT JOIN parties pa ON p.id = pa.poll_id
            WHERE p.branch = ${branch} AND p.end_date < CURRENT_TIMESTAMP
            AND (p.end_date + INTERVAL '1 month') > CURRENT_TIMESTAMP -- it will stay for 1 month
            GROUP BY p.id;
        `

        return getResultsForUser
    }

    async getPollStatistics(user: UserType, pollId: string) {
        const branch = user.branch;

        const getPollStatisticsForUser = await this.sql`
            SELECT 
                p.id, p.title, p.start_date, p.end_date,
                (
                    SELECT COUNT(DISTINCT v2.id)
                    FROM votes v2
                    WHERE v2.poll_id = p.id
                )::INT AS total_votes,
                (
                    SELECT COUNT(DISTINCT pa.id)
                    FROM parties pa
                    WHERE pa.poll_id = p.id
                )::INT AS partwicipating_parties,
                CASE 
                    WHEN CURRENT_TIMESTAMP < p.start_date THEN 'Upcoming'
                    WHEN CURRENT_TIMESTAMP BETWEEN p.start_date AND p.end_date THEN 'Ongoing'
                    WHEN CURRENT_TIMESTAMP > p.end_date THEN 'Completed'
                END AS status,
                (
                    SELECT JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'vote_date', TO_CHAR(vote_date, 'MM-DD'),
                            'votes_per_day', votes_count
                        )
                        ORDER BY vote_date
                    )
                    FROM (
                        SELECT
                            ds.vote_date,
                            COUNT(DISTINCT v.id) as votes_count
                        FROM(
                            SELECT generate_series(
                                p.start_date::DATE, p.end_date::DATE, '1 day'::INTERVAL
                            )::DATE AS vote_date
                        ) ds
                        LEFT JOIN votes v ON ds.vote_date = DATE(v.created_at)
                        AND v.poll_id = p.id
                        GROUP BY ds.vote_date
                    ) AS daily_votes
                ) AS votes_stats,
                pe.allowed_courses,
                pe.allowed_education_levels::text[] as allowed_education_levels
            FROM poll p
            LEFT JOIN poll_eligibility pe ON p.id = pe.poll_id
            WHERE p.id = ${pollId} AND p.branch = ${branch};
        `
    
        return getPollStatisticsForUser[0];
    }
    
    // for updating
    async getInitialData(user: UserType, pollId: string) {
        const branch = user.branch;

        const initialData = await this.sql`
            SELECT
            p.*, 
            pe.allowed_courses,
            pe.allowed_education_levels::text[] as allowed_education_levels
            FROM poll p
            LEFT JOIN poll_eligibility pe ON p.id = pe.poll_id
            WHERE p.id = ${pollId} AND p.branch = ${branch}
        `

        if(!initialData.length) {
            throw new NotFoundException('failed to find initial poll')
        }

        return initialData[0];
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
            ( -- getting the amount of people who voted for the last hour
                SELECT COUNT(v3.id)
                FROM votes as v3
                WHERE v3.poll_id = ${pollId} 
                AND v3.created_at BETWEEN (CURRENT_TIMESTAMP - interval '1 hour') AND CURRENT_TIMESTAMP
            )::INT as voteforthe_last_hour,
            registered_voters.registered_count as registered_voters,
            pe.allowed_courses,
            pe.allowed_education_levels::text[] as allowed_education_levels,
            p.end_date::DATE - NOW()::DATE as daysRemaining -- get day remaining
            FROM poll p
            LEFT JOIN parties pa ON p.id = pa.poll_id
            LEFT JOIN positions po ON p.id = po.poll_id
            LEFT JOIN poll_eligibility pe ON p.id = pe.poll_id
            JOIN ( -- ISSUE: when user change information like branch, or course the voter turnout will be affected and also registered vote. must create registered_voter with dates so that it's contants and not based on realtime
                SELECT 
                    pe.poll_id,
                    COUNT(u.id)::INT AS registered_count
                FROM poll_eligibility pe
                JOIN poll p2 ON p2.id = pe.poll_id
                JOIN users u ON (
                    ('ALL SHS' = ANY(pe.allowed_courses) AND u.education_level = ANY(pe.allowed_education_levels) AND p2.branch = u.branch) OR
                    ('ALL TERTIARY' = ANY(pe.allowed_courses) AND u.education_level = ANY(pe.allowed_education_levels) AND p2.branch = u.branch ) OR 
                    (u.course = ANY(pe.allowed_courses) AND u.education_level = ANY(pe.allowed_education_levels) AND p2.branch = u.branch)
                )
                GROUP BY pe.poll_id
            ) as registered_voters ON registered_voters.poll_id = p.id
            WHERE p.branch = ${branch} AND p.id = ${pollId}
            GROUP BY p.id, pe.allowed_courses, pe.allowed_education_levels, registered_voters.registered_count;
        `

        if(!getPollForUser.length) {
            throw new NotFoundException('Poll not found')
        }

        const isEligible = await this.isEligibleForPoll(user.id, pollId)

        return { 
            ...getPollForUser[0],
            ...isEligible
        }
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

        const isEligible = await this.isEligibleForPoll(user.id, pollId)

        if(!isEligible.allowed) {
            throw new ForbiddenException({
                name: 'eligible',
                message: 'you are not eligible to vote'
            })
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
                COALESCE(
                    (
                        SELECT JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'id', pa.id,
                                'name', pa.name,
                                'description', pa.description,
                                'banner', pa.banner,
                                'poll_id', pa.poll_id
                            )
                        )
                        FROM parties pa
                        WHERE pa.poll_id = p.id
                    ), 
                    '[]'
                ) as parties,
                COALESCE(pd.positions, '[]') as positions
            FROM poll p
            LEFT JOIN position_data pd ON p.id = pd.poll_id
            WHERE p.branch = ${branch} AND p.id = ${pollId};
        `

        if(!getPoll.length) {
            throw new NotFoundException('Poll not found')
        }

        return getPoll[0];
    }

    async getResult(user: UserType, pollId: string) {
        const branch = user.branch;

        // get turnout later
        const getResultForUser = await this.sql`
            SELECT p.id, p.title, p.description, p.start_date, p.end_date, p.vote_type, p.branch,
            COALESCE(
                JSON_AGG(
                   DISTINCT pa.name
                ) FILTER (WHERE pa.id IS NOT NULL),
                '[]'
            ) as parties,
            (
                SELECT COUNT(v.id)
                FROM votes v
                WHERE v.poll_id = p.id
            )::INT as totalvotes,
            (
                SELECT EXISTS(
                    SELECT 1
                    FROM votes v
                    WHERE v.poll_id = p.id
                    AND v.user_id = ${user.id}
                )
            ) as hasVoted,
            ( -- for multiple choice
                CASE 
                    WHEN p.vote_type = 'multiple' THEN (
                        SELECT JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'id', c.id,
                                'name', c.name,
                                'party', c.party,
                                'votes', COALESCE(c.total_votes, 0) -- Handle NULL cases
                            )
                        )
                        FROM (
                            SELECT c.id, c.name, pa.name as party, COALESCE(vote_counts.total_votes, 0) AS total_votes
                            FROM candidates c
                            LEFT JOIN parties pa ON c.party_id = pa.id
                            LEFT JOIN (
                                SELECT candidate_id, COUNT(id) as total_votes
                                FROM candidatesvoted
                                GROUP BY candidate_id
                            ) vote_counts ON c.id = vote_counts.candidate_id    
                            WHERE pa.poll_id = p.id
                            ORDER BY total_votes DESC -- Sort candidates by votes (highest first)
                            LIMIT 3 -- Select the top 3 candidates
                        ) c
                    )
                    ELSE '[]'::json
                END
            ) AS topcandidates,
            ( -- for single choice
                CASE 
                    WHEN p.vote_type = 'single' THEN (
                        SELECT JSON_AGG(
                            JSON_BUILD_OBJECT(
                                'id', pa.id,
                                'name', pa.name,
                                'banner', pa.banner,
                                'votes', top_candidate.votes -- the candidates votes is all the same so just pick 1 and base it as the parties since it's a single choice
                            )
                            ORDER BY top_candidate.votes DESC
                        )
                        FROM parties pa
                        JOIN (
                            SELECT DISTINCT ON (c2.party_id) 
                                c2.party_id, COUNT(v2.id) AS votes
                            FROM candidates c2
                            LEFT JOIN candidatesvoted v2 ON v2.candidate_id = c2.id
                            GROUP BY c2.party_id, c2.id
                            ORDER BY c2.party_id, votes DESC  -- Ensure highest-voted candidate is chosen
                        ) top_candidate ON pa.id = top_candidate.party_id
                        WHERE pa.poll_id = p.id
                    )
                    ELSE '[]'::json
                END
            ) AS partieswinner,
            COALESCE (
                JSON_AGG(
                    DISTINCT JSON_BUILD_OBJECT(
                        'position_id', winners.position_id,
                        'position', winners.position,
                        'winners', winners.winner
                    )::jsonb 
                ) FILTER (WHERE winners.position_id IS NOT NULL),
                '[]'
            ) as position_winners
            -- get results or winner, depending if it is single or multiple choice
            FROM poll p
            LEFT JOIN parties pa ON p.id = pa.poll_id
            LEFT JOIN LATERAL (
                SELECT DISTINCT ON (po.id)
                    po.id as position_id,
                    po.position,
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', c.id,
                            'name', c.name,
                            'photo', c.photo,
                            'description', c.description,
                            'party_id', c.party_id,
                            'party', pa.name,
                            'votes', vote_counts.total_votes
                        )
                        ORDER BY vote_counts.total_votes DESC -- ensure that the person with the most vote goes on the top
                    ) AS winner
                FROM positions po
                LEFT JOIN candidates c ON po.id = c.position_id
                LEFT JOIN parties pa ON c.party_id = pa.id
                LEFT JOIN LATERAL (
                    SELECT 
                        COUNT(v.id) as total_votes,
                        ROW_NUMBER() OVER (ORDER BY COUNT(v.id) DESC) AS rank
                    FROM candidatesvoted v
                    WHERE v.candidate_id = c.id
                    GROUP BY v.candidate_id
                ) vote_counts ON TRUE
                WHERE po.poll_id = p.id 
                GROUP BY po.id
            ) winners ON TRUE
            WHERE p.branch = ${branch} AND p.id = ${pollId}
            GROUP BY p.id;
        `

        if(!getResultForUser.length) {
            throw new NotFoundException('Poll not found')
        }

        // check if pooll has ended using date
        if(new Date(getResultForUser[0].end_date) > new Date()) {
            throw new ForbiddenException('Poll has not ended')
        }
        
        return getResultForUser[0]
    }

    async getResultStatistics(user: UserType, pollId: string) {
        const branch = user.branch;

        const getResultStatisticsForUser = await this.sql`
            WITH candidate_data AS (
                SELECT 
                    c.position_id,
                    (
                        SELECT JSON_AGG(sub.obj)
                        FROM (
                            SELECT JSON_BUILD_OBJECT(
                                'id', c2.id,
                                'name', c2.name,
                                'party_id', c2.party_id,
                                'votes', (
                                    SELECT COUNT(v.id)
                                    FROM candidatesvoted v
                                    WHERE v.candidate_id = c2.id
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
                            'position', po.position,
                            'candidates', COALESCE(cd.candidates, '[]')
                        )::jsonb
                    ) AS positions
                FROM positions po
                LEFT JOIN candidate_data cd ON po.id = cd.position_id
                GROUP BY po.poll_id
            )
            SELECT 
                COALESCE(pd.positions, '[]') as positions,
                (
                    SELECT JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'id', pa.id,
                            'name', pa.name
                        )::jsonb
                    )
                    FROM parties pa 
                    WHERE pa.poll_id = p.id
                ) as parties
            FROM poll p
            LEFT JOIN position_data pd ON p.id = pd.poll_id
            WHERE p.branch = ${branch} AND p.id = ${pollId} AND p.end_date < NOW()
        `

        return getResultStatisticsForUser[0];
    }

    async updatePoll(user: UserType, pollId: string, body: CreatePollDto) {
        // should be a transaction because well never know if what fail
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

        const updatePollElegibility = await this.sql`
            UPDATE poll_eligibility
            SET 
                allowed_courses = ${body.allowed_courses},
                allowed_education_levels = ${body.allowed_education_levels}
            WHERE poll_id = ${pollId}
            RETURNING allowed_courses, allowed_education_levels::text[];
        `

        if(!updatePoll.length || !updatePollElegibility) {
            throw new GoneException('failed to update Poll')
        }

        return {
            ...updatePoll[0],
            ...updatePollElegibility[0]
        }
    }

    // should i delete or archive the poll?
    async deletePoll(user: UserType, pollId: string) {

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
