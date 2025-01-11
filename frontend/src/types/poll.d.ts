
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