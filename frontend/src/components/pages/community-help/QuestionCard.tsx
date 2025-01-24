import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { question } from "@/types/questions"
import { MessageCircle } from "lucide-react"
import QuestionOption from "./QuestionOption"
import { useAuthContext } from "@/context/AuthContext"
import { Dispatch, SetStateAction } from "react"
import AddAnswer from "./Answer/AddAnswer"
import { format } from "date-fns"
import AnswerOption from "./Answer/AnswerOption"
import Like from "./Like/Like"

type QuestionCardProps = {
  question: question,
  showAnswerForm: number | null,
  setShowAnswerForm: Dispatch<SetStateAction<number | null>>,
}

const QuestionCard = ({
  question,
  showAnswerForm,
  setShowAnswerForm,
}: QuestionCardProps) => {
  const { user } = useAuthContext();

  return (
    <Card className="mb-4">
      <CardHeader className="flex-row justify-between">
        <div>
          <CardTitle className="text-lg">{question.question}</CardTitle>
          <p className="text-sm text-gray-500">Asked by {question.askedBy} • {format(new Date(question.created_at), 'yyyy-MM-dd')}</p>
        </div>
        {user.id === question.asked_by_id && (
          <QuestionOption 
          initialData={{ question: question.question }} 
          questionId={question.id} />
        )}
      </CardHeader>
      <CardContent>

        {question.answers.map((answer) => (
          <div key={answer.id} className="flex w-full mb-2 p-2 bg-gray-100 rounded">
            <div className=" w-full">
              <p>{answer.answer}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <Like initialLiked={answer.liked} answerId={answer.id} />
                <span className="mr-4 select-none">{answer.likes}</span>
                <span>Answered by {answer.answeredBy} • {format(new Date(answer?.created_at), 'yyyy-MM-dd')}</span>
              </div>
            </div>
            {answer.answered_by_id === user.id && (
              <AnswerOption initialData={{ answer: answer.answer }} answerId={answer.id} />
            )}
          </div>
        ))}

        {showAnswerForm === question.id ? (
          <AddAnswer questionId={question.id} setShowAnswerForm={setShowAnswerForm} />
        ) : (
          <Button variant={'outline'} className="mt-2" onClick={() => setShowAnswerForm(question.id)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Add Answer
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

export default QuestionCard