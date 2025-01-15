import { CalendarIcon, ChevronRight, MapPin, User, VoteIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router";

const ElectionCard = ({ election }: any) => {
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
                            <span>{election.location}</span>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-2">Participating Parties:</h3>
                        <div className="flex flex-wrap gap-2">
                            {election.parties.map((party: string, index: number) => (
                                <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200" >
                                    {party}
                                </Badge>
                            ))}
                        </div>
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