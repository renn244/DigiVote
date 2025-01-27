import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosFetch from "@/lib/axios"
import { Check } from "lucide-react"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"

type ForgotPasswordForm = {
    email: string
} 

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('Please check your email for the reset link')
    const { register, handleSubmit, setError, formState: { errors } } = useForm<ForgotPasswordForm>()

    const onSubmit: SubmitHandler<ForgotPasswordForm> = async (data) => {
        setIsLoading(true)
        try {
            const response = await axiosFetch.post('/auth/forgot-password', data)

            // this is needed because class validator error message returns an array
            const isMessageArray = typeof response.data.message === typeof []
            if(response.status === 400) {
                setError('email', {
                    type: 'manual',
                    message: isMessageArray ? response.data.message[0] : response.data.message
                })
                return
            }

            if(response.status >= 401) {
                throw new Error(response.data.message)
            }

            // handle success
            setSuccessMessage(response.data.message)
        } catch (error) {
            toast.error('An error occured')            
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex justify-center items-center w-full min-h-[855px]">
            <div className="max-w-[450px]">
                <Card>
                    <CardHeader>
                        <CardTitle>Forgot Password</CardTitle>
                        <CardDescription>
                            Enter your email provided in your raf. we will send you a link to reset your password
                        </CardDescription>
                        {successMessage && (
                            <p className="flex text-green-500 font-medium">
                                {successMessage} <Check className="ml-2" />
                            </p>
                        )}
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label 
                                    className={errors.email ? `text-red-500` : ''}
                                    htmlFor="email">Email</Label>
                                    <Input {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.sti\.edu\.ph$/,
                                            message: 'Invalid email'
                                        }
                                    })}
                                    placeholder="surname.20000@branch.sti.edu.ph" id="email" type="email" />
                                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                                </div>
                                <Button type="submit" className="w-full">
                                    {isLoading ? <LoadingSpinner /> : "Send Email"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ForgotPassword