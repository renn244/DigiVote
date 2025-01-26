import { party } from "./party";

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