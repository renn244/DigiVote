import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

type DashboardCardProps = {
    icon: any,
    title: string,
    value: React.ReactNode
}

const DashboardCard = ({ 
    icon: Icon,
    title,
    value
}: DashboardCardProps) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
                {title}
            </CardTitle>
            <Icon className="h-4 w-4 text-blue-900" />
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold text-blue-900">{value}</div>
        </CardContent>
    </Card>
)

export default DashboardCard