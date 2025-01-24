import LoadingSpinner from "@/components/common/LoadingSpinner"
import axiosFetch from "@/lib/axios"
import { question } from "@/types/questions"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import CreateQuestion from "./CreateQuestion"
import QuestionCard from "./QuestionCard"
import { useState } from "react"
import { useSearchParams } from "react-router"

const ShowQuestions = () => {
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') || '';
    const [showAnswerForm, setShowAnswerForm] = useState<number | null>(null);

    const { data: communityQuestions, isLoading } = useQuery({
        queryKey: ['questions', search],
        queryFn: async () => {
            const response = await axiosFetch.get(`/community-questions/getQuestions?search=${search}`)

            if(response.status >= 400) {
                toast.error(response.data.message)
            }

            return response.data as question[]
        },
        refetchOnWindowFocus: false,
    })

    if(isLoading) {
        return <LoadingSpinner />
    }

    // implement infinite scroll here later

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-blue-800">Community Help</h2>
                <CreateQuestion />
            </div>
            {communityQuestions?.map((question) => (
                <QuestionCard showAnswerForm={showAnswerForm} setShowAnswerForm={setShowAnswerForm} 
                key={question.id} question={question} />
            ))}
        </div>
    )
}

export default ShowQuestions