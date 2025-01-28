import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react"
import ChangePasswordAdmin from "./ChangePasswordAdmin";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";

type UserOptionsProps = {
    userId: number,
    name: string,
    searchParams: {
        search: string,
        page: number
    }
}

const UserOptions = ({
    userId,
    name,
    searchParams
}: UserOptionsProps) => {
    const [open, setOpen] = useState(false);

    const callbackUrl = '/admin/users';


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="max-w-[200px]" align="end">
                <ChangePasswordAdmin userId={userId} name={name} />
                <Link to={`/admin/user/updateUserInfo/${userId}?goback=${callbackUrl}&search=${searchParams.search}&page=${searchParams.page}`}>
                    <Button variant="ghost" className="w-full">
                        Edit User Info
                    </Button>
                </Link>
            </PopoverContent>
        </Popover>
    )
}

export default UserOptions