
export type candidate = {
    id: number,
    photo: string,
    name: string,
    description?: string,

    party_id: number,
    position_id: number,

    created_at: string,
    updated_at: string,
}

export type candidateWithPosition = {
    position: string,
} & candidate