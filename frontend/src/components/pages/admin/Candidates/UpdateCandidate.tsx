import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Edit } from "lucide-react";
import { useState } from "react";
import * as z from 'zod'
import CandidateForm, { formSchema } from "./CandidateForm";
import axiosFetch from "@/lib/axios";
import toast from "react-hot-toast";
import { toFormData } from "axios";

type UpdateCandidateProps = {
    initialData: any,
    candidateId: number,
    pollId: number
}

const UpdateCandidate = ({
    initialData,
    candidateId,
    pollId
}: UpdateCandidateProps) => {
    const queryClient = useQueryClient();
    const [DialogOpen, setDialogOpen] = useState(false);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const formData = toFormData({
            photo: data.photo?.[0] || undefined,
            name: data.name,
            description: data.description,
            position_id: data.position_id
        })

        const response = await axiosFetch.patch(`/candidates/${candidateId}`, formData)
        
        if(response.status >= 400) {
            toast.error(response.data.message);
            return
        }

        toast.success('candidate updated successfully')
        setDialogOpen(false)
        queryClient.setQueryData(['candidates', initialData.party_id.toString()], (old: any) => {
            return old.map((candidate: any) => {
                if(candidate.id === response.data.id) {
                    return response.data
                }
                return candidate
            })
        })
    }

    return (
        <Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white"
                variant="outline" size="sm">
                    <Edit className=" h-4 w-4" /> 
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Update Candidate
                    </DialogTitle>
                </DialogHeader>
                <CandidateForm initialData={initialData} pollId={pollId.toString()} partyId={initialData.party_id} 
                onsubmit={onSubmit} isUpdate />
            </DialogContent>
        </Dialog>
    )
}

export default UpdateCandidate