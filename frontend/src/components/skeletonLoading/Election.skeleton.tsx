import { CalendarIcon, Clock, User, Users, VoteIcon } from "lucide-react"
import { Card, CardContent, CardHeader } from "../ui/card"
import { ScrollArea } from "../ui/scroll-area"
import { Skeleton } from "../ui/skeleton"
import GoBackButton from "../common/GoBackButton"

const ElectionSkeleton = () => {

    return (
        <div>
            <div className="pt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                            <div className="flex items-center space-x-4">
                                <GoBackButton to={`/elections`}>
                                    Back to Elections
                                </GoBackButton>
                            </div>
                        </div>
                    </div>
                </div>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 pt-4">
                <div className="grid gap-8 md:grid-cols-3">
                    <div className="md:col-span-2 space-y-6">
                        <Card>
                            <CardHeader className="flex-row justify-between items-center space-y-0">
                                <Skeleton className="h-6 w-[300px]" />
                                <Skeleton className="h-[34px] w-[75px] rounded-full" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-6 w-full mb-1" />
                                <Skeleton className="h-6 w-[600px]" />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-[350px]" />
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
                                        <Users className="h-8 w-8 text-blue-600 mb-2" />
                                        <Skeleton className="h-[24px] w-[45px] bg-blue-300 my-1" />
                                        <span className="text-sm text-blue-600">Registered Voters</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
                                        <VoteIcon className="h-8 w-8 text-green-600 mb-2" />
                                        <Skeleton className="h-[24px] w-[45px] bg-green-300 my-1" />
                                        <span className="text-sm text-green-600">Votes Cast</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 rounded-lg">
                                        <Clock className="h-8 w-8 text-yellow-600 mb-2" />
                                        <Skeleton className="h-[24px] w-[45px] bg-yellow-300 my-1" />
                                        <span className="text-sm text-yellow-600">Vote Withing the last hour</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-red-50 rounded-lg">
                                        <CalendarIcon className="h-8 w-8 text-red-600 mb-2" />
                                        <Skeleton className="h-[24px] w-[45px] bg-red-300 my-1" />
                                        <span className="text-sm text-red-600">Days Remaining</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-[320px]" />
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {Array.from({ length: 2 }).map((_, idx) => (
                                        <Card key={idx}>
                                            <CardHeader className="p-0">
                                                <Skeleton className="rounded-t-lg w-[366.33px] h-[168.16px]" />
                                                <div className="px-6 py-2">
                                                    <Skeleton className="h-6 w-[100px]" />
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <Skeleton className="h-[16px] w-full my-1" />
                                                <Skeleton className="h-[16px] w-[170px] my-1" />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Skeleton className="w-full h-10 rounded-md" />
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-[197px]" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center">
                                    <User className="mr-2 h-5 w-5 text-yellow-600" />
                                    <Skeleton className="h-4 w-[122px] my-1" />
                                </div>
                                <div className="flex items-center">
                                    <VoteIcon className="mr-2 h-5 w-5 text-yellow-600" />
                                    <Skeleton className="h-4 w-[122px] my-1" />
                                </div>
                                <div className="flex items-center">
                                    <CalendarIcon className="mr-2 h-5 w-5 text-yellow-600" />
                                    <Skeleton className="h-4 w-[122px] my-1" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-[210px]" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <Skeleton className="h-[18px] w-[150px] my-[5px]" />
                                        <div className="flex flex-wrap gap-1">
                                            <Skeleton className="h-[22px] w-[130px] rounded-full" />
                                            <Skeleton className="h-[22px] w-[68px] rounded-full" />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <Skeleton className="h-[18px] w-[150px] my-[5px]" />
                                        <div className="flex flex-wrap gap-1">
                                            <Skeleton className="h-[22px] w-[48px] rounded-full" />
                                            <Skeleton className="h-[22px] w-[48px] rounded-full" />
                                            <Skeleton className="h-[22px] w-[48px] rounded-full" />
                                            <Skeleton className="h-[22px] w-[48px] rounded-full" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-[210px]" />
                            </CardHeader>
                            <CardContent className="px-0">
                                <ScrollArea className="h-96 p-6 pb-3 pt-0">
                                    <div className="space-y-3">
                                        {Array.from({ length: 5 }).map((_, idx) => (
                                            <div  key={idx}>
                                                <div className="space-y-1 flex-1">
                                                    <Skeleton className="h-[18px] my-[5px] w-[160px]" />
                                                    <Skeleton className="h-[14px] my-[3px] w-full" />
                                                    <Skeleton className="h-[14px] my-[3px] w-full" />
                                                    <Skeleton className="h-[14px] my-[3px] w-[130px]" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ElectionSkeleton