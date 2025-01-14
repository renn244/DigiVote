import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axiosFetch from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router";
import * as z from 'zod';
import PositionForm, { formSchema } from "./PositionForm";
import { position } from "@/types/position";

const CreatePosition = () => {
    const queryClient = useQueryClient();
    const { id: pollId } = useParams();
    const [DialogOpen, setDialogOpen] = useState(false);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await axiosFetch.post('/positions', data)

        if(response.status >= 400) {
            throw new Error(response.data.message) // this will be caught by the form
        }

        toast.success('position created successfully')
        setDialogOpen(false);

        // update positions
        queryClient.setQueryData(['positions', pollId], (old: position[]) => {
            return [...old, response.data]
        })
    }

    if(!pollId) {
        // something went wrong ui
        return
    }

    return (
        <Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Position
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create new Position
                    </DialogTitle>
                </DialogHeader>
                <PositionForm onsubmit={onSubmit} poll_id={parseInt(pollId!)} />
            </DialogContent>
        </Dialog>
    )
}

export default CreatePosition