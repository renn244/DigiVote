import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axiosFetch from "@/lib/axios";
import { poll } from "@/types/poll";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import * as z from "zod";
import PollForm, { formSchema } from "./PollForm";

const CreatePoll = () => {
    const queryClient = useQueryClient();
    const [DialogOpen, setDialogOpen] = useState(false);

    const onSubmit = async (data: z.infer<typeof formSchema>): Promise<void> => {
        const response = await axiosFetch.post('/poll', data);

        if(response.status >= 400) {
            throw new Error(response.data.message); // this will be caught by the form
        }

        toast.success('Poll created successfully!');
        setDialogOpen(false);

        // update poll
        queryClient.setQueryData(['polls'], (old: poll[]) => {
            return [...old, response.data]
        })
    }

    return (
        <Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <Plus className="mr-2 h-4 w-4" /> Add New Poll
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>
                        Create New Poll
                    </DialogTitle>
                </DialogHeader>
                <PollForm onsubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default CreatePoll