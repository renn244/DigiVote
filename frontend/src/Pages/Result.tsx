import GoBackButton from "@/components/common/GoBackButton"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import SomethingWentWrong from "@/components/common/SomethingWentWrong"
import ResultStatistic from "@/components/pages/result/ResultStatistic"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, BarChart, CalendarIcon, Users, VoteIcon } from "lucide-react"
import toast from "react-hot-toast"
import { Link, Navigate, useParams } from "react-router"

const Result = () => {
    const { id } = useParams<{ id: string }>()

    const { data: result, isLoading, isError } = useQuery({
        queryKey: ['result', id],
        queryFn: async () => {
            const response = await axiosFetch.get(`/poll/results/${id}`)

            if(response.status === 404) {
                return undefined
            }

            if(response.status >= 400) {
                toast.error(response.data.message);
                return
            }

            return response.data 
        },
        refetchOnWindowFocus: false,
        retry: false
    })
    
    if(isLoading) {
        return <LoadingSpinner />
    }

    if(isError) {
        return <SomethingWentWrong />
    }

    if(!result) {
        return <Navigate to={'/notfound'} />
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-blue-900">{result.title}</h1>
                    <Badge className="text-xl">
                        {result.hasvoted ? "Voted" : "Not Voted"}
                    </Badge>
                </div>
                <GoBackButton to="/results">
                    Back to Results
                </GoBackButton>
            </div>
            
            {/* put a statistic here later */}
            <div className="mb-4">
                <ResultStatistic pollId={id || ''} />
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                <Card className="overflow-hidden border border-gray-200">
                    <CardHeader className="bg-yellow-400 text-yellow-900 p-6">
                        <CardTitle className="text-2xl">
                            Election Statistics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="space-y-3">
                                <div className="flex items-center text-sm">
                                    <Users className="mr-2 h-5 w-5 text-yellow-600" />
                                    <span>{result.branch} Branch</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <VoteIcon className="mr-2 h-5 w-5 text-yellow-600" />
                                    <span>{result.vote_type === "single" ? "Single Choice" : "Multiple Choice"}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center text-sm">
                                    <CalendarIcon className="mr-2 h-5 w-5 text-yellow-600" />
                                    <span>{new Date(result.start_date).toLocaleDateString()} - {new Date(result.end_date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <BarChart className="mr-2 h-5 w-5 text-yellow-600" />
                                    <span>Turnout: To be Implemented</span>
                                </div>
                            </div>
                        </div>
                        <p className="font-semibold mb-2">
                            Total Votes: {result.totalvotes.toLocaleString()}
                        </p>
                        <div className="mt-4">
                            <p className="font-semibold mb-2">Participating Parties: </p>
                            <div className="flex flex-wrap gap-2">
                                {result.parties.map((party: any, idx: number) => (
                                    <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                        {party}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="overflow-hidden border border-gray-200">
                    <CardHeader className="bg-yellow-400 text-yellow-900 p-6">
                        <CardTitle className="text-2xl">
                            {result.vote_type === "single" ? "Winner" : "Top Candidates"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {/* {winners.map((winner, idx) => (
                            <div key={idx} className="mb-4">
                                <p className="text-xl font-bold text-blue-900">{winner.name}</p>
                                <p className="text-lg text-gray-600">{winner.party}</p>
                                <p className="text-md text-gray-500">
                                    {winner.votes.toLocaleString()} votes ({((winner.votes / result.total_votes) * 100).toFixed(2)}%)
                                </p>
                            </div>
                        ))} */}
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-8 overflow-hidden border border-gray-200">
                <CardHeader className="bg-yellow-400 text-yellow-900 p-6">
                    <CardTitle className="text-2xl">
                        Winning Candidates
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <ul className="space-y-4">
                        {result.position_winners.map((winner: any, idx: number) => (
                            <li key={idx} className=" border-b border-gray-200 last:border-b-0">
                                <h1 className="text-lg font-bold text-yellow-500">{winner.position}</h1>
                                <div className="flex justify-between items-center pb-2">
                                    <div className="flex items-center">
                                        <p className="font-semibold text-lg">{winner.winners[0].name}</p>
                                        <p className="text-sm text-gray-500 ml-2">({winner.winners[0].party})</p>
                                    </div>
                                    <div>
                                        <span className="font-semibold">{winner.winners[0].votes.toLocaleString()} votes</span>
                                        <span className="text-sm text-gray-500 ml-2">
                                            ({((winner.winners[0].votes / result.totalvotes) * 100).toFixed(2)}%)
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}

export default Result