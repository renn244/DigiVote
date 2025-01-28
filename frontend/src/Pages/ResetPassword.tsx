import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useSearchParams } from "react-router";
import { Label } from "@/components/ui/label";
import PasswordInput from "@/components/common/PasswordInput";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import axiosFetch from "@/lib/axios";
import LoadingSpinner from "@/components/common/LoadingSpinner";

type ResetPasswordForm = {
    newPassword: string
    confirmPassword: string
}

const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit, setError, formState: { errors } } = useForm<ResetPasswordForm>();

    const [searchParams] = useSearchParams();
    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';

    const onSubmit: SubmitHandler<ResetPasswordForm> = async (data) => {
        setIsLoading(true)
        try {
            const token = sessionStorage.getItem('token')
            const email = sessionStorage.getItem('email')

            const response = await axiosFetch.post('/auth/reset-password', {
                email: email,
                token: token ,
                ...data
            })

            if(response.status === 400 && response.data.message[0] === 'Passwords do not match') {
                setError('confirmPassword', {
                    type: 'manual',
                    message: 'Passwords do not match'
                })
                return
            }

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            toast.success(response.data.message)
            // redirect to login page
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    // just in case the user refreshes the page and remove the token and email from the session storage
    useEffect(() => {
        if(!token || !email) return
        sessionStorage.setItem('token', token)
        sessionStorage.setItem('email', email)  
    }, [token, email])
    
    return (
        <div className="flex justify-center items-center w-full min-h-[855px]">
            <div className="max-w-[450px]">
                <Card>
                    <CardHeader>
                        <CardTitle>Reset Password</CardTitle>
                        <CardDescription>
                            Enter your new password
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 w-[400px]">
                            <div className="grid gap-2">
                                <Label className={errors.newPassword ? 'text-red-500' : ''}
                                htmlFor="newPassword">new Password</Label>
                                <div>
                                    <PasswordInput {...register('newPassword', {
                                        required: 'New password is required',
                                    })} id="newPassword" />
                                    {errors.newPassword && <span className="text-red-500 font-medium text-sm">{errors.newPassword.message}</span>}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label className={errors.confirmPassword ? 'text-red-500' : ''} 
                                htmlFor="confirmPassword">Confirm Password</Label>
                                <div>
                                    <PasswordInput {...register('confirmPassword', {
                                        required: 'Confirm password is required',
                                    })} id="confirmPassword" />
                                    {errors.confirmPassword && <span className="text-red-500 font-medium text-sm">{errors.confirmPassword.message}</span>}
                                </div>
                            </div>
                            <Button disabled={isLoading} type="submit" >
                                {isLoading ? <LoadingSpinner /> : "Reset Password"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ResetPassword