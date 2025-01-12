import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useQueryClient } from "@tanstack/react-query";
import { PlusCircle } from 'lucide-react';
import { useState } from "react";
import * as z from 'zod'
import PartiesForm, { formSchema } from './PartiesForm';
import axiosFetch from '@/lib/axios';
import toast from 'react-hot-toast';
import { partyTable } from '@/types/party';

const CreateParties = () => {
    const queryClient = useQueryClient();
    const [DialogOpen, setDialogOpen] = useState<boolean>(false)

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append('description', data.description)
        formData.append('poll_id', data.poll_id)
        formData.append('banner', data.banner?.[0])

        const response = await axiosFetch.post('parties', formData, {
            headers: {
                "Content-Type" : "multipart/form-data"
            }
        })

        if(response.status >= 400) {
            throw new Error(response.data.message) // this will be caught by the form
        }

        toast.success('Parties created successfully')
        setDialogOpen(false)

        // update parties // might want to setup a callback later
        queryClient.setQueryData(['parties'], (old: partyTable[]) => {
            return [...old, response.data]
        })
    }

    return (
        <Dialog open={DialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                    <PlusCircle className='mr-2 h-4 w-4'/> Add New Party
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>
                        Create new Party
                    </DialogTitle>
                </DialogHeader>
                <PartiesForm onsubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default CreateParties