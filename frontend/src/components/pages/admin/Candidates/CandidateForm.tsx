import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import axiosFetch from '@/lib/axios'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQuery } from '@tanstack/react-query'
import { ComponentProps, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import * as z from 'zod'

export const formSchema = z.object({
    photo: z.instanceof(FileList),
    name: z
        .string({ required_error: 'name is required' })
        .min(1, { message: 'you must enter a name' }),
    description: z.string(),
    party_id: z.string({
        required_error: 'partyId is required'
    }),
    position_id: z.string({
        required_error: 'positionId is required'
    }).min(1, { message: 'you must pick a position'})
})

type CandidateFormProps = {
    initialData?: any,
    onsubmit: (data: z.infer<typeof formSchema>) => Promise<void>,
    className?: string,
    partyId: string,
    pollId: string,
    isUpdate?: boolean, // for photo file upload look at parties form for reference
} & ComponentProps<'form'>

const CandidateForm = ({
    initialData,
    onsubmit,
    className,
    partyId,
    pollId,
    isUpdate,
    ...props
}: CandidateFormProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            photo: undefined,
            name: initialData?.name || "",
            description: initialData?.description || "",
            party_id: initialData?.party_id.toString() || partyId,
            position_id: initialData?.position_id.toString() || "",
        }
    })
    const fileRef = form.register('photo')

    const { data:positions } = useQuery({
        queryKey: ['positions', pollId],
        queryFn: async () => {
            const response = await axiosFetch.get(`/positions/getPositionOptions/${pollId}`)

            if(response.status >= 400) {
                toast.error(response.data.message);
                return
            }

            return response.data
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false
    })

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsLoading(true)
        try {
            if(!data.photo.length && !isUpdate) {
                form.setError('photo', {
                    type: 'required',
                    message: 'photo is required'
                })
                return
            }

            await onsubmit(data)
            
            // should handle the error in the unique constraints 
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
                name="photo"
                render={(_) => (
                    <FormItem>
                        <FormLabel>Photo</FormLabel>
                        <FormControl>
                            <Input type='file' placeholder='Enter image' {...fileRef} />
                        </FormControl>
                        <FormDescription>
                            Photo for you so that you will be recognized by people you meet personally.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField 
                control={form.control}
                name="name"
                render={({  field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input placeholder="Enter Name" {...field} />
                        </FormControl>
                        <FormDescription>
                            this is the candidate full name. any format just be consistent
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
                            <Textarea placeholder="Enter candidate description" className="resize-none" {...field} />
                        </FormControl>
                        <FormDescription>
                            Provide a brief description of the candidate and their reform agenda
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField 
                control={form.control}
                name="position_id"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Position</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger className='w-[200px]'>
                                <SelectValue placeholder="Select Position" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Positions</SelectLabel>
                                    {positions?.map((position: any) => (
                                        <SelectItem key={position.id} value={position.id.toString()}>{position.position}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <FormDescription>
                            This is the position that the candidate is running for.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )} />
                <div>
                    <Button disabled={isLoading} type="submit"
                    className="bg-yellow-500 hover:bg-yellow-600 text-white w-full mt-4">
                        {isLoading ? <LoadingSpinner /> : "Create Candidate"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default CandidateForm