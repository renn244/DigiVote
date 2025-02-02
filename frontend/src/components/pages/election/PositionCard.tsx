import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type PositionCardProps = {
    position: any
    handleClick?: (positionId: number, candidateId: number) => void
    isVoted: (positionId: number, candidateId: number) => boolean
}

const PositionCard = ({
    position,
    handleClick,
    isVoted
}: PositionCardProps) => {

    return (
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>{position.position}</CardTitle>
                <CardDescription>{position.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${position.candidates.length} gap-4`}>
                    {position.candidates.map((candidate: any) => (
                        <div onClick={() => handleClick && handleClick(position.id, candidate.id)}
                        key={candidate.id} className={`flex flex-col items-start p-4 border rounded-lg 
                        ${isVoted(position.id, candidate.id) ? "bg-yellow-50" : ""} cursor-pointer`}>
                            <div className='relative flex-shrink-0 flex justify-center w-full mb-2'>
                                <img src={candidate.photo} className='rounded-lg h-[300px] w-[300px]' />
                            </div>
                            <div className='flex-grow px-4 w-full'>
                                <h2 className='text-2xl font-bold my-2'>{candidate.name}</h2>
                                <p className="text-sm mt-1">{candidate.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default PositionCard