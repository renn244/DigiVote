import PollForm, { formSchema } from "./PollForm";
import * as z from "zod";
import axiosFetch from "@/lib/axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { useNavigate, useParams } from "react-router";
import { poll } from "@/types/poll";

const UpdatePoll = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id } = useParams()

    const { data, isLoading } = useQuery({
        queryKey: ['update', 'polls', id],
        queryFn: async () => {
            const response = await axiosFetch.get(`/poll/getInitialData/${id}`);

            if(response.status === 404) {
                navigate('/notfound')
            }

            if(response.status >= 400) {
                toast.error(response.data.message);
                return
            }

            return response.data as poll;
        },
        refetchOnWindowFocus: false
    })
    
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const response = await axiosFetch.patch(`/poll/${id}`, data);

        if(response.status >= 400) {
            throw new Error(response.data.message); // this will be caught by the form
        }

        toast.success('Poll updated successfully!');
        
        // // updating the poll
        // queryClient.setQueryData(['polls'], (old: poll[]) => {
        //     return old.map(poll => {
        //         if(poll.id === response.data.id) {
        //             return response.data
        //         }
        //         return poll
        //     })
        // })

        // updating the get poll query
        queryClient.setQueryData(['update', 'polls', id], () => response.data)
        navigate('/admin/polls')
    }

    if(isLoading) return <LoadingSpinner />

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Update Poll</h1>
            </div>
            <div className="flex justify-center">
                <PollForm className="w-full max-w-[855px]"
                initialData={data} onsubmit={onSubmit} />
            </div>
        </div>
    )
}

export default UpdatePoll