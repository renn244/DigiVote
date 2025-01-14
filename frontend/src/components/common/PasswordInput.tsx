import { ComponentProps, forwardRef, useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "../ui/input"
import { cn } from "@/lib/utils"

type PasswordInputProps = {
    className?: string,
    containerClassName?: string,
    eyesClassName?: string,
} & ComponentProps<typeof Input>

const PasswordInput = forwardRef<
    React.ElementRef<typeof Input>,
    PasswordInputProps
>(({
    className,
    containerClassName,
    eyesClassName,
    ...props
}: PasswordInputProps, ref) => {
    const [showPassword, setShowPassword] = useState<boolean>(false)

    return (
        <div className={cn("relative", containerClassName)}>
            <Input ref={ref}
            {...props}
            type={showPassword ? "text" : "password"}
            className={cn("pr-9", className)} />
            {
                showPassword ?
                <Eye className={cn('absolute right-2 top-2 cursor-pointer', eyesClassName)} 
                onClick={() => setShowPassword(false)} /> 
                :
                <EyeOff className={cn('absolute right-2 top-2 cursor-pointer', eyesClassName)} 
                onClick={() => setShowPassword(true)} />
            }
        </div>
    )
})

export default PasswordInput