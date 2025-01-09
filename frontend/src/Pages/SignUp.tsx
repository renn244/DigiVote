import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosFetch from "@/lib/axios"
import { SubmitHandler, useForm } from 'react-hook-form'

type signUpStateType = {
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string
}

const SignUp = () => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm<signUpStateType>()

    const onSubmit: SubmitHandler<signUpStateType> = async (data) => {
        if(data.password !== data.confirmPassword) {
            setError('confirmPassword', {
                type: 'manual',
                message: 'password does not match'
            })
        }

        const response = await axiosFetch.post('/auth/register', data)

        if(response.status === 401) {
            setError(response.data.name,{
                type: 'manual',
                message: response.data.message
            })
            return
        }

        // send the email as search params
        window.location.assign(response.data.redirect_url)
    }

    return (
        <div className="flex justify-center items-center w-full min-h-screen">
            <Card className="mx-auto max-w-lg">
                <CardHeader>
                    <CardTitle className="text-xl">
                        Sign Up
                    </CardTitle>
                    <CardDescription>
                        Enter your inforrmation to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="username">Username</Label>
                                <Input {...register('username', {
                                    required: "username is required"
                                })}
                                id="username" type="text" placeholder="renn44" />
                                {errors.username && <p>{errors.username.message}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">First name</Label>
                                    <Input {...register('firstName', {
                                        required: "first name is required"
                                    })}
                                    id="first-name" placeholder="Max" />
                                    {errors.firstName && <p>{errors.firstName.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Last name</Label>
                                    <Input {...register('lastName', {
                                        required: "last name is required"
                                    })}
                                    id="last-name" placeholder="Robinson" />
                                    {errors.lastName && <p>{errors.lastName.message}</p>}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input {...register('email', {
                                    required: 'email is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.sti\.edu\.ph$/,
                                        message: 'invalid email',
                                    }
                                })}
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                />
                                {errors.email && <p>{errors.email.message}</p>}
                            </div>
                            {/* TODO: make this a component */}
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input {...register('password', {
                                    required: 'password is required',
                                })}
                                id="password" type="password" />
                                {errors.password && <p>{errors.password.message}</p>}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input {...register('confirmPassword', {
                                    required: 'confirm password is required'
                                })}
                                id="confirmPassword" type="password" />
                                {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
                            </div>
                            <Button type="submit" className="w-full">
                                Create an account
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account? {" "}
                        <a href="/login" className="underline">
                            Login
                        </a>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default SignUp