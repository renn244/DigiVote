import LoadingSpinner from "@/components/common/LoadingSpinner"
import SomethingWentWrong from "@/components/common/SomethingWentWrong"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, BarChart, CalendarIcon, Users, VoteIcon } from "lucide-react"
import toast from "react-hot-toast"
import { Link, Navigate, useParams } from "react-router"

const electionResult = [
    {
        id: "1",
        title: "2024 Presidential Election",
        date: "2024-11-03",
        type: "Federal",
        voteType: "single",
        totalVotes: 150000000,
        turnout: 66.8,
        parties: ["Blue Party", "Red Party", "Green Party", "Independent"],
        results: [
          { name: "Candidate A", party: "Blue Party", votes: 78000000 },
          { name: "Candidate B", party: "Red Party", votes: 72000000 },
          { name: "Candidate C", party: "Green Party", votes: 3000000 },
          { name: "Candidate D", party: "Independent", votes: 2000000 },
        ],
    },
    {
        id: "2",
        title: "2024 Senate Election",
        date: "2024-11-03",
        type: "Federal",
        voteType: "multiple",
        totalVotes: 145000000,
        turnout: 64.5,
        parties: ["Blue Party", "Red Party", "Green Party", "Libertarian Party"],
        results: [
          { name: "Candidate E", party: "Blue Party", votes: 40000000 },
          { name: "Candidate F", party: "Red Party", votes: 38000000 },
          { name: "Candidate G", party: "Green Party", votes: 35000000 },
          { name: "Candidate H", party: "Libertarian Party", votes: 32000000 },
        ],
    },
]

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

    const election = electionResult[0];

    const sortedResults = [...election.results].sort((a, b) => b.votes - a.votes)
    const winners = election.voteType === "single" ? [sortedResults[0]] : sortedResults.slice(0, 2)

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center mb-6">
                <Button variant="outline" className="mr-4" asChild>
                    <Link to="/results">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Results
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold text-blue-900">{election.title}</h1>
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
                                    <span>{election.type}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <VoteIcon className="mr-2 h-5 w-5 text-yellow-600" />
                                    <span>{election.voteType === "single" ? "Single Choice" : "Multiple Choice"}</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center text-sm">
                                    <CalendarIcon className="mr-2 h-5 w-5 text-yellow-600" />
                                    <span>{election.date}</span>
                                </div>
                                <div className="flex items-center text-sm">
                                    <BarChart className="mr-2 h-5 w-5 text-yellow-600" />
                                    <span>Turnout: {election.turnout}</span>
                                </div>
                            </div>
                        </div>
                        <p className="font-semibold mb-2">
                            Total Votes: {election.totalVotes.toLocaleString()}
                        </p>
                        <div className="mt-4">
                            <p className="font-semibold mb-2">Participating Parties: </p>
                            <div className="flex flex-wrap gap-2">
                                {election.parties.map((party, idx) => (
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
                            {election.voteType === "single" ? "Winner" : "Top Candidates"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        {winners.map((winner, idx) => (
                            <div key={idx} className="mb-4">
                                <p className="text-xl font-bold text-blue-900">{winner.name}</p>
                                <p className="text-lg text-gray-600">{winner.party}</p>
                                <p className="text-md text-gray-500">
                                    {winner.votes.toLocaleString()} votes ({((winner.votes / election.totalVotes) * 100).toFixed(2)}%)
                                </p>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-8 overflow-hidden border border-gray-200">
                <CardHeader className="bg-yellow-400 text-yellow-900 p-6">
                    <CardTitle className="text-2xl">
                        All Candidates
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <ul className="space-y-4">
                        {sortedResults.map((result, idx) => (
                            <li
                            key={idx}
                            className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0">
                                <div>
                                    <p className="font-semibold text-lg">{result.name}</p>
                                    <p className="text-sm text-gray-500 ml-2">({result.party})</p>
                                </div>
                                <div>
                                    <span className="font-semibold">{result.votes.toLocaleString()} votes</span>
                                    <span className="text-sm text-gray-500 ml-2">
                                        ({((result.votes / election.totalVotes) * 100).toFixed(2)}%)
                                    </span>
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