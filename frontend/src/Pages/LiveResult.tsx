import GoBackButton from "@/components/common/GoBackButton"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import SomethingWentWrong from "@/components/common/SomethingWentWrong"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useAuthContext } from "@/context/AuthContext"
import axiosFetch from "@/lib/axios"
import { liveResult } from "@/types/poll"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Calendar, User2, Vote } from "lucide-react"
import { useEffect } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { io } from 'socket.io-client'

const config = {}

const LiveResult = () => {
    const queryClient = useQueryClient();
    const { pollId } = useParams<{ pollId: string }>()
    const { user } = useAuthContext()

    const { data:electionResult, isLoading, isError } = useQuery({
        queryKey: ['getVoteElectionResult', pollId],
        queryFn: async () => {
            const response = await axiosFetch.get(`/vote/getVoteElectionResult?pollId=${pollId}`)

            if(response.status >= 400) {
                toast.error(response.data.message)
                throw new Error()
            }

            return response.data as liveResult
        },
        refetchOnWindowFocus: false
    })

    useEffect(() => {

        const isProduction = import.meta.env.VITE_SOFTWARE_ENV === 'production'
        const socketUrl = isProduction ? '' : 'http://localhost:5000'
        // TODO:
        // this might introduce race conditions and we might want to put it in a async function but
        // make sure to have a clean up function on the inside because we want to close the socket
        const socket = io(socketUrl, {
            query: {
                userId: user.id
            },
            reconnection: true,
            reconnectionAttempts: 5,
            autoConnect: true,
            transports: ['websocket', 'polling']
        })

        socket.emit('joinPollResultRoom', {
            pollId: pollId
        })

        socket.on("update-live-election-result", async (data) => {
            await queryClient.setQueryData(['getVoteElectionResult', pollId], (old: liveResult) => ({
                ...old,
                totalvotes: old.totalvotes + 1,
                position: old.positions.map((position) => { 
                    return {
                        ...position,
                        candidates: position.candidates.map((candidate) => {
                            const isFound = data.voteData.find((c: any) => c.candidate_id === candidate.id)

                            if(isFound) {
                                candidate.votes ++ // increment
                            }

                            return candidate
                        })
                    }
                })
            }))
        })
        
        return () => {
            socket.off('update-live-election-result')
            socket.close();
        }
    }, [])

    if(isLoading) return <LoadingSpinner />

    if(isError || !electionResult) {
        return <SomethingWentWrong />
    }

    return (
        <div className="min-h-[855px] bg-white ">
                <div className="max-w-6xl mx-auto space-y-4 p-3 py-5 md:p-8">
                    <GoBackButton to={`/elections/${pollId}`}>
                        Back to Election
                    </GoBackButton>
                    {/* Election Info */}
                    <Card>
                        <CardHeader className="md:flex-row items-center space-y-0 md:gap-3">
                            <CardTitle>
                                Live Election Results
                            </CardTitle>
                            - 
                            <CardTitle className="text-blue-900">
                                {electionResult.title}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <User2 className="h-5 w-5" />
                                    <span>{electionResult.branch}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="h-5 w-5" />
                                    <span>
                                        {new Date(electionResult.start_date).toLocaleDateString()} - {new Date(electionResult.end_date).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Vote className="h-5 w-5" />
                                    <span>Total Votes: {electionResult.totalvotes}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Position Results */}
                    {electionResult.positions.map((position) => (
                        <Card key={position.id}>
                            <CardHeader>
                                <CardTitle>
                                    {position.position}
                                </CardTitle>
                                <CardDescription>
                                    {position.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Chart */}
                                <div className="h-[300px] mb-6 hidden sm:block">
                                        <ResponsiveContainer width={"100%"} height={300}>
                                            <ChartContainer config={config}>
                                                <BarChart data={position.candidates}>
                                                    <CartesianGrid strokeDasharray={"3 3"} />
                                                    <XAxis dataKey={"name"} />
                                                    <YAxis domain={[0, electionResult.totalvotes]}  />
                                                    <ChartTooltip content={<ChartTooltipContent />} />
                                                    <Bar dataKey={"votes"} fill="#FFD700" radius={[5, 5, 0, 0]} />
                                                </BarChart>
                                            </ChartContainer>
                                        </ResponsiveContainer>
                                </div>

                                {/* Detailed Results */}
                                <div className="space-y-2">
                                    {position.candidates
                                    .sort((a, b) => b.votes - a.votes) // sorted so that the leading will be shown
                                    .map((candidate, idx) => {
                                        const totalVotes = position.candidates.reduce((sum, c) => sum + c.votes, 0);
                                        const percentage = totalVotes === 0 ? 0 : ((candidate.votes / totalVotes) * 100).toFixed(2)
                                        const isLeading = idx === 0 && candidate.votes > 0

                                        return (
                                            <div key={candidate.id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <div className="font-semibold text-gray-900">
                                                            {candidate.name}
                                                            {isLeading && <Badge className="ml-2 bg-[#FFD700] text-gray-900">Leading</Badge>}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                                                {candidate.party}
                                                            </Badge>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-gray-900">{candidate.votes} votes</div>
                                                    <div className="text-sm text-gray-500">{percentage}%</div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
    )
}

export default LiveResult