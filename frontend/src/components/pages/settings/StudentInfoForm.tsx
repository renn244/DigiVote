import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export type StudentInfoState = {
    education_level: string,
    course: string,
    year_level: string,
}

type StudentInfoFormProps = {
    onsubmit: SubmitHandler<StudentInfoState>,
    initialData: StudentInfoState
}

const StudentInfoForm = ({
    onsubmit,
    initialData
}: StudentInfoFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<StudentInfoState>({
        defaultValues: initialData
    });

    const onSubmit = async (data: StudentInfoState) => {
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
                    <Label htmlFor="EducationLevel">Education Level</Label>
                    <div>
                        <Select value={watch('education_level')} 
                        onValueChange={(value) => setValue('education_level', value as StudentInfoState['education_level'])} >
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
                        {errors.education_level && <span className="text-red-500">{errors.education_level.message}</span>}
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="School">Course/Strand</Label>
                    <div>
                        <Input type="text" {...register('course', {
                            required: 'Course/Strand is required',
                        })} />
                        {errors.course && <span className="text-red-500">{errors.course.message}</span>}
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="YearLevel">Year Level</Label>
                    <div>
                        <Input type="text" {...register('year_level', {
                            required: 'Year Level is required',
                        })} />
                        {errors.year_level && <span className="text-red-500">{errors.year_level.message}</span>}
                    </div>
                </div>
                <Button type="submit">
                    {isLoading ? <LoadingSpinner /> : "Save Changes"}
                </Button>
            </div>
        </form>
    )
}

export default StudentInfoForm