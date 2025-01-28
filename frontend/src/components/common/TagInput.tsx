import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { X } from "lucide-react"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { useState } from "react"

type TagInputProps = {
    tags: string[],
    setTags: (tags: string[]) => void,
    options: string[],
    className?: string
} 

const TagInput = ({
    tags,
    setTags,
    options,
    className,
}: TagInputProps) => {
    const [selected, setSelected] = useState<string>("")

    const handleSubmit = (tag: string) => {
        if(!tags.includes(tag)) {
            setTags([...tags, tag])
        }
        setSelected("")
    }

    const handleRemoveTag = (tag: string) => {
        setTags(tags.filter(t => t !== tag))
    }

    return (
        <div className={cn('', className)}>
            <div className="flex flex-wrap gap-2 mb-2">
                {tags.map((tag, index) => (
                    <div key={index} className="flex items-center bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm">
                        {tag}
                        <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveTag(tag)}
                        className="ml-1 h-auto p-0 text-primary-foreground hover:bg-transparent"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Remove Tag</span>
                        </Button>
                    </div>
                ))}
            </div>
            <Select value={selected} onValueChange={(value) => handleSubmit(value)}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue  placeholder="select items" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options.map((option, idx) => (
                            tags.includes(option) === false ? 
                                <SelectItem key={idx} value={option}>{option}</SelectItem> 
                            : null
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    )
}

export default TagInput