import AdminDashboardStatsSkeleton from "@/components/skeletonLoading/AdminDashboardStats.skeleton"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axiosFetch from "@/lib/axios"
import { adminDashboardStatsGraph } from "@/types/poll"
import { useQuery } from "@tanstack/react-query"
import { format, subDays, subMonths } from "date-fns"
import { useState } from "react"
import toast from "react-hot-toast"
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

// just for the chartConfigContainer to not throw an warning line
const participationCourse_StrandConfig = { value: {} }
const participationEducationLevelConfig = { value: {} }

const votingTrendsconfig = {
    votes_per_day: {
        label: 'Votes',
        color: 'hsl(var(--chart-1))'
    }
} satisfies ChartConfig

const AdminDashboardStats = () => {
    const [votingTrend, setVotingTrend] = useState<'7 days' | '14 days' | '21 days' | '1 month'>('7 days')

    const { data, isLoading } = useQuery({
        queryKey: ['admin', 'dashboard', 'statistics'],
        queryFn: async () => {
            const response = await axiosFetch.get(`/poll/adminDashboard/statistics`)

            if(response.status >= 400) {
                toast.error(response.data.message)
                return
            }
            
            return response.data as adminDashboardStatsGraph
        }
    })

    if(isLoading) {
        return <AdminDashboardStatsSkeleton />
    }
    
    const getVotingTrendDays = () => {
        // it's only used in here
        const getPastDates = () => {
            const votingTrendDateNum = parseInt(votingTrend.split(' ')[0], 10);
            if(votingTrend.endsWith('days')) {
                return subDays(new Date(), votingTrendDateNum);
            } else if(votingTrend.endsWith('month')) {
                return subMonths(new Date(), votingTrendDateNum)
            }
    
            return new Date(); // just in case but this should not happen
        }
        

        let dateArray = [];
        let currentDate = new Date()
        const toDate = getPastDates()

        while(currentDate > toDate) {
            dateArray.push(format(new Date(currentDate), 'MM-dd'))
            currentDate = subDays(currentDate, 1)
        }

        return dateArray
    }

    const votingTrendDays = getVotingTrendDays()
    const formattedData = data?.voting_trends.filter((value) => votingTrendDays.includes(value.vote_date))
    
    return (
        <div className="grid gap-8 mb-8 md:grid-cols-2">
            <Card>
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="text-xl font-semibold">
                        Voting Trends (Last {votingTrend})
                    </CardTitle>
                    
                    <Select value={votingTrend as typeof votingTrend} onValueChange={(value: typeof votingTrend) => setVotingTrend(value)}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Select Trends" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Trends</SelectLabel>
                                <SelectItem value="7 days" >7 Days</SelectItem>
                                <SelectItem value="14 days">14 Days</SelectItem>
                                <SelectItem value="21 days">21 Days</SelectItem>
                                <SelectItem value="1 month">1 Month</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>

                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                       <ChartContainer config={votingTrendsconfig} >
                            <LineChart accessibilityLayer data={formattedData}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="vote_date" className="text-xs" />
                                <YAxis />
                                <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent />}
                                />
                                <Line dot={false} type="monotone" dataKey="votes_per_day" stroke="#3b82f6" strokeWidth={2} />
                            </LineChart>
                       </ChartContainer>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        Participating by Education Level and Course
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="education">
                        <TabsList className="mb-4">
                            <TabsTrigger value="education">Education Level</TabsTrigger>
                            <TabsTrigger value="course">Course/Strand</TabsTrigger>
                        </TabsList>
                        <TabsContent value="education">
                            <ChartContainer config={participationEducationLevelConfig}>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                        data={data?.participationByEducationLevel}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        labelLine={false}
                                        blendStroke={data?.participationByEducationLevel.length === 1 ? true : false}
                                        fill="#8884D8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {data?.participationByEducationLevel.map((_, idx) => (
                                                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </TabsContent>
                        <TabsContent value="course">
                            <ChartContainer config={participationCourse_StrandConfig}>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                        data={data?.participationByCourse}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        blendStroke={data?.participationByCourse.length === 1 ? true : false}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {data?.participationByCourse.map((_, idx) => (
                                                <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminDashboardStats