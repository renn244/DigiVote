
type PartyCardProps = {
    parties: any,
    handleVoteSingle: (partyId: number) => void,
    isVoted: (partyId: number) => boolean
}

// for voting
const PartyCard = ({
    parties,
    handleVoteSingle,
    isVoted
}: PartyCardProps) => {
    return (
        <div onClick={() => handleVoteSingle(parties.id)} className={`flex flex-col items-center p-4 border rounded-lg 
        ${isVoted(parties.id) ? 'bg-yellow-50': ""} cursor-pointer`}>
            <div className="relative flex-shrink-0  flex justify-center w-full mb-2">
                <img src={parties.banner} className="rounded-lg h-[300px] object-contain" />
            </div>
            <div className="flex-grow px-4 w-full">
                <h2 className="text-2xl font-bold my-2">{parties.name}</h2>
                <p className="text-sm mt-1">{parties.description}</p>
            </div>
        </div>
    )
}

export default PartyCard