import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Card } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosFetch from "@/lib/axios";
import { useQuery } from "@tanstack/react-query"
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

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
    const [type, setType] = useState("President") // like president, vice president, etc

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
        return <LoadingSpinner />
    }

    const positions = statistics?.positions.map((result: any) => result.position) || []
    const data = statistics?.positions.filter((result: any) => result.position === type)?.[0]?.candidates
    
    return (
        <div className="">
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-xl font-bold">Position Votes Statistics</h2>
                <Select value={type} onValueChange={setType}>
                    <SelectTrigger className="max-w-48">
                        <SelectValue placeholder="Select a position" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Positions</SelectLabel>
                            {positions.map((position: string, idx: number) => (
                                <SelectItem key={idx} value={position} >{position}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Card className="p-6">
                <ChartContainer className="max-h-[320px] w-full" config={config}>
                    <BarChart data={data} layout="horizontal" margin={{ top: 5 }}>
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
