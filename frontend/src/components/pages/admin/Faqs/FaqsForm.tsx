import * as z from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentProps, useState } from 'react'
import toast from 'react-hot-toast'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import LoadingSpinner from '@/components/common/LoadingSpinner'

export const formSchema = z.object({
    question: z.string().nonempty(),
    answer: z.string().nonempty(),
})

type FaqsFormProps = {
    initialData?: z.infer<typeof formSchema>,
    onsubmit: (data: z.infer<typeof formSchema>) => Promise<void>,
    className?: string,
} & ComponentProps<'form'>

const FaqsForm = ({
    initialData,
    onsubmit,
    className,
    ...props
}: FaqsFormProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: initialData?.question || '',
            answer: initialData?.answer || '',
        },
    })
    
    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            await onsubmit(data)
        } catch(error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form {...props} onSubmit={form.handleSubmit(handleSubmit)} className={cn('space-y-4', className)}>
                <FormField 
                control={form.control}
                name="question"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                            <Input placeholder='Enter the question' {...field} />
                        </FormControl>
                        <FormDescription>
                            This is the common questions that users may ask.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField 
                control={form.control}
                name="answer"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Answer</FormLabel>
                        <FormControl>
                            <Textarea className='max-h-[300px]' placeholder='Enter the answer' {...field} />
                        </FormControl>
                        <FormDescription>
                            This is the answer to the question.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <div>
                    <Button disabled={isLoading} type="submit" className='bg-yellow-500 hover:bg-yellow-600 text-white w-full mt-4'>
                        {isLoading ? <LoadingSpinner /> : 'Submit'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default FaqsForm 