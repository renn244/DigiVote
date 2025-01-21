import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"

export type UserInfoState = {
    name: string
    email: string
    username: string
    branch: string
}

type UserInfoFormProps = {
    onsubmit: SubmitHandler<UserInfoState>,
    initialData: UserInfoState
}

const UserInfoForm = ({
    onsubmit,
    initialData
}: UserInfoFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<UserInfoState>({
        defaultValues: initialData
    });

    const onSubmit = async (data: UserInfoState) => {
        setIsLoading(true);
        try {
            await onsubmit(data);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="Name">Name</Label>
                    <div>
                        <Input type="text" {...register('name', {
                            required: 'name is required',
                        })} />
                        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="Email">Email</Label>
                    <div>
                        <Input type="text" {...register('email', {
                            required: 'email is required',
                            pattern: {
                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z]+\.sti\.edu\.ph$/,
                                message: 'invalid email',
                            }
                        })} />
                        {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="Username">Username</Label>
                    <div>
                        <Input type="text" {...register('username', {
                            required: 'username is required',
                        })} />
                        {errors.username && <span className="text-red-500">{errors.username.message}</span>}
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="Branch">Branch</Label>
                    <div>
                        <Input type="text" {...register('branch', {
                            required: 'branch is required',
                        })} />
                        {errors.branch && <span className="text-red-500">{errors.branch.message}</span>}
                    </div>
                </div>
                <Button disabled={isLoading} type="submit">
                    {isLoading ? <LoadingSpinner /> : "Save Changes"}
                </Button>
            </div>
        </form>
    )
}

export default UserInfoForm