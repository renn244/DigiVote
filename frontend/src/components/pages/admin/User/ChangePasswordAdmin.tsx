import LoadingSpinner from "@/components/common/LoadingSpinner"
import PasswordInput from "@/components/common/PasswordInput"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import axiosFetch from "@/lib/axios"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"

type ChangePasswordStateForm = {
    password: string,
    confirmPassword: string,
}

type ChangePasswordAdminProps = {
    userId: number,
    name: string,
}

const ChangePasswordAdmin = ({
    userId,
    name
}: ChangePasswordAdminProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, setError, formState: { errors } } = useForm<ChangePasswordStateForm>()

    const onSubmit: SubmitHandler<ChangePasswordStateForm> = async (data) => {
        setIsLoading(true);
        try {
            const response = await axiosFetch.patch(`/user/changePasswordAdmin?userId=${userId}`, data);

            if(response.status === 400 && response.data.message?.[0] === 'Password does not match') {
                setError('confirmPassword', {
                    type: 'manual',
                    message: 'Password does not match'
                })
                return;
            }

            if(response.status >= 400) {
                throw new Error(response.data.message);
            }

            toast.success(response.data.message);
            setIsDialogOpen(false);
        } catch(error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" className="w-full">
                    Change Password
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Change Password of {name}
                    </DialogTitle>
                    <DialogDescription>
                        Change the password of the student. this is only done throught the request of the student.
                    </DialogDescription>
                </DialogHeader>
                <form className="grid gap-3" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-2">
                        <Label className={errors.password ? 'text-red-500' : ''}
                        htmlFor="password">Password</Label>
                        <div>
                            <PasswordInput {...register('password', {
                                required: 'Password is required'
                            })} id="password"/>
                            {errors.password && <span className="text-red-500 font-medium text-sm">{errors.password.message}</span>}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label className={errors.confirmPassword ? 'text-red-500' : ''}
                        htmlFor="confirmPassword">Confirm Password</Label>
                        <div>
                            <PasswordInput {...register('confirmPassword', {
                                required: 'Confirm Password is required'
                            })} id="confirmPassword" />
                            {errors.confirmPassword && <span className="text-red-500 font-medium text-sm">{errors.confirmPassword.message}</span>}
                        </div>
                    </div>
                    <div>
                        <Button disabled={isLoading} className="bg-yellow-500 hover:bg-yellow-600 text-white w-full mt-3" type="submit">
                            {isLoading ? <LoadingSpinner /> : "Change Password"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ChangePasswordAdmin