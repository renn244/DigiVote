import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import DeleteQuestion from "./DeleteQuestion"
import UpdateQuestion from "./UpdateQuestion"

type QuestionOptionProps = {
    questionId: number,
    initialData: {
        question: string;
    }
}

const QuestionOption = ({
    questionId,
    initialData
}: QuestionOptionProps) => {
    const [popOver, setPopOver] = useState<boolean>(false)

    return (
        <Popover open={popOver} onOpenChange={setPopOver}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" >
                    <MoreHorizontal />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[160px]" align="end">
                <UpdateQuestion questionId={questionId} setPopOver={setPopOver} 
                initialData={initialData} />
                <DeleteQuestion questionId={questionId} setPopOver={setPopOver} />
            </PopoverContent>
        </Popover>
    )
}

export default QuestionOption