import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { question } from "@/types/questions"
import { MessageCircle, ThumbsUp } from "lucide-react"
import QuestionOption from "./QuestionOption"
import { useAuthContext } from "@/context/AuthContext"

type QuestionCardProps = {
  question: question
}

const QuestionCard = ({
  question
}: QuestionCardProps) => {
  const { user } = useAuthContext()

  return (
    <Card className="mb-4">
      <CardHeader className="flex-row justify-between">
        <div>
          <CardTitle className="text-lg">{question.question}</CardTitle>
          <p className="text-sm text-gray-500">Asked by {question.askedBy}</p>
        </div>
        {user.id === question.asked_by_id && (
          <QuestionOption 
          initialData={{ question: question.question }} 
          questionId={question.id} />
        )}
      </CardHeader>
      <CardContent>
        {question.answers.map((answer) => (
          <div key={answer.id} className="mb-2 p-2 bg-gray-100 rounded">
            <p>{answer.answer}</p>
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
  )
}

export default QuestionCard