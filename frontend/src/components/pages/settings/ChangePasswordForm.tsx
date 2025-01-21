import LoadingSpinner from '@/components/common/LoadingSpinner'
import PasswordInput from '@/components/common/PasswordInput'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { SubmitHandler, useForm, UseFormSetError } from 'react-hook-form'
import toast from 'react-hot-toast'

export type ChangePasswordState = {
    currentPassword: string
    newPassword: string
    confirmPassword: string
}

type ChangePasswordFormProps = {
    onsubmit: (data: ChangePasswordState, 
        setError: UseFormSetError<ChangePasswordState>) => Promise<void>
}

const ChangePasswordForm = ({
    onsubmit
}: ChangePasswordFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, watch, setError, handleSubmit, reset, formState: { errors } } = useForm<ChangePasswordState>();

    const onSubmit: SubmitHandler<ChangePasswordState> = async (data) => {
        setIsLoading(true);
        try {
            await onsubmit(data, setError);
            
            // when successfull clear the form
            reset({ currentPassword: '', newPassword: '', confirmPassword: '' });
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
                    <Label htmlFor="CurrentPassword">Current Password</Label>
                    <div>
                        <PasswordInput id="CurrentPassword" {...register('currentPassword', {
                            required: 'Current Password is required',
                        })} />
                        {errors.currentPassword && <span className="text-red-500">{errors.currentPassword.message}</span>}
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="NewPassword">New Password</Label>
                    <div>
                        <PasswordInput id="NewPassword" {...register('newPassword', {
                            required: 'New Password is required',
                        })} />
                        {errors.newPassword && <span className="text-red-500">{errors.newPassword.message}</span>}
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="ConfirmPassword">Confirm Password</Label>
                    <div>
                        <PasswordInput id="ConfirmPassword" {...register('confirmPassword', {
                            required: 'Confirm Password is required',
                            validate: value => value === watch('newPassword') || 'Passwords do not match'
                        })} />
                        {errors.confirmPassword && <span className="text-red-500">{errors.confirmPassword.message}</span>}
                    </div>
                </div>
                <Button disabled={isLoading} type="submit">
                    {isLoading ? <LoadingSpinner /> : "Change Password"}
                </Button>
            </div>
        </form>
    )
}

export default ChangePasswordForm