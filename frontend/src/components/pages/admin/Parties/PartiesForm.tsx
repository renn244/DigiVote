import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import axiosFetch from '@/lib/axios'
import { cn } from '@/lib/utils'
import { poll } from '@/types/poll'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { ComponentProps, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

export const formSchema = z.object({
    name: z.string().min(3, {
        message: "Name must be at least 3 characters"
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters"
    }),
    poll_id: z.string({
        required_error: "poll is required"
    }),
    banner: z
        .instanceof(FileList)
})

type PartiesFormProps = {
    initialData?: any,
    onsubmit: (data: z.infer<typeof formSchema>) => Promise<void>,
    className?: string,
    initialPollId?: number,
    isUpdate?: boolean,
} & ComponentProps<'form'>

const PartiesForm = ({
    initialData,
    onsubmit,
    className,
    initialPollId,
    isUpdate,
    ...props
}: PartiesFormProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            banner: undefined,
            name: initialData?.name || "",
            description: initialData?.description || "",
            poll_id: initialData?.poll_id?.toString() || initialPollId?.toString()
        }
    })
    const fileRef = form.register('banner')
    
    // get the polls
    const { data: polls } = useQuery({
        queryKey: ['getpolls'],
        queryFn: async () => {
            const response = await axiosFetch.get('/poll')

            if(response.status >= 400) {
                toast.error(response.data.message)
                return
            }

            return response.data
        },
        refetchOnWindowFocus: false
    })
    
    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            // validation
            if(!data.banner.length && !isUpdate) {
                form.setError('banner', {
                    type: 'required',
                    message: 'banner is required'
                })
                return;
            }
            
            // calling the submit callback
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
                <FormField 
                control={form.control}
                name="banner"
                render={(_) => (
                    <FormItem>
                        <FormLabel>Banner</FormLabel>
                        <FormControl>
                            <Input type="file" 
                            placeholder='Enter images' 
                            {...fileRef} />
                        </FormControl>
                        <FormDescription>
                            Banner of your partylist. Eg. photo of all of you with some designs
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter Name" {...field} />
                        </FormControl>
                        <FormDescription>
                            This is the partylist name that will be displayed to voters
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
                            placeholder="Enter party description"
                            className="resize-none"
                            {...field}
                            />
                        </FormControl>
                        <FormDescription>
                            Provide a bried description of the poll
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField 
                control={form.control}
                name="poll_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>poll</FormLabel>
                        <Select disabled={isUpdate} value={field.value} onValueChange={field.onChange} >
                            <SelectTrigger className='w-[200px]'>
                                <SelectValue placeholder="Select a poll" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Poll</SelectLabel>
                                    {polls?.map((poll: poll) => (
                                        <SelectItem key={poll.id} value={poll.id.toString()}>{poll.title}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FormDescription>this is where the parties are being voted</FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <div>
                    <Button disabled={isLoading} type="submit" 
                    className="bg-yellow-500 hover:bg-yellow-600 text-white w-full mt-4">
                        {isLoading ? <LoadingSpinner /> : isUpdate ? "Update Party" : "Create Party"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default PartiesForm