import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, CalendarIcon, Percent, Users, VoteIcon } from "lucide-react"
import { Link, Navigate, useParams } from "react-router"

const elections = [
    {
        id: "1",
        title: "2024 Presidential Election",
        description: "National election to choose the next president of the United States. This election will determine the country's leadership for the next four years.",
        longDescription: "The 2024 United States presidential election will be the 60th quadrennial presidential election. Voters will select presidential electors who in turn will elect a new president and vice president through the Electoral College. The election will likely be held on November 5, 2024, as part of the 2024 United States elections.",
        branch: "Federal",
        start_date: "2024-11-03T00:00:00Z",
        end_date: "2024-11-03T23:59:59Z",
        vote_type: "single",
        location: "Nationwide",
        parties: [
        {
            name: "Democratic Party",
            banner: "/democratic-party-banner.jpg",
            description: "Center-left political party that promotes social liberal policies and a mixed economy."
        },
        {
            name: "Republican Party",
            banner: "/republican-party-banner.jpg",
            description: "Center-right political party that supports lower taxes, free market capitalism, and a strong national defense."
        },
        {
            name: "Green Party",
            banner: "/green-party-banner.jpg",
            description: "Left-wing party that emphasizes environmentalism, non-violence, social justice, and grassroots organizing."
        },
        {
            name: "Libertarian Party",
            banner: "/libertarian-party-banner.jpg",
            description: "Party that promotes civil liberties, non-interventionism, laissez-faire capitalism, and limiting the size and scope of government."
        }
        ],
        eligibility: "U.S. citizens aged 18 and older",
        votingMethods: ["In-person", "Mail-in ballots", "Early voting"],
        registeredVoters: 200000000,
        votesCast: 150000000,
        voterTurnout: 75,
        daysRemaining: 140
    },
]

const Election = () => {
    const { id } = useParams()

    const { data: election, isLoading } = useQuery({
        queryKey: ['election', id],
        queryFn: async () => {
            return elections.find((election) => election.id === id)
        },
        refetchOnWindowFocus: false
    })

    if(isLoading) {
        return <LoadingSpinner />
    }

    if(!election) {
        return <Navigate to={'/notfound'} />
    }

    const startDate = new Date(election.start_date)
    const endDate = new Date(election.end_date)
    const now = new Date()
    
    let status
    if (now < startDate) {
        status = "upcoming"
    } else if (now >= startDate && now <= endDate) {
        status = "active"
    } else {
        status = "completed"
    }

    return (
        <div className="min-h-[855px] bg-white">
            <div className="bg-yellow-400 text-yellow-900 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" asChild className="bg-white hover:bg-yellow-100">
                                <Link to="/elections" className="flex items-center">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                <span className="font-semibold">&gt;&gt; Back to Elections</span>
                                </Link>
                            </Button>
                            <h1 className="text-2xl sm:text-3xl font-bold">{election.title}</h1>
                        </div>
                        <Badge 
                        variant={status === "active" ? "default" : "secondary"}
                        className={`${status === "active" ? "bg-green-500" : "bg-yellow-200 text-yellow-800"} text-lg px-4 py-2`}
                        >
                            {status}
                        </Badge>
                    </div>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:cols-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    About this Election
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600">{election.longDescription}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Election Statistics
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
                                        <Users className="h-8 w-8 text-blue-600 mb-2" />
                                        <span className="text-2xl font-bold text-blue-600">{election.registeredVoters.toLocaleString()}</span>
                                        <span className="text-sm text-blue-600">Registered Voters</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
                                        <VoteIcon className="h-8 w-8 text-blue-600 mb-2" />
                                        <span className="text-2xl font-bold text-green-600">{election.votesCast.toLocaleString()}</span>
                                        <span className="text-sm text-green-600">Votes Cast</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg">
                                        <Percent className="h-8 w-8 text-yellow-600 mb-2" />
                                        <span className="text-2xl font-bold text-yellow-600">{election.voterTurnout}%</span>
                                        <span className="text-sm text-yellow-600">Voter Turnout</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
                                        <CalendarIcon className="h-8 w-8 text-red-600 mb-2" />
                                        <span className="text-2xl font-bold text-red-600">{election.daysRemaining}</span>
                                        <span className="text-sm text-red-600">Days Remaining</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Participating Parties</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {election.parties.map((party, index) => (
                                        <div key={index} className="border rounded-lg overflow-hidden">
                                            <div className="relative h-32">
                                                <img src={party.banner} alt={party.name + 'banner'} />
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-semibold text-lg mb-2">{party.name}</h3>
                                                <p className="text-sm text-gray-600">{party.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Election Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center">
                                    <Users className="mr-2 h-5 w-5 text-yellow-600" />
                                    <span>{election.branch} Branch</span>
                                </div>
                                <div className="flex items-center">
                                    <VoteIcon className="mr-2 h-5 w-5 text-yellow-600" />
                                    <span>{election.vote_type === "single" ? "Single Choice" : "Multiple Choice"}</span>
                                </div>
                                <div className="flex items-center">
                                    <CalendarIcon className="mr-2 h-5 w-5 text-yellow-600" />
                                    <span>{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    Voter Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold">Eligibility:</h3>
                                    <p>{election.eligibility}</p>
                                </div>
                                <div>
                                    <h3 className="font-bold">Voting Methods:</h3>
                                    <ul className="font-semibold list-inside">
                                        {election.votingMethods.map((method, idx) => (
                                            <li key={idx}>{method}</li>
                                        ))}
                                    </ul>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Election