import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import axiosFetch from '@/lib/axios';
import { candidateWithPosition } from '@/types/candidate';
import { useQueryClient } from '@tanstack/react-query';
import { toFormData } from 'axios';
import { PlusCircle } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import * as z from 'zod';
import CandidateForm, { formSchema } from './CandidateForm';

type CreateCandidatesProps = {
    partyId: string,
    pollId: number,
}

const CreateCandidates = ({
    partyId,
    pollId
}: CreateCandidatesProps) => {
    const queryClient = useQueryClient();
    const [DialogOpen, setDialogOpen] = useState(false);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const formData = toFormData({
            photo: data.photo?.[0],
            name: data.name,  
            description: data.description,
            party_id: data.party_id,
            position_id: data.position_id
        })
        
        const response = await axiosFetch.post('/candidates', formData)

        if(response.status >= 400) {
            throw new Error(response.data.message)
        }

        toast.success('Candidate created successfully')
        setDialogOpen(false)

        queryClient.setQueryData(['candidates', partyId], (old: candidateWithPosition[]) => {
            return [...old, response.data]
        })
    }

    return (
        <Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Position
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create new Candidate
                    </DialogTitle>
                </DialogHeader>
                <CandidateForm pollId={pollId.toString()} partyId={partyId} onsubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default CreateCandidates