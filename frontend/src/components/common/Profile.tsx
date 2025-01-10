import { ComponentProps } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { cn } from "@/lib/utils"

type ProfileProps = {
    className?: string,
    src: string,
    username: string,
} & ComponentProps<typeof Avatar>

const Profile = ({
    className,
    src,
    username,
    ...props
}: ProfileProps) => {
    return (
        <Avatar {...props} className={cn("h-10 w-10", className)}>
            <AvatarImage src={src} alt={username} />
            <AvatarFallback className="cursor-pointer">{username[0].toUpperCase()}</AvatarFallback>
        </Avatar>
    )
}

export default Profile