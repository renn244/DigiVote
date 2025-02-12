import AdminForm from "@/components/pages/signup/AdminForm"
import UserForm from "@/components/pages/signup/UserForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link } from "react-router"

const SignUp = () => {

    return (
        <div className="flex justify-center items-center w-full min-h-[855px]">
            <div>
                <Tabs defaultValue="user">
                    <div className="flex justify-center mt-3"> 
                        <TabsList className="grid grid-cols-2 w-[450px]">
                            <TabsTrigger value="user">
                                User
                            </TabsTrigger>
                            <TabsTrigger value="admin">
                                Admin/Faculty
                            </TabsTrigger>
                        </TabsList>
                    </div>
                    <TabsContent value="user">
                        <Card className="mx-auto my-3">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    Sign Up
                                </CardTitle>
                                <CardDescription>
                                    Enter your information to create an account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <UserForm />
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="admin">
                        <Card className="mx-auto my-3">
                            <CardHeader>
                                <CardTitle className="text-xl">
                                    Sign Up
                                </CardTitle>
                                <CardDescription>
                                    Enter your information to create an account
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <AdminForm />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
                <div className="my-4 text-center text-sm">
                    Already have an account? {" "}
                    <Link to="/login" className="underline underline-offset-4 text-blue-700">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default SignUp