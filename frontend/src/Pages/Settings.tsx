import LoadingSpinner from "@/components/common/LoadingSpinner"
import ChangeAvatar from "@/components/pages/settings/ChangeAvatar"
import ChangePasswordForm, { ChangePasswordState } from "@/components/pages/settings/ChangePasswordForm"
import StudentInfoForm, { StudentInfoState } from "@/components/pages/settings/StudentInfoForm"
import UserInfoForm, { UserInfoState } from "@/components/pages/settings/UserInfoForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuthContext } from "@/context/AuthContext"
import axiosFetch from "@/lib/axios"
import useRefreshToken from "@/lib/useRefreshToken"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { SubmitHandler, UseFormSetError } from "react-hook-form"
import toast from "react-hot-toast"

const Settings = () => {
    const queryClient = useQueryClient();
    const { user } = useAuthContext();
    const { refreshToken } = useRefreshToken()

    const { data, isLoading } = useQuery({
        queryKey: ['getInitialUserInfo'],
        queryFn: async () => {
            const response = await axiosFetch.get('/user/getInitialUserInfo')

            return response.data
        },
        refetchOnWindowFocus: false
    })
    
    const changePassword = async (data: ChangePasswordState, setError: UseFormSetError<ChangePasswordState>) => {
        const response = await axiosFetch.patch('/user/changePassword', data)

        if(response.status === 400) {
            setError(response.data.name, {
                type: 'manual',
                message: response.data.message
            })
            return
        }

        if(response.status >= 400) {
            throw new Error(response.data.message)
        }

        await refreshToken()
        queryClient.invalidateQueries({ queryKey: ['getInitialUserInfo']})
        toast.success('Password changed successfully')
        return
    }

    const changeUserInfo = async (data: UserInfoState, setError: UseFormSetError<UserInfoState>) => {
        const response = await axiosFetch.patch('/user/updateUserInfo', data)

        if(response.status >= 400) {
            setError(response.data.name, {
                type: 'manual',
                message: response.data.message
            })
            return
        }

        await refreshToken()
        queryClient.invalidateQueries({ queryKey: ['getInitialUserInfo']})
        toast.success('User information updated successfully')
        return
    }

    const changeStudentInfo: SubmitHandler<StudentInfoState> = async (data) => {
        const response = await axiosFetch.patch('/user/updatedStudentInfo', data)
        
        if(response.status >= 400) {
            throw new Error(response.data.message)
        }

        await refreshToken()
        queryClient.invalidateQueries({ queryKey: ['getInitialUserInfo']})
        toast.success('Student information updated successfully')
        return 
    }
    
    if(isLoading) return <LoadingSpinner />

    return (
        <div className="min-h-[855px] bg-gray-50 container mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-6 text-blue-900">User Settings</h1>
            <div className="max-w-3xl mx-auto space-y-6">
                <p className="text-lg text-muted-foreground">
                    All the data will change after a few minutes after you change it. because it was cached for
                    better performance.
                </p>
                <ChangeAvatar profile={data.profile} name={data.name} />

                <Card>
                    <CardHeader>
                        <CardTitle>
                            User Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <UserInfoForm initialData={{
                            name: data?.name || '',
                            email: data?.email || '',
                            username: data?.username || '',
                            branch: data?.branch || '',
                        }} onsubmit={changeUserInfo} />
                    </CardContent>
                </Card>

                {/* Admin can't have student information */}
                {user.role === 'user' && <Card>
                    <CardHeader>
                        <CardTitle>
                            Student Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <StudentInfoForm initialData={{
                            education_level: data?.education_level || '',
                            course: data?.course || '',
                            year_level: data?.year_level || '',
                        }} onsubmit={changeStudentInfo} />
                    </CardContent>
                </Card>}

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Change Password
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ChangePasswordForm onsubmit={changePassword} />
                    </CardContent>
                </Card>

            </div>
        </div>
    )
}

export default Settings