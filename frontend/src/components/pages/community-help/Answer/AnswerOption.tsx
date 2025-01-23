import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import DeleteAnswer from "./DeleteAnswer"
import UpdateAnswer from "./UpdateAnswer"

type AnswerOptionProps = {
    answerId: number,
    initialData: {
        answer: string
    }
}

const AnswerOption = ({
    answerId,
    initialData
}: AnswerOptionProps) => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                    <MoreHorizontal />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="max-w-[160px]">
                <div className="flex flex-col">
                    <UpdateAnswer answerId={answerId} setPopOver={setOpen} initialData={initialData} />
                    <DeleteAnswer answerId={answerId} setPopOver={setOpen} />
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default AnswerOption