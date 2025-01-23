import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAuthContext } from "@/context/AuthContext"
import axiosFetch from "@/lib/axios"
import { question } from "@/types/questions"
import { useQueryClient } from "@tanstack/react-query"
import { Dispatch, SetStateAction, useState } from "react"
import toast from "react-hot-toast"

type AddAnswerProps = {
    setShowAnswerForm: Dispatch<SetStateAction<number | null>>,
    questionId: number,
}

const AddAnswer = ({
    setShowAnswerForm,
    questionId,
}: AddAnswerProps) => {
    const { user } = useAuthContext();
    const queryClient = useQueryClient()
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [answer, setAnswer] = useState<string>("")
    
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const response = await axiosFetch.post(`/community-questions/createAnswer/${questionId}`, {
                answer
            });

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            setShowAnswerForm(null)
            setAnswer("")
            
            await queryClient.setQueryData(['questions'], (old: question[]) => {
                return old.map((question) => {
                    if(question.id === questionId) {
                        const newAnswer = {
                            ...response.data,
                            likes: 0,
                            answeredBy: user.username,
                        }

                        return {
                            ...question,
                            answers: [...question.answers, newAnswer]
                        }
                    }

                    return question
                })
            })
            //toast.success("Answer added successfully")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="p-4 mt-2 rounded-lg">
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
            <div className="flex justify-end space-x-2 mt-3">
                <Button type="button" variant="outline" onClick={() => setShowAnswerForm(null)}>
                    Cancel
                </Button>
                <Button type="submit" disabled={!answer.trim() || isLoading}>
                    {isLoading ? <LoadingSpinner /> : "Submit"}
                </Button>
            </div>
        </form>
    )
}

export default AddAnswer