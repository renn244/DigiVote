import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import axiosFetch from '@/lib/axios'
import { useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

export type userInfoForm = {
    name: string,
    email: string,
    username: string,
    branch: string,
    education_level: 'senior_highschool' | 'tertiary',
    year_level: string,
    student_id: string,
    course: string,
}

type UpdateUserFormProps = {
    userId: string,
    initialData: userInfoForm
}

const UpdateUserForm = ({
    userId,
    initialData 
}: UpdateUserFormProps) => {
    const queryClient = useQueryClient();
    const [loading, setLoading] = useState(false)
    const { register, watch, setError, setValue, handleSubmit, formState: { errors } } = useForm<userInfoForm>({
        defaultValues: {
            name: initialData.name,
            email: initialData.email,
            username: initialData.username,
            branch: initialData.branch,
            education_level: initialData.education_level,
            year_level: initialData.year_level,
            student_id: initialData.student_id,
            course: initialData.course
        }
    })   

    const onSubmit: SubmitHandler<userInfoForm> = async (data) => {
        setLoading(true)
        try {
            const response = await axiosFetch.patch(`/user/updateUserInfoAdmin?userId=${userId}`, data)

            if(response.status === 400) {
                setError(response.data.name, {
                    type: 'manual',
                    message: response.data.message
                })
                return
            }

            if(response.status >= 401) {
                throw new Error(response.data.message);
            }

            await queryClient.setQueryData(['getUser', userId], () => response.data)
            toast.success("User updated successfully")
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex justify-center items-center gap-7 w-full mt-10 md:mt-24 lg:mt-32">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Edit User Information
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col justify-between">
                        <div className="flex flex-col lg:flex-row gap-3 lg:gap-7">
                            <div className="grid gap-4 w-[400px]">
                                <div className="grid gap-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input {...register('username', {
                                        required: "username is required"
                                    })} 
                                    id="username" type="text" placeholder="renn44"/>
                                    {errors.username && <p className="text-red-500 font-medium text-sm">{errors.username.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="last-name">Name</Label>
                                        <Input {...register('name', {
                                            required: "last name is required"
                                        })}
                                        id="last-name" placeholder="Robinson" />
                                        {errors.name && <p className="text-red-500 font-medium text-sm">{errors.name.message}</p>}
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
                                    {errors.email && <p className="text-red-500 font-medium text-sm">{errors.email.message}</p>}
                                </div>
                            </div>
                            <div className="grid gap-4 w-[400px]">
                                <div className="grid gap-2">
                                    <Label htmlFor="education_level">Education Level</Label>
                                    <Select value={watch('education_level')} onValueChange={(value) => setValue('education_level', value as userInfoForm['education_level'])} >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Education level" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>
                                                    Education Level
                                                </SelectLabel>
                                                <SelectItem value="senior_highschool">Senior HighSchool</SelectItem>
                                                <SelectItem value="tertiary">Tertiary</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                    {errors.education_level && <p className="text-red-500 font-medium text-sm">{errors.education_level.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="student_id">Student ID</Label>
                                    <Input id="student_id" type="text" placeholder="Eg. 20005344232" 
                                    {...register('student_id', {
                                        required: "student id is required"
                                    })} />
                                    {errors.student_id && <p className="text-red-500 font-medium text-sm">{errors.student_id.message}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="year_level">Year Level</Label>
                                        <Input id="year_level" type="text" placeholder="Eg. 1st year" 
                                        {...register('year_level', {
                                            required: "year level is required"
                                        })} />
                                        {errors.year_level && <p className="text-red-500 font-medium text-sm">{errors.year_level.message}</p>}
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="course">Course/Strand</Label>
                                        <Input id="course" type="text" placeholder="Eg. BSIT" 
                                        {...register('course', {
                                            required: "course is required"
                                        })} />
                                        {errors.course && <p className="text-red-500 font-medium text-sm">{errors.course.message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Button type="submit" disabled={loading} className="w-full mt-6">
                            {loading ? <LoadingSpinner /> : 'Update User'}
                        </Button>  
                    </div>
                </CardContent>
            </Card>
        </form>
    )
}

export default UpdateUserForm