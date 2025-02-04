import axiosFetch from "@/lib/axios"
import { question } from "@/types/questions"
import { useQueryClient } from "@tanstack/react-query"
import { ThumbsUp } from "lucide-react"
import { useState } from "react"
import toast from "react-hot-toast"
import { useSearchParams } from "react-router"

type LikeProps = {
    answerId: number,
    initialLiked: boolean
}

const Like = ({
    answerId, 
    initialLiked
}: LikeProps) => {
    const [searchParams] = useSearchParams()
    const queryClient = useQueryClient();
    const [liked, setLiked] = useState<boolean>(initialLiked || false)

    const updateLike = async (action: 'increment' | 'decrement') => {
        queryClient.setQueryData(['questions', searchParams.get('search')], (data: question[]) => {
            return data.map((question) => {
                return {
                    ...question,
                    answers: question.answers.map((answer) => {
                        if(answer.id === answerId) {
                            return {
                                ...answer,
                                likes: action === 'increment' ? answer.likes + 1 : answer.likes - 1
                            }
                        }
                        return answer
                    })
                }
            })
        })
    }

    const handleLike = async () => {
        const response = await axiosFetch.post(`community-questions/likeAnswer/${answerId}`)
        
        if (response.status >= 400) {
            toast.error(response.data.message)
            return
        }

        setLiked(true);
        updateLike('increment')
    }

    const handleUnlike = async () => {
        const response = await axiosFetch.delete(`community-questions/unlikeAnswer/${answerId}`)

        if (response.status >= 400) {
            toast.error(response.data.message)
            return
        }

        setLiked(false);
        updateLike('decrement')
    }

    return (
        <ThumbsUp onClick={() => {
            liked === true ? handleUnlike() : handleLike()
        }}
        className={`h-4 w-4 mr-1 ${liked === true ? "fill-primary text-primary" : ""}`} />
    )
}

export default Like