import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import axiosFetch from "@/lib/axios";
import { pollView } from "@/types/poll";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, CalendarIcon, ChevronRight, Flag, MapPin, Shield, Users, VoteIcon } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router";

const Results = () => {

    // add filters like search and year

    const { data: results, isLoading } = useQuery({
        queryKey: ['results'],
        queryFn: async () => {
            const response = await axiosFetch.get('/poll/results');

            if(response.status >= 400) {
                toast.error(response.data.message);
                return;
            }
            
            return response.data as pollView[];
        },
        refetchOnWindowFocus: false
    })

    if(isLoading) {
        return <LoadingSpinner />
    }


    return (
        <div className="min-h-[855px] bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="text-4xl font-bold text-blue-900 mb-8">
                    Election Results
                </h1>
                {results && results?.length > 0 ? (
                    <div className="grid gap-8 md:grid-cols-2">
                        {results?.map((election) => (
                            <Card
                            key={election.id}
                            className="overflow-hidden transition-shadow hover:shadow-lg border border-gray-200"
                            >
                                <CardHeader className="bg-yellow-400 text-yellow-900 p-5">
                                    <CardTitle className="text-2xl mb-2">
                                        {election.title}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-6 min-h-[216px]">
                                    <p className="text-gray-600 mb-6">{election.description}</p>
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center text-sm">
                                                <Users className="mr-2 h-5 w-5 text-yellow-600" />
                                                <span>{election.branch} Branch</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <VoteIcon className="mr h-5 w-5 text-yellow-600" />
                                                <span>{election.vote_type === "single" ? "Single Choice" : "Multiple Choice"}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center text-sm">
                                                <CalendarIcon className="mr-2 h-5 w-5 text-yellow-600" />
                                                <span>{new Date(election.start_date).toLocaleDateString()} - {new Date(election.end_date).toLocaleDateString()}</span>
                                            </div>
                                            <div className="flex items-center text-sm">
                                                <MapPin className="mr-2 h-5 w-5 text-yellow-600" />
                                                <span>{election.branch}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 cols-span-2">
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
                                                <p className="text-sm text-yellow-700 font-medium">
                                                    No parties participated
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-gray-50 p-6">
                                    <Button 
                                    className="w-full border-yellow-400 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-900 text-lg py-3"
                                    variant="outline"
                                    asChild
                                    >
                                        <Link to={`/results/${election.id}`} className="flex items-center justify-center">
                                            View Result
                                            <ChevronRight className="ml-2 h-5 w-5" />
                                        </Link>
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <VoteIcon className="w-16 h-16 text-yellow-400 mb-4" />
                            <h2 className="text-2xl font-semibold text-yellow-800 mb-2">No Election Results Available</h2>
                            <p className="text-yellow-600 text-center max-w-lg">
                                Sorry, there are currently no election results available in your branch. Please check back later for results of the elections.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default Results