import DashboardCard from "@/components/common/DashboardCard";
import GoBackButton from "@/components/common/GoBackButton";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Candidates from "@/components/pages/admin/Candidates/Candidates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import axiosFetch from "@/lib/axios";
import { partyOverview } from "@/types/party";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Users, Vote } from "lucide-react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate, useParams } from "react-router"
import { Bar, BarChart, XAxis, YAxis } from "recharts";

const chartConfig = {
    votes: {
        label: 'Votes',
        color: "hsl(var(--chart-1))"
    }
} satisfies ChartConfig

const PartiesInfo = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: party, isLoading } = useQuery({
        queryKey: ['partyInfo'],
        queryFn: async () => {
            const response = await axiosFetch.get(`/parties/getOverview/${id}`)

            if(response.status === 404) {
                navigate('/notfound')
                return
            }

            if(response.status >= 400) {
                // redirect to something have gone wrong??
                toast.error(response.data.message)
                return
            }

            return response.data as partyOverview
        },
        refetchOnWindowFocus: false
    })

    const { data: voteStats } = useQuery({
        queryKey: ['voteStats'],
        queryFn: async () => {
            const response = await axiosFetch.get(`/vote/getVotesStats?partyId=${id}`)

            if(response.status === 404) {
                navigate('/notfound')
                return
            }

            if(response.status >= 400) {
                // redirect to something have gone wrong??
                toast.error(response.data.message)
                return
            }

            return response.data
        },
        refetchOnWindowFocus: false
    })

    if(isLoading) return <LoadingSpinner />

    if(!party) {
        return <Navigate to={'/notfound'} />
    }
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">1neSTI Dashboard</h1>

                <GoBackButton to="/admin/parties">
                    Back to Parties
                </GoBackButton>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard icon={Vote} title="Total Votes" value={party.votes_count} />
                <DashboardCard icon={BarChart} title="Vote Percentage" value={party.vote_percentage + "%"} />
                <DashboardCard icon={Users} title="Candidates" value={party.candidates_count} />
                <DashboardCard icon={Vote} title="Associated Poll" value={
                    <Badge variant="outline" className="h-8">
                        <span className="first-letter:uppercase text-lg">{party.branch} Branch</span>
                    </Badge>
                } />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Votes accumulated by candidates
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                                <BarChart accessibilityLayer layout="vertical" data={voteStats}
                                margin={{ left: -20 }}>
                                    <XAxis type="number" dataKey="votes" hide />
                                    <YAxis
                                    dataKey="name"
                                    type="category"
                                    tickLine={false}
                                    tickMargin={10}
                                    axisLine={false}
                                    width={150}
                                    />
                                    <ChartTooltip
                                    cursor={false}
                                    content={<ChartTooltipContent hideLabel />}
                                    />
                                    <Bar dataKey="votes" fill="#3b82f6" barSize={40} radius={3} />
                                </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                <Candidates pollId={party.poll_id} />
            </div>
        </div>
    )
}

export default PartiesInfo