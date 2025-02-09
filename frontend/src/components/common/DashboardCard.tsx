import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import LoadingSpinner from "./LoadingSpinner"

type DashboardCardProps = {
    icon: any,
    title: string,
    className?: string,
    value: React.ReactNode,
    loadingState?: React.ReactNode, // used for displaying the loading icon or svg or animation
    isLoading?: boolean
}

const DashboardCard = ({ 
    icon: Icon,
    title,
    value,
    className,
    loadingState,
    isLoading=false,
}: DashboardCardProps) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                {title}
            </CardTitle>
            <Icon className="h-4 w-4 text-blue-900" />
        </CardHeader>
        <CardContent>
            {!isLoading ? (
                <div className={cn("text-2xl font-bold text-blue-900", className)}>{value}</div>
            ) : loadingState ? (
                    loadingState
                ) : (
                    <LoadingSpinner justify="start" className="items-start justify-start my-[6px]" />
                ) 
            }
        </CardContent>
    </Card>
)

export default DashboardCard