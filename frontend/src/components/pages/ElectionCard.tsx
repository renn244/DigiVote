import { AlertTriangle, CalendarIcon, ChevronRight, Flag, MapPin, Shield, User, VoteIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router";
import { pollView } from "@/types/poll";

type ElectionCardProps = {
    election: pollView
}

const ElectionCard = ({ 
    election 
}: ElectionCardProps) => {
    const startDate = new Date(election.start_date);
    const endDate = new Date(election.end_date);
    const now = new Date();

    let status
    if(now < startDate) {
        status = 'Upcoming'
    } else if(now >= startDate && now <= endDate) {
        status = 'Active'
    } else {
        status = 'Ended'
    }

    return (
        <Card className="overflow-hidden transition-shadow hover:shadow-lg border border-gray-200 min-h-[530px]">
            <CardHeader className="bg-yellow-400 text-yellow-900 p-6">
                <CardTitle className="text-2xl mb-2">{election.title}</CardTitle>
                <Badge
                variant={status === "active" ? "default" : "secondary"}
                className={`status === 'Active' ? 'bg-green-500' : 'bg-yellow-200 text-yellow-800' text-sm px-3 py-1`}>
                    {status}
                </Badge>
            </CardHeader>
            <CardContent className="p-6 min-h-[316px]">
                <p className="text-gray-600 mb-6">{election.description}</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="space-y-3">
                        <div className="flex items-center text-sm">
                            <User className="mr-2 h-5 w-5 text-yellow-600" />
                            <span>{election.branch} Branch</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <VoteIcon className="mr-2 h-5 w-5 text-yellow-600" />
                            <span>{election.vote_type === "single" ? "Single Choice" : "Multiple Choice"}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center text-sm">
                            <CalendarIcon className="mr-2 h-5 w-5 text-yellow-600" />
                            <span>{startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-sm">
                            <MapPin className="mr-2 h-5 w-5 text-yellow-600" />
                            <span>{election.branch}</span>
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 col-span-2">
                        <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center">
                            <Shield className="mr-2 h-6 w-6 text-blue-600" />
                            Participating Parties
                        </h3>
                        {election.parties && election.parties.length > 0 ? (
                            <div className="grid grid-cols-2 gap-2">
                                {election.parties.map((party, idx) => (
                                    <div key={idx} className="flex items-center bg-white rounded-md p-2 shadow-sm">
                                        <Flag className="h-4 w-4 text-blue-500 mr-2" />
                                        <span className="text-sm text-blue-700">{party}</span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center justify-center bg-yellow-100 rounded-md p-3">
                                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-600" />
                                <p className="text-sm text-yellow-700 font-medium">No parties registered yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-gray-50 p-6">
                <Button
                variant="outline"
                className="w-full border-yellow-400 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-900 text-lg"
                asChild
                >
                    <Link to={`/elections/${election.id}`} className="flex items-center justify-center" >
                        Learn More
                        <ChevronRight className="ml-2 h-5 w-5" />
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ElectionCard