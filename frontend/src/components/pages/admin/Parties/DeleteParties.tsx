import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axiosFetch from "@/lib/axios";
import { partyTable } from "@/types/party";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

type DeletePartyProps = {
    partyId: number;
}

const DeleteParties = ({
    partyId
}: DeletePartyProps) => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const { mutate, isPending } = useMutation({
        mutationFn: async () => {
            const response = await axiosFetch.delete(`/parties/${partyId}`)

            if(response.status >= 400) {
                toast.error(response.data.message);
                return
            }

            toast.success('Parties deleted successfully');
            queryClient.setQueryData(['parties'], (old: partyTable[]) => {
                return old.filter(party => 
                    party.id !== partyId
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
                        Are you sure you want to delete this party?
                    </DialogTitle>
                    <DialogDescription>
                        This action cannot be undone and all the data will be lost.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => setIsOpen(false)} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={() => mutate()} variant="destructive" disabled={isPending}>
                        Delete
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteParties