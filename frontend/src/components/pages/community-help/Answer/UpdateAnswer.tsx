import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import axiosFetch from "@/lib/axios"
import { question } from "@/types/questions"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Edit2 } from "lucide-react"
import { Dispatch, SetStateAction, useState } from "react"
import toast from "react-hot-toast"
import { useSearchParams } from "react-router"

type UpdateAnswerProps = {
    answerId: number,
    setPopOver: Dispatch<SetStateAction<boolean>>,
    initialData: {
        answer: string
    }
}

const UpdateAnswer = ({
    answerId,
    setPopOver,
    initialData
}: UpdateAnswerProps) => {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams()
    const [open, setOpen] = useState<boolean>(false)
    const [answer, setAnswer] = useState<string>(initialData.answer || "")

    const { mutate, isPending } = useMutation({
        mutationKey: ['update', 'answer'],
        mutationFn: async () => {
            const response = await axiosFetch.patch(`/community-questions/updateAnswer/${answerId}`, {
                answer
            })

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
                        answers: question.answers.map((currAnswer) => {
                            if(currAnswer.id === answerId) {
                                return {
                                    ...currAnswer,
                                    answer: answer
                                }
                            }

                            return currAnswer
                        })
                    }
                })
            })
            setAnswer("")
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant='ghost'>
                    <Edit2 />
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit Your Answer
                    </DialogTitle>
                    <DialogDescription>
                        you can edit your answer here. you can edit it anytime you want.
                    </DialogDescription>
                </DialogHeader>
                <Label htmlFor="answerInput" className="block mb-2 font-semibold">
                    Your Answer
                </Label>
                <Textarea 
                id="answerInput"
                className="max-h-[300px]"
                placeholder="Type your answer here..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)} 
                />
                <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button onClick={() => mutate()} disabled={!answer.trim() || isPending}>
                        {isPending ? <LoadingSpinner /> : "Submit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateAnswer