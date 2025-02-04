import LoadingSpinner from "@/components/common/LoadingSpinner"
import axiosFetch from "@/lib/axios"
import { question } from "@/types/questions"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"
import CreateQuestion from "./CreateQuestion"
import QuestionCard from "./QuestionCard"
import { useState } from "react"
import { useSearchParams } from "react-router"
import { Card, CardContent } from "@/components/ui/card"
import { Frown, FileQuestion } from "lucide-react"

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
            {communityQuestions && communityQuestions?.length > 0 ? (
                communityQuestions?.map((question) => (
                    <QuestionCard showAnswerForm={showAnswerForm} setShowAnswerForm={setShowAnswerForm} 
                    key={question.id} question={question} />
                ))
            ) : (
                <Card className="bg-yellow-50 border-yellow-200">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        {search ? (
                            <>
                                <Frown className="w-16 h-16 text-yellow-400 mb-4" />
                                <h2 className="text-2xl font-semibold text-yellow-800 mb-2">
                                    There is no result for the question that you are searching for.
                                </h2>
                                <p className="text-yellow-600 text-center max-w-lg">
                                    Sorry, but you can ask the question and wait for the answer. this can also help those people who would ask the question in the future
                                </p>
                            </>
                        ) : (
                            <>
                                <FileQuestion className="w-16 h-16 text-yellow-400 mb-4" />
                                <h2 className="text-2xl font-semibold text-yellow-800 mb-2">
                                    There is no questions available.
                                </h2>
                                <p className="text-yellow-600 text-center max-w-lg">
                                    Sorry, There is no questions available you can start asking question to start!
                                </p>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default ShowQuestions