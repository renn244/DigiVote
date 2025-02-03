import GoBackButton from "@/components/common/GoBackButton";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ElectionVotingInfo from "@/components/pages/election/ElectionVotingInfo";
import PositionCard from "@/components/pages/election/PositionCard";
import axiosFetch from "@/lib/axios";
import { poll } from "@/types/poll";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router"

type pollVote = {
    positions: {
        id: number,
        position: string,
        description?: string,
        candidates: {
            id: number,
            name: string,
            photo: string,
            description?: string,
            party_id: number,
            voted: boolean
        }[]
    }[]
} & poll

const ViewYourVote = () => {
    const { id: pollId } = useParams();

    const { data: election, isLoading } = useQuery({
        queryKey: ['pollView', pollId],
        queryFn: async () => {
            const response = await axiosFetch.get(`/vote/getReviewVotes?pollId=${pollId}`)

            if(response.status >= 400) {
                toast.error(response.data.message);
                return
            }

            return response.data as pollVote
        }
    })

    if(isLoading) {
        return <LoadingSpinner />
    }

    if(!election) {
        return <Navigate to="/notfound" />
    }

    return (
        <div className='min-h-[855px] bg-white'>
            <div className='pt-8'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
                        <div className='flex items-center space-x-4'>
                            <GoBackButton to={`/elections/${pollId}`}>
                                Back to Election
                            </GoBackButton>
                        </div>
                    </div>
                </div>
            </div>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4'>

                <ElectionVotingInfo title={election.title} description={election.description} start_date={election.start_date} 
                end_date={election.end_date} branch={election.branch} vote_type={election.vote_type} />

                {election.positions?.map((position) => (
                    <PositionCard position={position} isVoted={(_, candidateId) => {
                        return position.candidates.find((candidate) => candidate.id === candidateId)?.voted || false
                    }} />
                ))}

            </div>
        </div>
    )
}

export default ViewYourVote