import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axiosFetch from "@/lib/axios"
import { adminDashboardStatsGraph } from "@/types/poll"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import { CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

const AdminDashboardStats = () => {

    const { data } = useQuery({
        queryKey: ['admin', 'dashboard', 'statistics'],
        queryFn: async () => {
            const response = await axiosFetch.get('/poll/adminDashboard/statistics')

            if(response.status >= 400) {
                toast.error(response.data.message)
                return
            }
            
            return response.data as adminDashboardStatsGraph
        }
    })

    return (
        <div className="grid gap-8 mb-8 md:grid-cols-2">
            <Card>
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        Voting Trends (Last 7 Days)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data?.voting_trends}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="vote_date" className="text-xs" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="votes_per_day" stroke="#3b82f6" strokeWidth={2} />
                        </LineChart>
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
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </TabsContent>
                        <TabsContent value="course">
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
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminDashboardStats