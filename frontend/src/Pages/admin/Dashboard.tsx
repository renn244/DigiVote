import DashboardCard from "@/components/common/DashboardCard"
import AdminDashboardStats from "@/components/pages/admin/AdminDashboardStats"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import axiosFetch from "@/lib/axios"
import { adminDashboardInfo } from "@/types/poll"
import { useQuery } from "@tanstack/react-query"
import { Award, BookOpen, Flag, Frown, GraduationCap, UserCheck, VoteIcon, ChartNoAxesCombined } from "lucide-react"
import toast from "react-hot-toast"
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts"
  
const config = {
    positions: {
        label: 'Positions',
        color: '#3b82f6'
    },
    parties: {
        label: 'Parties',
        color: '#10b981',
    },
    candidates: {
        label: 'Candidates',
        color: '#f59e0b'
    }
} satisfies ChartConfig

const Dashboard = () => {

    const { data: adminStats, isLoading } = useQuery({
        queryKey: ['admin', 'dashboard'],
        queryFn: async () => {
            const response = await axiosFetch.get('/poll/adminDashboard')

            if(response.status >= 400) {
                toast.error(response.data.message)
                return 
            }

            return response.data as adminDashboardInfo
        }
    })

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-blue-900 mb-8">STI Admin Dashboard</h1>
            
             {/* Basic Information about the poll */}
            <div className="grid gap-8 mb-8 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard isLoading={isLoading} icon={VoteIcon} title="Active Polls" value={adminStats?.active_polls} />
                <DashboardCard isLoading={isLoading} icon={Flag} title="Total Parties" value={adminStats?.total_parties} />
                <DashboardCard isLoading={isLoading} icon={Award} title="Total Positions" value={adminStats?.total_positions} />
                <DashboardCard isLoading={isLoading} icon={UserCheck} title="Total Candidates" value={adminStats?.total_candidates} />
            </div>

            <AdminDashboardStats />

            <div className="grid gap-8 md:grid-cols-2">
                {/* Current Information about the ongoing or active poll */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Active Polls
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(adminStats?.active_polls_information && adminStats.active_polls_information.length > 0) ? (
                            <ul className="space-y-4">
                                {adminStats.active_polls_information.map((poll: any) => (
                                    <li key={poll.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                                        <div>
                                            <p className="font-semibold">{poll.name}</p>
                                            <p className="text-sm text-gray-500">Branch: {poll.branch}</p>
                                            <p className="text-sm text-gray-500">Ends: {new Date(poll.end_date).toLocaleDateString()}</p>
                                            <p className="text-sm text-gray-500">Vote Type: {poll.vote_type}</p>
                                        </div>
                                        <Badge variant={poll.votes > 50 ? "default" : "secondary"}>
                                            {poll.votes} votes
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Card className="bg-yellow-50 border-yellow-200">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <Frown className="w-16 h-16 text-yellow-400 mb-4" />
                                    <h2 className="text-2xl font-semibold text-yellow-800 mb-2">
                                        There is no active poll or elections available
                                    </h2>
                                    <p className="text-yellow-600 text-center max-w-lg">
                                        It's because there is no active poll as of the moments.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>

                {/* Basic Statistics about the poll like how many positions, parties and candidates is in there */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Statistics information per poll
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(adminStats?.poll_stats_per_poll && adminStats.poll_stats_per_poll.length > 0) ? (
                            <ChartContainer config={config}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={adminStats?.poll_stats_per_poll}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" className="text-xs" />
                                        <YAxis />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                        <Bar dataKey="positions" fill="#3b82f6" radius={[5, 5, 0, 0]} />
                                        <Bar dataKey="parties" fill="#10b981" radius={[5, 5, 0, 0]} />
                                        <Bar dataKey="candidates" fill="#f59e0b" radius={[5, 5, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        ) : (
                            <Card className="bg-yellow-50 border-yellow-200">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <ChartNoAxesCombined className="w-16 h-16 text-yellow-400 mb-4" />
                                    <h2 className="text-2xl font-semibold text-yellow-800 mb-2">
                                        There is no Statistics information per poll
                                    </h2>
                                    <p className="text-yellow-600 text-center max-w-lg">
                                        This is because there is no active polls as of the moment.
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <div className="grid gap-8 md:grid-cols-2">

                    {/* Most Voted Candidates */}
                    {(adminStats?.most_voted_candidates && adminStats.most_voted_candidates.length > 0) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">
                                    Most Voted Candidates
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-2 px-4">Name</th>
                                                <th className="text-left py-2 px-4">Party</th>
                                                <th className="text-right py-2 px-4">Votes</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {adminStats?.most_voted_candidates?.map((candidate, idx) => (
                                                <tr key={candidate.id} className={idx % 2 === 0 ? "bg-gray-50": ""}>
                                                    <td className="py-2 px-4 text-sm">{candidate.name} ({candidate.position})</td>
                                                    <td className="py-2 px-4 text-sm">{candidate.party}</td>
                                                    <td className="text-right py-2 px-4 text-sm">{candidate.totalVotes}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Show Who's Eligible for the poll */}
                    {(adminStats?.poll_eligibility_overview && adminStats.poll_eligibility_overview.length > 0) && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-semibold">
                                    Poll Eligibility Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-4">
                                    {adminStats.poll_eligibility_overview.map((poll) => (
                                        <li key={poll.id} className="border-b pb-2 last:border-b-0">
                                            <p className="font-semibold">{poll.name}</p>
                                            <p className="text-sm text-gray-500">Branch: {poll.branch}</p>
                                            <p className="text-sm text-gray-500">
                                                <GraduationCap className="inline-block w-4 h-4 mr-1" />
                                                Eligible Education Levels: {poll.eligible_education.map((eligible_education: string, idx: number) => {
                                                    return <>
                                                        <span className="capitalize">{eligible_education}</span>{idx === poll.eligible_education.length - 1 ? null : ', '}
                                                    </>
                                                })}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                <BookOpen className="inline-block w-4 h-4 mr-1" />
                                                Eligible Courses/Strand: {poll.eligible_course_strand.map((eligible_course_strand: string, idx: number) => {
                                                    return <>
                                                        <span>{eligible_course_strand}</span>{idx === poll.eligible_course_strand.length - 1 ? null : ', '}
                                                    </>
                                                })}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Dashboard