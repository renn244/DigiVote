import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axiosFetch from "@/lib/axios";
import { faq } from "@/types/faq";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { Dispatch, SetStateAction, useState } from "react"
import toast from "react-hot-toast";

type DeleteFaqProps = {
    id: number;
    setPopover: Dispatch<SetStateAction<boolean>>;
}

const DeleteFaq = ({
    id,
    setPopover
}: DeleteFaqProps) => {
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false);
    
    const { mutate, isPending } = useMutation({
        mutationKey: ['delete', 'faq'],
        mutationFn: async () => {
            const response = await axiosFetch.delete(`/faqs/${id}`)

            if(response.status >= 400) {
                toast.error(response.data.message)
                return
            }

            setOpen(false)
            setPopover(false)
            await queryClient.setQueryData(['faqs'], (old: faq[]) => {
                return old.filter(faq => 
                    faq.id !== id
                )
            })

            return response.data
        }
    })
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full" variant="ghost">
                    <Trash2 />
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Faq</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this FAQ?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={(e) => { e.stopPropagation(); setOpen(false); }} variant="outline">
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

export default DeleteFaq