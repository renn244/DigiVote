import { useQuery, useQueryClient } from "@tanstack/react-query"
import PartiesForm, { formSchema } from "./PartiesForm"
import { useNavigate, useParams } from "react-router";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import axiosFetch from "@/lib/axios";
import toast from "react-hot-toast";
import { party } from "@/types/party";
import * as z from 'zod'

const UpdateParties = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { id } = useParams();

    if(!id) return // redirect

    const { data: initialData, isLoading } = useQuery({
        queryKey: ['update', 'parties', id],
        queryFn: async () => {
            const response = await axiosFetch.get(`/parties/${id}`);

            if(response.status === 404) {
                navigate('/notfound')
            }

            if(response.status >= 400) {
                toast.error(response.data.message);
                return
            }

            return response.data as party
        },
        refetchOnWindowFocus: false
    })

    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('poll_id', data.poll_id);
        formData.append('banner', data.banner?.[0])

        const response = await axiosFetch.patch(`/parties/${id}?pollId=${initialData?.poll_id}`, formData);

        if(response.status >= 400) {
            throw new Error(response.data.message) // this will be caught by the form
        }

        toast.success('Party updated successfully');

        // updating the get parties query
        queryClient.setQueryData(['update', 'parties', id], () => response.data)
        navigate('/admin/parties')
    }

    if(isLoading) {
        return <LoadingSpinner />
    }
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">Update Party</h1>
            </div>
            <div className="flex justify-center">
                <PartiesForm className="w-full max-w-[550px]" initialData={initialData}
                initialPollId={initialData?.poll_id} onsubmit={onSubmit} isUpdate={true}
                />
            </div>
        </div>
    )
}

export default UpdateParties