import { candidate } from "./candidate";
import { party } from "./party";
import { position } from "./position";

export const vote_type = {
    single = "single",
    multiple = "multiple"
} as const;
export type vote_type = typeof vote_type[keyof typeof vote_type];

export type poll = {
    id: number,
    title: string,
    description?: string,
    branch: string,
    start_date: string,
    end_date: string,
    vote_type: vote_type
}

export type pollView = {
    parties: party['name'][],
} & poll

export type pollsView = pollView[]

export type pollVote = {
    parties: {
        id: party['id'],
        banner: party['banner'],
        name: party['name'],
        description: party['description']
    }[]
    positions: {
        id: number,
        position: string,
        description?: string,
        candidates: {
            id: number,
            name: string,
            photo: string,
            description?: string,
            party_id: number
        }[]
    }[]
} & poll

export type pollResult = {
    totalVotes: number,
    turnout: number,
    parties: party['name'][],
    winners: any
} & poll

export const pollStatus = {
    Upcoming = "Upcoming",
    Ongoing = "Ongoing",
    Completed = "Completed"
} as const;
export type pollStatus = typeof pollStatus[keyof typeof pollStatus];

export type vote_stat = {
    vote_date: string,
    vote_per_day: number
}

export type pollStats = {
    id: poll['id'],
    title: poll['title'],
    start_date: poll['start_date'],
    end_date: poll['end_date'],
    total_votes: number,
    participating_parties: number,
    status: pollStatus,
    votes_stats: vote_stat[],
    allowed_courses: string[],
    allowed_education_levels: string[],
}

export type pollResultStats = {
    parties: party['name'][],
    totalvotes: number,
    hasvoted: boolean,
    topcandidates: {
        id: candidate['id'],
        name: candidate['name'],
        party: party['name'],
        votes: number
    }[],
    partieswinner: {
        id: party['id'],
        name: party['name'],
        banner: party['banner'],
        votes: number
    }[],
    position_winners: {
        position_id: position['id'],
        position: position['name'],
        winners: {
            id: candidate['id'],
            name: candidate['name'],
            description: candidate['description'],
            photo: candidate['photo'],
            party_id: party['id'],
            party: party['name'],
            votes: number
        }[]
    }[]
} & poll

export type adminDashboardStatsGraph = {
    voting_trends: {
       vote_date: string,
       votes_per_day: number 
    }[],
    participationByCourse: {
        name: string,
        value: number,
    }[],
    participationByEducationLevel: {
        name: string,
        value: number,
    }[]
}

export type adminDashboardInfo = {
    active_polls: number,
    total_parties: number,
    total_positions: number,
    total_candidates: number,
    active_polls_information: {
        id: poll['id'],
        name: poll['title'],
        branch: poll['branch'],
        end_date: poll['end_date'],
        vote_type: poll['vote_type'],
        votes: number
    }[],
    poll_eligibility_overview: {
        id: poll['id'],
        name: poll['title'],
        branch: poll['branch'],
        eligible_education: string[],
        eligible_course_strand: string[]
    }[],
    poll_stats_per_poll: {
        id: poll['id'],
        name: poll['name'],
        parties: number,
        positions: number,
        candidates: number
    }[],
    most_voted_candidates: {
        id: candidate['id'],
        name: candidate['name'],
        party: party['name'],
        position: position['position'],
        totalVotes: number
    }[]
}