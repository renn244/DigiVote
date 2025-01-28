import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router"
import CreatePosition from "./CreatePosition"
import DeletePosition from "./DeletePosition"
import UpdatePosition from "./UpdatePosition"
import { ScrollArea } from "@/components/ui/scroll-area"
import { position } from "@/types/position"

const Positions = () => {
    const { id: pollId } = useParams();

    const { data, isLoading } = useQuery({
        queryKey: ['positions', pollId],
        queryFn: async () => {
            const response = await axiosFetch.get(`/positions/${pollId}`)

            if(response.status >= 400) { 
                // throw error??
                return
            }

            return response.data as position[]
        },
        refetchOnWindowFocus: false
    })

    if(!pollId) {
        // something went wrong ui
        return
    }

    if(isLoading) return <LoadingSpinner />

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
                <CardTitle>Positions</CardTitle>
                <CreatePosition />
            </CardHeader>
            <CardContent className="px-0">
                <ScrollArea className="h-86 p-6 pt-0">
                    <div className="space-y-3">
                        {data?.map((position: any) => (
                            <div key={position.id} className="flex items-center">
                                <div className="space-y-1 flex-1">
                                    <p className="text-lg font-bold">{position.position}</p>
                                </div>
                                <div className="space-x-2">
                                    <UpdatePosition initialData={position} poll_id={pollId} />
                                    <DeletePosition poll_id={pollId} positionId={position.id} />
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}

export default Positions