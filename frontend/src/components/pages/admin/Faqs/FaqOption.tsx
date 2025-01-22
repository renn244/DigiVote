import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { MoreHorizontal } from "lucide-react"
import { useState } from "react"
import DeleteFaq from "./DeleteFaq"
import UpdateFaq from "./UpdateFaq"

type FaqOptionProps = {
    id: number,
    initialData: {
        question: string,
        answer: string,
    }
}

const FaqOption = ({
    id,
    initialData
}: FaqOptionProps) => {
    const [popOver, setPopOver] = useState(false)

    return (
        <Popover open={popOver} onOpenChange={setPopOver}>
            <PopoverTrigger asChild>
                <Button onClick={(e) => e.stopPropagation()} variant="ghost" size="sm"> 
                    <MoreHorizontal />
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="flex flex-col space-y-2 items-start max-w-[150px]">
                <UpdateFaq id={id} setPopover={setPopOver} initialData={initialData} />
                <DeleteFaq id={id} setPopover={setPopOver} />
            </PopoverContent>
        </Popover>
    )
}

export default FaqOption