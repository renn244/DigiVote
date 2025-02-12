import LoadingSpinner from "@/components/common/LoadingSpinner"
import PasswordInput from "@/components/common/PasswordInput"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import EMAIL_VALIDATION from "@/constant/email.regex"
import axiosFetch from "@/lib/axios"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"

type signUpStateType = {
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    confirmPassword: string,

    // student information
    education_level: 'senior_highschool' | 'tertiary',
    student_id: string,
    year_level: string,
    course: string,
}


const UserForm = () => {
    const [isLoading, setIsLoading] = useState(false)
    const { register, handleSubmit, setError, watch, setValue, formState: { errors } } = useForm<signUpStateType>({
        defaultValues: {
            education_level: 'tertiary'
        }
    })

    const onSubmit: SubmitHandler<signUpStateType> = async (data) => {
        setIsLoading(true)
        try {
            if(data.password !== data.confirmPassword) {
                setError('confirmPassword', {
                    type: 'manual',
                    message: 'password does not match'
                })
            }
    
            const response = await axiosFetch.post('/auth/register', data)
    
            if(response.status === 400) {
                setError(response.data.name,{
                    type: 'manual',
                    message: response.data.message
                })
                return
            }
    
            if(response.status >= 400) {
                toast.error(response.data.message)
                return
            }
    
            // send the email as search params
            window.location.assign(response.data.redirect_url)
        } catch (error: any) {
            toast.error(error.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between">
            <div className="flex flex-col lg:flex-row gap-3 lg:gap-7">
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="username">Username</Label>
                        <Input {...register('username', {
                            required: "username is required"
                        })} 
                        id="username" type="text" placeholder="renn44"/>
                        {errors.username && <p className="text-red-500 font-medium text-sm">{errors.username.message}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="first-name">First name</Label>
                            <Input {...register('firstName', {
                                required: "first name is required"
                            })}
                            id="first-name" placeholder="Max" />
                            {errors.firstName && <p className="text-red-500 font-medium text-sm">{errors.firstName.message}</p>}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="last-name">Last name</Label>
                            <Input {...register('lastName', {
                                required: "last name is required"
                            })}
                            id="last-name" placeholder="Robinson" />
                            {errors.lastName && <p className="text-red-500 font-medium text-sm">{errors.lastName.message}</p>}
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input {...register('email', {
                            required: 'email is required',
                            pattern: {
                                value: EMAIL_VALIDATION.USER,
                                message: 'invalid email',
                            }
                        })}
                        id="email"
                        type="email"
                        placeholder="m@example.com"
                        />
                        {errors.email && <p className="text-red-500 font-medium text-sm">{errors.email.message}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <PasswordInput {...register('password', {
                            required: 'password is required',
                        })} id="password" />
                        {errors.password && <p className="text-red-500 font-medium text-sm">{errors.password.message}</p>}
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <PasswordInput {...register('confirmPassword', {
                            required: 'confirm password is required'
                        })} id="confirmPassword" type="password" />
                        {errors.confirmPassword && <p className="text-red-500 font-medium text-sm">{errors.confirmPassword.message}</p>}
                    </div>
                </div>
                <div className="grid gap-4 w-[400px] h-[300px] lg:h-[200px]">
                    <div className="grid gap-2">
                        <Label htmlFor="education_level">Education Level</Label>
                        <Select value={watch('education_level')} onValueChange={(value) => setValue('education_level', value as signUpStateType['education_level'])} >
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
            <Button type="submit" disabled={isLoading} className="w-full mt-3">
                {isLoading ? <LoadingSpinner /> : "Create Account"}
            </Button>  
        </form>
    )
}

export default UserForm