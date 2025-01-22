import { Button } from "@/components/ui/button"
import { Dialog, DialogHeader, DialogContent, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import * as z from 'zod'
import FaqsForm, { formSchema } from "./FaqsForm"
import axiosFetch from "@/lib/axios"
import toast from "react-hot-toast"
import { faq } from "@/types/faq"
import { useQueryClient } from "@tanstack/react-query"

const CreateFaq = () => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false)

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await axiosFetch.post('/faqs', data);

        if(response.status >= 400) {
            throw new Error(response.data.message);
        }

        toast.success('FAQ created successfully!');
        setIsOpen(false);

        await queryClient.setQueryData(['faqs'], (old: faq[]) => {
            return [...old, response.data]
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    Create FAQ
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Create FAQ
                    </DialogTitle>
                    <DialogDescription>
                        Add a new Frequenly asked question to the list
                    </DialogDescription>
                </DialogHeader>
                <FaqsForm onsubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default CreateFaq