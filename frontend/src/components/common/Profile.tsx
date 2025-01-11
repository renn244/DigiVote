import { ComponentProps, forwardRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { cn } from "@/lib/utils"

type ProfileProps = {
    className?: string,
    src: string,
    username: string,
} & ComponentProps<typeof Avatar>

const Profile = forwardRef<
    React.ElementRef<typeof Avatar>,
    ProfileProps
>(({
    className,
    src,
    username,
    ...props
}: ProfileProps, ref) => {
    return (
        <Avatar {...props} ref={ref}  className={cn("h-10 w-10", className)}>
            <AvatarImage src={src} alt={username} />
            <AvatarFallback className="cursor-pointer">{username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
    )
})

export default Profile