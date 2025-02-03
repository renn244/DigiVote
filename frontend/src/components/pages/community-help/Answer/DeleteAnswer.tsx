import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import axiosFetch from "@/lib/axios"
import { question } from "@/types/questions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2 } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import toast from "react-hot-toast"
import { useSearchParams } from "react-router"

type DeleteAnswerProps = {
    answerId: number,
    setPopOver: Dispatch<SetStateAction<boolean>>,
}

const DeleteAnswer = ({
    answerId,
    setPopOver
}: DeleteAnswerProps) => {
    const [searchParams] = useSearchParams()
    const queryClient = useQueryClient();
    const [open, setOpen] = useState<boolean>(false)

    const { mutate, isPending } = useMutation({
        mutationKey: ['delete', 'answer'],
        mutationFn: async () => {
            const response = await axiosFetch.delete(`/community-questions/deleteAnswer/${answerId}`)

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            return response.data
        },
        onSuccess: async () => {
            setOpen(false)
            setPopOver(false)

            const search = searchParams.get('search')
            await queryClient.setQueryData(['questions', search], (old: question[]) => {
                return old.map((question) => {
                    return {
                        ...question,
                        answers: question.answers.filter((answer) => answer.id !== answerId)
                    }
                })
            })
        },
        onError: (error) => {
            toast.error(error.message)
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
                    <DialogTitle>
                        Delete Answer
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this answer?
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button disabled={isPending} variant="destructive" onClick={() => mutate()}>
                        {isPending ? <LoadingSpinner /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default DeleteAnswer