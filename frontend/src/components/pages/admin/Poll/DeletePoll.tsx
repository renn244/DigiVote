import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axiosFetch from "@/lib/axios";
import { poll } from "@/types/poll";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type DeletePollProps =  {
    pollId: number;
}

const DeletePoll = ({
    pollId
}: DeletePollProps) => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationKey: ['delete', 'polls'],
        mutationFn: async () => {
            const response = await axiosFetch.delete(`/poll/${pollId}`);

            if(response.status >= 400) {
               toast.error(response.data.message)
               return
            }

            toast.success('Poll deleted successfully!');
            queryClient.setQueryData(['polls'], (old: poll[]) => {
                return old.filter(poll => 
                    poll.id !== pollId
                )
            })
        }
    })

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button onClick={(e) => e.stopPropagation()} 
                className="bg-yellow-500 hover:bg-yellow-600 text-white" variant="outline" size="sm">
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
                    <Button onClick={(e) => { e.stopPropagation(); setIsOpen(false); }} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={(e) => {e.stopPropagation(); mutate(); }} variant="destructive" disabled={isPending}>
                        { isPending ? <LoadingSpinner /> : "Delete" }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeletePoll