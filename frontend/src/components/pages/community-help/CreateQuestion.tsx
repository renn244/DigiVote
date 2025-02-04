import { useState } from "react"
import * as z from 'zod'
import QuestionsForm, { formSchema } from "./QuestionsForm"
import axiosFetch from "@/lib/axios"
import toast from "react-hot-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useQueryClient } from "@tanstack/react-query"
import { question } from "@/types/questions"
import { useAuthContext } from "@/context/AuthContext"
import { useSearchParams } from "react-router"

const CreateQuestion = () => {
    const [searchParams] = useSearchParams();
    const { user } = useAuthContext();
    const queryClient = useQueryClient();
    const [open, setOpen] = useState(false)

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await axiosFetch.post('/community-questions/createQuestion', data)

        if(response.status >= 400) {
            throw new Error(response.data.message)
        }

        toast.success('Question created successfully!')
        setOpen(false)

        const search = searchParams.get('search')
        queryClient.setQueryData(['questions', search], (old: question[]) => {
            const newData = {
                id: response.data.id,
                question: data.question,
                askedBy: user.username,
                asked_by_id: user.id,
                created_at: response.data.created_at,
                answers: []
            }
            return [newData, ...old]
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    Ask a Question
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Ask a Question
                    </DialogTitle>
                    <DialogDescription>
                        Ask a question and get help from the community.
                    </DialogDescription>
                </DialogHeader>
                <QuestionsForm onsubmit={onSubmit} />
            </DialogContent>
        </Dialog>
    )
}

export default CreateQuestion