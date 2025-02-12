import LoadingSpinner from "@/components/common/LoadingSpinner"
import PasswordInput from "@/components/common/PasswordInput"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import EMAIL_VALIDATION from "@/constant/email.regex"
import axiosFetch from "@/lib/axios"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"

type signUpAdminStateType = {
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,
}

const AdminForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit, setError, formState: { errors } } = useForm<signUpAdminStateType>()

    const onSubmit: SubmitHandler<signUpAdminStateType> = async (data) => {
        setIsLoading(true)
        try {
            if(data.password !== data.confirmPassword) {
                setError('confirmPassword', {
                    type: 'manual',
                    message: 'password does not match'
                })
            }

            const response = await axiosFetch.post('/auth/registerAdmin', data)

            if(response.status === 400) {
                setError(response.data.name, {
                    type: 'manual',
                    message: response.data.message
                })
            }

            if(response.status >= 400) {
                toast.error(response.data.message)
                return
            }

            // send the email sa search params
            window.location.assign(response.data.redirect_url)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <div>
                            <Input {...register('username', {
                                required: "username is required"
                            })} id="username" type="text" placeholder="admin000" />
                            {errors.username && <p className="text-red-500 font-medium text-sm">{errors.username.message}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <div>
                                <Input {...register("firstName", {
                                    required: "first name is required"
                                })} id="first-name" placeholder="Max" />
                                {errors.firstName && <p className="text-red-500 font-medium text-sm">{errors.firstName.message}</p>}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <div>
                                <Input {...register("lastName", {
                                    required: "last name is required"
                                })} id="last-name" placeholder="Robinson" />
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <div>
                            <Input {...register("email", {
                                required: "email is required",
                                pattern: {
                                    value: EMAIL_VALIDATION.ADMIN,
                                    message: 'invalid email'
                                }
                            })} id="email" placeholder="m@example.com" />
                            {errors.email && <p className="text-red-500 font-medium text-sm">{errors.email.message}</p>}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <div>
                            <PasswordInput {...register("password", {
                                required: "password is required",
                            })} id="password" />
                            {errors.password && <p className="text-red-500 font-medium text-sm">{errors.password.message}</p>}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <div>
                            <PasswordInput {...register("confirmPassword", {
                                required: "Confirm Password is required",
                            })} id="confirmPassword" />
                            {errors.confirmPassword && <p className="text-red-500 font-medium text-sm">{errors.confirmPassword.message}</p>}
                        </div>
                    </div>
                </div>
            </div>
            <Button type="submit" disabled={isLoading} className="w-full mt-3">
                {isLoading ? <LoadingSpinner /> : "Create Account"}
            </Button>
        </form>
    )
}

export default AdminForm