import LoadingSpinner from "@/components/common/LoadingSpinner"
import SomethingWentWrong from "@/components/common/SomethingWentWrong"
import UpdateUserForm, { userInfoForm } from "@/components/pages/admin/User/UpdateUserForm"
import { Button } from "@/components/ui/button"
import axiosFetch from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft } from "lucide-react"
import { Link, useNavigate, useParams, useSearchParams } from "react-router"

const UpdateUserInfo = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { userId } = useParams<{ userId: string }>();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['getUser', userId],
        queryFn: async () => {
            const response = await axiosFetch.get(`/user/getInitialUserInfoAdmin?userId=${userId}`)
            
            if(response.status === 404) {
                navigate('/notfound')
                return
            }

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }
            
            return response.data as userInfoForm
        },
        refetchOnWindowFocus: false
    })

    const goBackUrl = searchParams.get('goback') || '';
    const search = searchParams.get('search') || '';
    const page = searchParams.get('page') || '1';

    if(isLoading) {
        return <LoadingSpinner />
    }

    if(isError || !userId || !data) {
        return <SomethingWentWrong />
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-blue-900">Update User</h1>
                <Button asChild variant="outline">
                    <Link to={`${goBackUrl}?search=${search}&page=${page}`}>
                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Users
                    </Link>
                </Button>
            </div>
            <UpdateUserForm initialData={data} userId={userId} />
        </div>
    )
}

export default UpdateUserInfo