import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import axiosFetch from "@/lib/axios"
import { position } from "@/types/position"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"

type DeletePositionProps = {
    poll_id: string,
    positionId: number,
}

const DeletePosition = ({
    poll_id,
    positionId
}: DeletePositionProps) => {
    const queryClient = useQueryClient();
    const [DialogOpen, setDialogOpen] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationKey: ['delete', 'positions'],
        mutationFn: async () => {
            const response = await axiosFetch.delete(`/positions/${positionId}?pollId=${poll_id}`)

            if(response.status >= 400) {
                toast.error(response.data.message)
                return 
            }

            toast.success('Position deleted successfully')
            setDialogOpen(false)
            queryClient.setQueryData(['positions', poll_id], (old: position[]) => {
                return old.filter((position) => 
                    position.id !== positionId
                )
            })
        }
    })

    return (
        <Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white" variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Are you sure you want to delete this poll?
                    </DialogTitle>
                    <DialogDescription>
                        This action cannot be undone and all data will be lost.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={() => mutate()} variant="destructive" disabled={isPending}>
                        { isPending ? <LoadingSpinner /> : "Delete" }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeletePosition