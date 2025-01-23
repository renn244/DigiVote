import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ComponentProps, useState } from 'react';
import toast from 'react-hot-toast';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const formSchema = z.object({
    question: z.string().nonempty().min(10).max(300),
})

type QuestionsFormProps = {
    initialData?: z.infer<typeof formSchema>,
    onsubmit: (data: z.infer<typeof formSchema>) => Promise<void>,
    className?: string,
} & ComponentProps<'form'>

const QuestionsForm = ({
    initialData,
    onsubmit,
    className,
    ...props
}: QuestionsFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            question: initialData?.question || '',
        }
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true);
        try {
            await onsubmit(data);
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form {...props} className={cn('space-y-4', className)} onSubmit={form.handleSubmit(onSubmit)}>
                <FormField 
                control={form.control}
                name="question"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Question</FormLabel>
                        <FormControl>
                            <Textarea {...field} placeholder='Enter the question' />
                        </FormControl>
                        <FormDescription>
                            Your question should be at least 10 characters long and not more than 300 characters.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />

                <div>
                    <Button type="submit" disabled={isLoading} className='bg-yellow-500 hover:bg-yellow-600 text-white w-full mt-4'>
                        {isLoading ? <LoadingSpinner /> : 'Submit'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default QuestionsForm