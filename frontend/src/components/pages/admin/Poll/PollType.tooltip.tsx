import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CircleHelp } from "lucide-react"

const PollTypeToolTip = () => (
    <TooltipProvider>
        <Tooltip delayDuration={300}>
            <TooltipTrigger>
                <CircleHelp className="w-4 h-4" />
            </TooltipTrigger>
            <TooltipContent className="p-3">
                <div className="flex gap-2">
                    <h1 className="font-semibold">Multiple:</h1>
                    <p>This is use for voting for multiple candidates in different parties.</p>
                </div>
                <div className="flex gap-2">
                    <h1 className="font-semibold">Single:</h1>
                    <p>This is use for voting on just 1 party. that means voting all of the candidates of that party.</p>
                </div>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
)

export default PollTypeToolTip