import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import PositionForm, { formSchema } from "./PositionForm"
import { Edit } from "lucide-react"
import * as z from 'zod'
import axiosFetch from "@/lib/axios"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"

type UpdatePositionProps = {
    initialData: any,
    poll_id: string,
}

const UpdatePosition = ({
    initialData,
    poll_id,
}: UpdatePositionProps) => {
    const queryClient = useQueryClient();
    const [DialogOpen, setDialogOpen] = useState(false)
    
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await axiosFetch.patch(`/positions/${initialData?.id}`, data)

        if(response.status >= 400) {
            throw new Error(response.data.message);
        }

        toast.success('position updated')
        setDialogOpen(false)

        // update positions
        queryClient.setQueryData(['positions', poll_id], (old: any) => {
            return old.map((position: any) => {
                if(position.id === initialData.id) {
                    return response.data
                }
                return position
            })
        })
    }

    return (
        <Dialog open={DialogOpen} onOpenChange={setDialogOpen} >
            <DialogTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white"
                variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Update Position
                    </DialogTitle>
                </DialogHeader>
                <PositionForm onsubmit={onSubmit}
                initialData={initialData} poll_id={parseInt(poll_id)} />
            </DialogContent>
        </Dialog>
    )
}

export default UpdatePosition