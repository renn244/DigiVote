import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

const AdminDashboardStatsSkeleton = () => {
    return (
        <div className="grid gap-8 mb-8 md:grid-cols-2">
            <Card className="h-[420px]">
                <CardHeader className="flex-row items-center justify-between">
                    <CardTitle className="text-xl font-semibold">
                        Voting Trends (Last 7 Days)
                    </CardTitle>
                    <Skeleton className="mt-6 h-10 w-[186px]" />
                </CardHeader>
                <CardContent>
                    <div className="h-[300px] w-full">
                    </div>
                </CardContent>
            </Card>

            <Card className="h-[420px]">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">
                        Participating by Education Level and Course
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="min-h-[314px] w-full">
                        <div className="mb-4 p-1 bg-[#f5f5f4] w-[259.69px] rounded-md">
                            <Skeleton className="w-[130px] h-8 rounded-sm bg-[#ffffff]" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default AdminDashboardStatsSkeleton