import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosFetch from "@/lib/axios"
import { useMutation } from "@tanstack/react-query"
import { FormEvent, useState } from "react"
import toast from "react-hot-toast"

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

            if(response.status === 401) {
                setError({
                    type: response.data.name,
                    error: response.data.message
                })
            }

            if(response.status >= 400) {
                throw new Error(response.data.message)
            }

            // handle success
            //
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
                                    <Input value={credentials.username} 
                                    onChange={(e) => setCredentials({...credentials, username: e.target.value})}
                                    id="username" type="text" />
                                </div>
                                <div className="grid gap-2">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <a
                                        href="#"
                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                        Forgot your password?
                                        </a>
                                    </div>
                                    <Input value={credentials.password}
                                    onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                                    id="password" type="password" />
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
                    <a href="#" className="underline underline-offset-4">
                    Sign up
                    </a>
                </div>
            </div>
        </div>
    )
}

export default Login