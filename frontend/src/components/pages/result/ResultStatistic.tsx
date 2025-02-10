import ResultStatsSkeleton from "@/components/skeletonLoading/ResultStats.skeleton";
import { Card } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import axiosFetch from "@/lib/axios";
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

type ResultStatisticProps = {
    pollId: string
}

const config = {
    votes: {
        label: "Votes",
        color: "hsl(var)"
    }
} satisfies ChartConfig

const ResultStatistic = ({
    pollId
}: ResultStatisticProps) => {
    const { data: statistics, isLoading } = useQuery({
        queryKey: ['statistics', pollId],
        queryFn: async () => {
            const response = await axiosFetch.get(`/poll/resultStats/${pollId}`);

            if(response.status >= 400) {
                toast.error(response.data.message);
                return;
            }
            
            return response.data
        },
        refetchOnWindowFocus: false
    })

    if(isLoading) {
        return <ResultStatsSkeleton />
    }

    const initialData = statistics?.positions.flatMap((result: any) => result.candidates.map((c: any) => c))

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Position Votes Statistics</h2>
            </div>
            <Card className="p-6">
                <ChartContainer className="max-h-[320px] w-full" config={config}>
                    <BarChart data={initialData} layout="horizontal" margin={{ top: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" type="category" />
                        <YAxis type="number" />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                        <Legend />
                        <Bar dataKey="votes" fill="#3b82f6" radius={5} />
                    </BarChart>
                </ChartContainer>
            </Card>
        </div>
    )
}

export default ResultStatistic
