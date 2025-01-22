import axiosFetch from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import * as z from 'zod'
import FaqsForm, { formSchema } from "./FaqsForm";
import toast from "react-hot-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

type UpdateFaqProps = {
    id: number;
    initialData: {
        question: string;
        answer: string;
    };
    setPopover: Dispatch<SetStateAction<boolean>>;
}

const UpdateFaq = ({
    id,
    initialData,
    setPopover
}: UpdateFaqProps) => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await axiosFetch.patch(`/faqs/${id}`, data);

        if(response.status >= 400) {
            throw new Error(response.data.message);
        }

        toast.success('FAQ updated successfully!');
        setIsOpen(false);
        setPopover(false);

        await queryClient.setQueryData(['faqs'], (old: any) => {
            return old.map((faq: any) => {
                if(faq.id === id) {
                    return data;
                }

                return faq;
            })
        })
    }
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full" variant="ghost">
                    <Edit2 />
                    Edit FAQ
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit FAQ
                    </DialogTitle>
                    <DialogDescription>
                        Update the Frequenly asked question
                    </DialogDescription>
                </DialogHeader>
                <FaqsForm initialData={initialData} onsubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default UpdateFaq