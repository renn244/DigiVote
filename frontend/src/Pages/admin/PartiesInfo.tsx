import DashboardCard from "@/components/common/DashboardCard";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import Candidates from "@/components/pages/admin/Candidates/Candidates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axiosFetch from "@/lib/axios";
import { party } from "@/types/party";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, BarChart, Users, Vote } from "lucide-react";
import toast from "react-hot-toast";
import { Link, Navigate, useNavigate, useParams } from "react-router"

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

            return response.data as party
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

                <Button variant="outline" asChild>
                    <Link to="/admin/parties">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Parties
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard icon={Vote} title="Total Votes" value={100} />
                <DashboardCard icon={BarChart} title="Vote Percentage" value={"37.3%"} />
                <DashboardCard icon={Users} title="Candidates" value={10} />
                <DashboardCard icon={Vote} title="Associated Poll" value={
                    <Badge variant="outline">STA MARIA BRANCH</Badge>
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
                        {/* <ResponsiveContainer width="100%" height={300}>
                            <BarChartComponent data={partyData.votesByState}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="state" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="votes" fill="#3b82f6" />
                            </BarChartComponent>
                        </ResponsiveContainer> */}
                    </CardContent>
                </Card>
                <Candidates pollId={party.poll_id} />
            </div>
        </div>
    )
}

export default PartiesInfo