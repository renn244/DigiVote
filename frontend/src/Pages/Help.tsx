import ShowFaqs from "@/components/pages/admin/Faqs/ShowFaqs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { MessageCircle, Search, ThumbsUp } from "lucide-react"

const communityQuestions = [
    {
        id: 1,
        question: "How do I update my address for voting?",
        askedBy: "VoterA",
        answers: [
            {
                id: 1,
                text: "You can update your address in the 'Settings' page under 'User Information'.",
                likes: 5,
                answeredBy: "Helper1",
            },
            {
                id: 2,
                text: "After updating in settings, you may need to re-register if you've moved to a new voting district.",
                likes: 3,
                answeredBy: "Helper2",
            },
        ],
    },
    {
        id: 2,
        question: "What documents do I need to bring for in-person voting?",
        askedBy: "NewVoter",
        answers: [
            {
                id: 3,
                text: "Usually, you need a valid ID. Check your local election office website for specific requirements.",
                likes: 7,
                answeredBy: "ExperiencedVoter",
            },
        ],
    },
]

const Help = () => {

    return (
        <div className="min-h-[855px] container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-6 text-blue-900">Help Center</h1>
            <div className="mb-8">
                <div className="flex mb-4">
                    <Input type="text" placeholder="Search for help..." className="mr-2" />
                    <Button>
                        <Search className="h-4 w-4 mr-2" />
                        Search
                    </Button>
                </div>

                <ShowFaqs />
            </div>

            <div>
                <h2 className="text-2xl font-semibold mb-4 text-blue-800">Community Help</h2>
                {communityQuestions.map((question) => (
                    <Card key={question.id} className="mb-4">
                        <CardHeader>
                            <CardTitle className="text-lg">{question.question}</CardTitle>
                            <p className="text-sm text-gray-500">Asked by {question.askedBy}</p>
                        </CardHeader>
                        <CardContent>
                            {question.answers.map((answer) => (
                                <div key={answer.id} className="mb-2 p-2 bg-gray-100 rounded">
                                    <p>{answer.text}</p>
                                    <div className="flex items-center mt-2 text-sm text-gray-500">
                                        <ThumbsUp className="h-4 w-4 mr-1" />
                                        <span className="mr-4">{answer.likes}</span>
                                        <span>Answered by {answer.answeredBy}</span>
                                    </div>
                                </div>
                            ))}
                            <Button variant={'outline'} className="mt-2">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Add Answer
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Help