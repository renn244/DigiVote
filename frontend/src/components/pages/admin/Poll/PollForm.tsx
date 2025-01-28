import LoadingSpinner from "@/components/common/LoadingSpinner"
import TagInput from "@/components/common/TagInput"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { ComponentProps, useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import * as z from 'zod'

export const formSchema = z.object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),
    description: z.string().min(10, {
      message: "Description must be at least 10 characters.",
    }),
    start_date: z.date({
      required_error: "A start date is required.",
    }),
    end_date: z.date({
      required_error: "An end date is required.",
    }),
    vote_type: z.enum(["single", "multiple"], {
      required_error: "Please select a poll type.",
    }),
    allowed_education_levels: z.array(z.string()).nonempty(),
    allowed_courses: z.array(z.string()).nonempty(),
}).refine((data) => data.end_date > data.start_date, {
    message: "End date must be after start date.",
    path: ["end_date"],
})
  
type PollFormProps = {
    initialData?: any,
    onsubmit: (data: z.infer<typeof formSchema>) => Promise<void>, // make the onsubmit small because it's affecting form
    className?: string
} & ComponentProps<'form'>

const PollForm = ({
    initialData,
    onsubmit,
    className,
    ...props
}: PollFormProps) => {
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: initialData?.title ||  "",
            description: initialData?.description || "",
            start_date: initialData?.start_date ? new Date(initialData.start_date) : undefined,
            end_date: initialData?.end_date ? new Date(initialData.end_date) : undefined,
            vote_type: initialData?.vote_type || "single",
            allowed_education_levels: initialData?.allowed_education_levels || [],
            allowed_courses: initialData?.allowed_courses || [],
        }
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            await onsubmit(data)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form {...props} onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-4", className)}>
                <div className="flex flex-col lg:flex-row justify-between">
                    <div className="space-y-4">
                        <FormField 
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Poll Title</FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter poll title" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is the title that will be displayed to voters.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Enter poll description"
                                    className="resize-none"
                                    {...field}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Provide a brief description of the poll.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <div className="flex justify-between">
                            <FormField
                            control={form.control}
                            name="start_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Start Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"}
                                                className={cn("w-[180px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground")}>
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date() 
                                            }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        The date when the poll will start.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField
                            control={form.control}
                            name="end_date"
                            render={({ field }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>End Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button variant={"outline"}
                                                className={cn("w-[180px] pl-3 text-left font-normal",
                                                !field.value && "text-muted-foreground")}>
                                                    {field.value ? (
                                                        format(field.value, "PPP")
                                                    ) : (
                                                        <span>Pick a date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) => 
                                                date < addDays(new Date(form.getValues('start_date')), 7)
                                            }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormDescription>
                                        The date when the poll will end.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <FormField
                        control={form.control}
                        name="vote_type"
                        render={({ field }) => (
                            <FormItem className="space-y-3">
                                <FormLabel>Poll Type</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                    value={form.getValues("vote_type")}
                                    onValueChange={field.onChange}
                                    className="flex space-x-6"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="single" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Single Choice
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="multiple" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                Multiple Choice
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField 
                        control={form.control}
                        name="allowed_education_levels"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Allowed Education Levels</FormLabel>
                                <FormControl>
                                    <TagInput options={["senior_highschool", "tertiary"]}
                                    tags={field.value || []}
                                    setTags={(tags) => field.onChange(tags)}  />
                                </FormControl>
                                <FormDescription>
                                    Enter the education levels that are allowed to vote.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                        <FormField 
                        control={form.control}
                        name="allowed_courses"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Allowed Courses</FormLabel>
                                <FormControl>
                                    <TagInput options={["BSIT", "BSCS", "BSIS"]} // fetch the courses from the backend
                                    tags={field.value || []}
                                    setTags={(tags) => field.onChange(tags)} />
                                </FormControl>
                                <FormDescription>
                                    Enter the courses that are allowed to vote.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )} />
                    </div>
                </div>
                <div>
                    <Button disabled={isLoading} type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-white w-full mt-4">
                        {isLoading ? <LoadingSpinner /> : "Create Poll"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default PollForm