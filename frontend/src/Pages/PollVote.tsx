import LoadingSpinner from '@/components/common/LoadingSpinner';
import YouAlreadyVoted from '@/components/pages/election/YouAlreadyVoted';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import axiosFetch from '@/lib/axios'
import { pollVote } from '@/types/poll';
import { useMutation, useQuery } from '@tanstack/react-query'
import { ArrowLeft, CalendarIcon, Users, VoteIcon } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Link, Navigate, useParams } from 'react-router'

type voteState = {
    positionId: number,
    candidateId: number | undefined
}[]

const PollVote = () => {
    const { id:pollId } = useParams();
    const [votedAlready, setVotedAlready] = useState(false)
    const [votes, setVotes] = useState<voteState>()

    const { data: election, isLoading } = useQuery({
        queryKey: ['pollVote', pollId],
        queryFn: async () => {
            const response = await axiosFetch.get(`/poll/getPollForVoting/${pollId}`)

            if(response.status === 403) {
                setVotedAlready(true)
                return
            }
            
            if(response.status >= 400) {
                toast.error(response.data.message);
                return
            }

            const poll = response.data as pollVote
            // setting up the state for voting
            setVotes([...poll.positions.map((position) => {
                return {
                    positionId: position.id,
                    candidateId: undefined,
                }   
            })])
            return poll
        },
        refetchOnWindowFocus: false
    })

    const { mutate: submitVote, isPending } = useMutation({
        mutationKey: ['submitVote'],
        mutationFn: async () => {
            if(votes?.some((vote) => vote.candidateId === undefined)) {
                toast.error("Please vote for all positions")
                return
            }
            const votesData = votes?.map(vote => ({ candidate_id: vote.candidateId}))
            const response = await axiosFetch.post(`/vote?pollId=${pollId}`, votesData)

            if(response.status >= 400) {
                toast.error(response.data.message)
                return
            }

            // if successfull redirect
            
            return response.data
        }
    })

    const handleVote = (positionId: number, candidateId: number) => {
        setVotes((prevVotes) => {
            return prevVotes?.map((vote) => {
                if(vote.positionId === positionId) {
                    return {
                        ...vote,
                        candidateId: candidateId
                    }
                }

                return vote
            })
        })
    }

    const isVoted = (positionId: number, candidateId: number) => {
        return votes?.some((vote) => vote.positionId === positionId && vote.candidateId === candidateId)
    }

    if(isLoading) {
        return <LoadingSpinner />
    }

    if(votedAlready) {
        return <YouAlreadyVoted pollId={pollId} />
    }

    if(!election) {
        return <Navigate to='/notfound' />
    }

    return (
        <div className='min-h-[855px] bg-white'>
            <div className='text-yellow-900 pt-8'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0'>
                        <div className='flex items-center space-x-4'>
                            <Button variant="outline" asChild className="bg-white hover:bg-yellow-100">
                                <Link to="/" className='flex items-center'>
                                    <ArrowLeft className='mr-2 h-4 w-4' />
                                    <span className='font-semibold'>Back to Election</span>
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4'>
                <Card className='mb-8'>
                    <CardHeader>
                        <CardTitle>
                            {election.title}
                        </CardTitle>
                        <CardDescription>
                            {election.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <h2 className='text-xl font-semibold'>Election Information</h2>
                        <Separator className='mt-2 mb-4' />
                        <div className='grid grid-cols-3 gap-2 justify-around'>
                            <div className='flex items-center justify-center'>
                                <CalendarIcon className="mr-2 h-5 w-5 text-yellow-600" />
                                <span>
                                    {new Date(election.start_date).toLocaleDateString()} - {new Date(election.end_date).toLocaleDateString()}
                                </span>
                            </div>
                            <div className='flex items-center justify-center'>
                                <Users className='mr-2 h-5 w-5 text-yellow-600' />
                                <span>
                                    {election.branch} Branch
                                </span>
                            </div>
                            <div className='flex items-center justify-center'>
                                <VoteIcon className='mr-2 h-5 w-5 text-yellow-600' />
                                <span>
                                    {election.vote_type === "single" ? "Single Vote" : "Multiple Votes"}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                {election.positions.map((position) => (
                    <Card key={position.id} className='mb-8'>
                        <CardHeader>
                            <CardTitle>
                                {position.position}
                            </CardTitle>
                            <CardDescription>
                                {position.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-${position.candidates.length} gap-4`}>
                                {position.candidates.map((candidate) => (
                                    <div onClick={() => handleVote(position.id, candidate.id)}
                                    key={candidate.id} className={`flex flex-col items-start p-4 border rounded-lg 
                                    ${isVoted(position.id, candidate.id) ? "bg-yellow-50" : ""} cursor-pointer`}>
                                        <div className='relative flex-shrink-0 flex justify-center w-full mb-2'>
                                            <img src={candidate.photo} className='rounded-lg h-[300px] w-[300px]' />
                                        </div>
                                        <div className='flex-grow px-4'>
                                            <h2 className='text-2xl font-bold my-2'>{candidate.name}</h2>
                                            <p className="text-sm mt-1">{candidate.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                <Separator className="my-8" />

                <div className='flex justify-end'>
                    <Button onClick={() => submitVote()} disabled={isPending}
                    size="lg" className='bg-green-500 hover:bg-green-600 text-white'>
                        {isPending ? <LoadingSpinner /> : "Submit Vote"}
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PollVote