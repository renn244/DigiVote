import DashboardCard from "@/components/common/DashboardCard";
import Positions from "@/components/pages/admin/Position/Positions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, Flag, User, Vote } from "lucide-react";
import { Link, useParams } from "react-router"

const PollInfo = () => {
    const { id } = useParams();


    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">COMSOC ELECTIONS</h1>
                
                <Button variant={'outline'} asChild>
                    <Link to={'/admin/polls'}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Elections
                    </Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard icon={User} title="Total Votes" value={100} />
                <DashboardCard icon={Vote} title="Status" value={
                    <Badge>Upcoming</Badge> 
                } />
                <DashboardCard icon={Flag} title="Participating Parties" value={3} />
                <DashboardCard icon={Clock} title="Start-End Date" value={
                    "2025-1-15" + " to " + "2025-1-25"
                } />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Parties Votes or voters on days they voted</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={election.voterTurnout}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="age" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="turnout" fill="#3b82f6" />
                            </BarChart>
                        </ResponsiveContainer> */}
                    </CardContent>
                </Card>
                <Positions />
            </div>
        </div>
    )
}

export default PollInfo