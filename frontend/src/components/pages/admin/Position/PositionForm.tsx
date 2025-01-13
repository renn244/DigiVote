
import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { ComponentProps, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

export const formSchema = z.object({
    position: z.string().min(2, {
        message: "Position must be at least 2 characters"
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters"
    }),
    poll_id: z.number({
        required_error: "poll_id is required"
    })
})

type PositionFormProps = {
    initialData?: any,
    onsubmit: (data: z.infer<typeof formSchema>) => Promise<void>,
    className?: string,
    poll_id: number
} & ComponentProps<'form'>

const PositionForm = ({
    initialData,
    onsubmit,
    className,
    poll_id,
    ...props
}: PositionFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            position: initialData?.position || "",
            description: initialData?.description || "",
            poll_id: poll_id || undefined,
        }
    });

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
            <form {...props} onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-4", className)}>
                <FormField 
                control={form.control}
                name="position"
                render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Position</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter position" {...field} />
                        </FormControl>
                        <FormDescription>
                            This is the position that is gonna be available in the poll
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
                            Provide a brief description of the position.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <div>
                    <Button disabled={isLoading} type="submit" 
                    className="bg-yellow-500 hover:bg-yellow-600 text-white mt-4 w-full">
                        {isLoading ? <LoadingSpinner /> : "Create Position"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default PositionForm