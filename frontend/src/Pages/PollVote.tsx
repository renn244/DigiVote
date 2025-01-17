import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import axiosFetch from '@/lib/axios'
import { pollVote } from '@/types/poll';
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, CalendarIcon, Users, VoteIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { Link, Navigate, useParams } from 'react-router'

const PollVote = () => {
    const { id:pollId } = useParams();
    
    const { data: election, isLoading } = useQuery({
        queryKey: ['pollVote', ], 
        queryFn: async () => {
            const response = await axiosFetch.get(`/poll/getPollForVoting/${pollId}`)

            if(response.status !== 200) {
                toast.error(response.data.message);
                return
            }

            return response.data as pollVote
        },
        refetchOnWindowFocus: false
    })

    if(isLoading) {
        return <LoadingSpinner />
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
                                    <div key={candidate.id} className='flex flex-col items-start p-4 border rounded-lg'>
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
                    <Button size="lg" className='bg-green-500 hover:bg-green-600 text-white'>
                        Submit Vote
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default PollVote