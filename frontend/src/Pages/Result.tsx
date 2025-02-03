import GoBackButton from "@/components/common/GoBackButton"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import SomethingWentWrong from "@/components/common/SomethingWentWrong"
import ResultStatistic from "@/components/pages/result/ResultStatistic"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import { pollResultStats } from "@/types/poll"
import { useQuery } from "@tanstack/react-query"
import { CalendarIcon, Users, VoteIcon } from "lucide-react"
import toast from "react-hot-toast"
import { Navigate, useParams } from "react-router"

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

            return response.data as pollResultStats
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

    // handling draws in parties
    const firstParty = result.partieswinner?.[0]
    const winningParties = result.partieswinner.filter((party: any) => firstParty.votes === party.votes);
    const isDrawParties = winningParties.length >= 2;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <h1 className="text-3xl font-bold text-blue-900">{result.title}</h1>
                    <Badge className="text-xl ml-3">
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
                                {/* <div className="flex items-center text-sm">
                                    <BarChart className="mr-2 h-5 w-5 text-yellow-600" />
                                    <span>Turnout: To be Implemented</span>
                                </div> */}
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
                            {result.vote_type === "single" ? (
                                <div className="flex justify-between">
                                    Winning Parties 
                                    <Badge variant="secondary" className="hover:bg-secondary cursor-pointer">
                                        {isDrawParties ? "Draw" : "Winner"}
                                    </Badge>
                                </div>
                            ) : "Top Candidates"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {result.vote_type === "multiple" ? (
                            result.topcandidates.map((candidate: any, idx: number) => (
                                <div key={idx} className="mb-2 flex justify-between items-center">
                                    <div className="flex items-center">
                                        <p className="text-lg font-bold text-blue-900">{candidate.name}</p>
                                        <p className=" text-gray-600 ml-2">({candidate.party})</p>
                                    </div>
                                    <p className="text-md text-gray-500">
                                        {candidate.votes.toLocaleString()} votes ({((candidate.votes / result.totalvotes) * 100).toFixed(2)}%)
                                    </p>
                                </div>
                            ))
                        ) : (
                            <div className="grid justify-center md:grid-cols-2 gap-6">
                                {winningParties.map((party: any) => (
                                    <div key={party.id} className="border rounded-lg">
                                        <div className="mb-1">
                                            <img src={party.banner} className="rounded-t-lg w-full h-[150px]" />  
                                        </div>
                                        <div className="px-2 pb-2">
                                            <h2 className="font-bold text-lg">{party.name}</h2>
                                            
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                        {result.position_winners.map((winner: any, idx: number) => {
                            const firstWinner = winner.winners[0].votes
                            const winners = winner.winners.filter((currwinner: any) => firstWinner == currwinner.votes)

                            const isDraw = winners.length >= 2;

                            return (
                                <li key={idx} className=" border-b border-gray-200 last:border-b-0">
                                    <div className="flex justify-between items-center">
                                        <h1 className="text-lg font-bold text-yellow-500">{winner.position}</h1>
                                        <Badge>
                                            {isDraw ? "Draw" : "Winner"}
                                        </Badge>
                                    </div>
                                    <div className="flex justify-between items-center pb-2">
                                        <div className="flex items-center max-w-[600px]">
                                            {winners.map((winner: any, idx: number) => (
                                                <div key={idx} className="flex items-center">
                                                    <p className="font-semibold text-lg">{winner.name}</p>
                                                    <p className="text-sm text-gray-500 ml-2">({winner.party})</p>
                                                    {isDraw && idx !== winners.length - 1 && <span className="mx-2 font-semibold">&</span>}
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <span className="font-semibold">{winner.winners[0].votes.toLocaleString()} votes</span>
                                            <span className="text-sm text-gray-500 ml-2">
                                                ({((winner.winners[0].votes / result.totalvotes) * 100).toFixed(2)}%)
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                </CardContent>
            </Card>
        </div>
    )
}

export default Result