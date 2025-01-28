import DashboardCard from "@/components/common/DashboardCard";
import Positions from "@/components/pages/admin/Position/Positions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import axiosFetch from "@/lib/axios";
import { pollStats } from "@/types/poll";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Flag, User, Vote } from "lucide-react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
    votes: {
        label: 'Votes',
        color: 'hsl(var(--chart-1))'
    }
} satisfies ChartConfig

const PollInfo = () => {
    const { id } = useParams();

    const { data: election } = useQuery({
        queryKey: ['election', id],
        queryFn: async () => {
            const response = await axiosFetch.get(`/poll/pollStats/${id}`);

            if(response.status >= 400) {
                toast.error(response.data.message);
                return
            }

            return response.data as pollStats
        },
        refetchOnWindowFocus: false
    })

    if(!election) return null;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">{election?.title}</h1>
                
                <Button variant={'outline'} asChild>
                    <Link to={'/admin/polls'}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Elections
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard icon={User} title="Total Votes" value={election?.total_votes} />
                <DashboardCard icon={Vote} title="Status" value={
                    <Badge>
                        {election?.status}
                    </Badge> 
                } />
                <DashboardCard icon={Flag} title="Participating Parties" value={election?.participating_parties} />
                <DashboardCard icon={Clock} title="Start-End Date" value={
                    new Date(election?.start_date).toLocaleDateString() + " to " + new Date(election?.end_date).toLocaleDateString()
                } className="text-lg" />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="max-h-[513.13px]">
                    <CardHeader>
                        <CardTitle>Parties Votes or voters on days they voted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig}>
                            <AreaChart 
                            accessibilityLayer
                            data={election.votes_stats}
                            margin={{
                            }}>
                                <CartesianGrid vertical={false} />
                                <XAxis 
                                dataKey='vote_date'
                                tickLine={false}
                                axisLine={false}
                                />
                                <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" />}
                                />
                                <Area 
                                dataKey={'votes_per_day'}
                                type="bumpX"
                                fillOpacity={0.4}
                                />
                            </AreaChart>   
                        </ChartContainer>
                    </CardContent>
                </Card>
                <div className="space-y-3">
                    <Card className="max-h-[300px]">
                        <CardHeader>
                            <CardTitle>
                                Eligible to Vote
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="space-y-1">
                                <h1 className="text-lg font-semibold">Education Level</h1>
                                <div className="flex flex-wrap gap-1">
                                    {election?.allowed_education_levels.map((education_level, idx) => (
                                        <Badge key={idx}>
                                            {education_level}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-lg font-semibold">Course/Strand</h1>
                                <div className="flex flex-wrap">
                                    {election?.allowed_courses.map((course, idx) => (
                                        <Badge key={idx}>
                                            {course}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Positions />
                </div>
            </div>

            {/* also display the candidates votings */}
        </div>
    )
}

export default PollInfo