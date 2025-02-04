import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import axiosFetch from "@/lib/axios";
import { useQueryClient } from "@tanstack/react-query"
import { Dispatch, SetStateAction, useState } from "react";
import toast from "react-hot-toast";
import * as z from 'zod'
import QuestionsForm, { formSchema } from "./QuestionsForm";
import { Edit2 } from "lucide-react";
import { question } from "@/types/questions";
import { useSearchParams } from "react-router";

type UpdateQuestionProps = {
    questionId: number,
    initialData: {
        question: string;
    };
    setPopOver: Dispatch<SetStateAction<boolean>>;
}

const UpdateQuestion = ({
    questionId,
    initialData,
    setPopOver
}: UpdateQuestionProps) => {
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await axiosFetch.patch(`/community-questions/updateQuestion/${questionId}`, data)
        
        if(response.status >= 400) {
            throw new Error(response.data.message);
        }

        toast.success('Community question updated successfully!');
        setIsOpen(false);
        setPopOver(false);
        
        const search = searchParams.get('search')
        await queryClient.setQueryData(['questions', search], (old: question[]) => {
            return old.map((question: question) => {
                if(question.id === questionId) {
                    return {
                        ...question,
                        question: data.question
                    }
                }
                return question
            })
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full" variant="ghost">
                    <Edit2 />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit Community Questions
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to edit this community question?
                    </DialogDescription>
                </DialogHeader>
                <QuestionsForm initialData={initialData} onsubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default UpdateQuestion