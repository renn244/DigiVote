import LoadingSpinner from "@/components/common/LoadingSpinner"
import PasswordInput from "@/components/common/PasswordInput"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosFetch from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { FormEvent, useState } from "react"
import toast from "react-hot-toast"
import { Link } from "react-router"

type LoginStateType = {
    username: string,
    password: string
}

const Login = () => {
    const [error, setError] = useState({ type: '', error: '' })
    const [credentials, setCredentials] = useState<LoginStateType>({
        username: '',
        password: ''
    })

    const { mutate, isPending } = useMutation({
        mutationKey: ['login'],
        mutationFn: async (e: FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            if(!credentials.username || !credentials.password) {
                toast.error('please fill in the fields!')
            }

            const response = await axiosFetch.post('/auth/login', credentials)

            if(response.status === 400) {
                setError({
                    type: response.data.name,
                    error: response.data.message
                })

                return
            }

            if(response.status >= 401) {
                throw new Error(response.data.message)
            }

            setError({ type: '', error: ''}) // just clean

            // save access token in the local storage
            window.localStorage.setItem('access_token', response.data.access_token)
            window.localStorage.setItem('refresh_token', response.data.refresh_token)
            window.location.assign('/')
        },
        onError: (error: any) => {
            toast.error(error.message)
        }
    })

    return (
        <div className="flex justify-center items-center w-full min-h-screen">
            <div className="flex flex-col gap-6 w-full max-w-[400px]">
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle>Welcome back</CardTitle>
                        <CardDescription>
                            Login with your credentials
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={(e) => mutate(e)}>
                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <div>
                                        <Input value={credentials.username} 
                                        onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                                        id="username" type="text" />
                                        {error.type === 'username' && <span className="text-red-500 font-medium text-sm">{error.error}</span>}
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                        to="/forgot-password"
                                        className="ml-auto text-sm underline-offset-4 hover:underline text-blue-700 font-medium"
                                        >
                                        Forgot your password?
                                        </Link>
                                    </div>
                                    <div>
                                        <PasswordInput value={credentials.password} 
                                        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                        id="password" />
                                        {error.type === 'password' && <span className="text-red-500 font-medium text-sm">{error.error}</span>}
                                    </div>
                                </div>
                                <Button disabled={isPending} type="submit" className="w-full">
                                    {isPending ? <LoadingSpinner /> : "Login"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="underline underline-offset-4 text-blue-700">
                    Sign up
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Login