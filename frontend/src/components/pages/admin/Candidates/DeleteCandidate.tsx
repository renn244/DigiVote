import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import axiosFetch from "@/lib/axios"
import { candidateWithPosition } from "@/types/candidate"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useParams } from "react-router"

type DeleteCandidateProps = {
    candidateId: number;
}

const DeleteCandidate = ({
    candidateId
}: DeleteCandidateProps) => {
    const { id } = useParams()
    const queryClient = useQueryClient();
    const [DialogOpen, setDialogOpen] = useState<boolean>(false)

    const { mutate, isPending } = useMutation({
        mutationKey: ['delete', 'candidates'],
        mutationFn: async () => {
            const response = await axiosFetch.delete(`/candidates/${candidateId}`)

            if(response.status >= 400) {
                toast.error(response.data.message)
                return
            }
            
            setDialogOpen(false)
            toast.success('Candidate deleted successfully')
            queryClient.setQueryData(['candidates', id], (old: candidateWithPosition[]) => {
                return old.filter((candidate: any) => 
                    candidate.id !== response.data.id
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
                        Are you sure you want to delete this candidate?
                    </DialogTitle>
                    <DialogDescription>
                        This action cannot be undone and all data will be lost.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => setDialogOpen(false)} variant="outline">
                        Cancel
                    </Button>
                    <Button onClick={() => mutate()} variant="destructive" disabled={isPending}>
                        {isPending ? <LoadingSpinner /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteCandidate