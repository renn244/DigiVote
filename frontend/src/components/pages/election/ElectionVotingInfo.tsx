import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { poll } from "@/types/poll"
import { CalendarIcon, Users, VoteIcon } from "lucide-react"

type ElectionVotingInfoProps = {
    title: poll['title'],
    description: poll['description'],
    start_date: poll['start_date'],
    end_date: poll['end_date'],
    branch: poll['branch'],
    vote_type: poll['vote_type']
}

const ElectionVotingInfo = ({
    title,
    description,
    start_date,
    end_date,
    branch,
    vote_type
}: ElectionVotingInfoProps) => {
    return (
        <Card className='mb-8'>
            <CardHeader>
                <CardTitle>
                    {title}
                </CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <h2 className='text-xl font-semibold'>Election Information</h2>
                <Separator className='mt-2 mb-4' />
                <div className='grid grid-cols-3 gap-2 justify-around'>
                    <div className='flex items-center justify-center'>
                        <CalendarIcon className="mr-2 h-5 w-5 text-yellow-600" />
                        <span>
                            {new Date(start_date).toLocaleDateString()} - {new Date(end_date).toLocaleDateString()}
                        </span>
                    </div>
                    <div className='flex items-center justify-center'>
                        <Users className='mr-2 h-5 w-5 text-yellow-600' />
                        <span>
                            {branch} Branch
                        </span>
                    </div>
                    <div className='flex items-center justify-center'>
                        <VoteIcon className='mr-2 h-5 w-5 text-yellow-600' />
                        <span>
                            {vote_type === "single" ? "Single Vote" : "Multiple Votes"}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default ElectionVotingInfo