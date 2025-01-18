import { useAuthContext } from "@/context/AuthContext"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "../ui/sheet"
import Profile from "./Profile"
import { LogOut, Settings2, History } from "lucide-react"
import { Link } from "react-router"

const ProfileSheet = () => {
    const { user } = useAuthContext()

    const Logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.reload() // reloading the page
    }

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Profile src={user.profile} username={user.username} />
            </SheetTrigger>
            <SheetContent className="w-[400px]">
                <SheetHeader className="flex-row items-center gap-4 space-y-0">
                    <Profile src={user.profile} username={user.username} />
                    <div className="flex flex-col justify-center">
                        <SheetTitle>
                            {user.username}
                        </SheetTitle>
                        <SheetDescription>
                            {user.email}
                        </SheetDescription>
                    </div>
                </SheetHeader>
                <nav className="flex flex-col gap-3 px-4 mt-9 font-semibold text-lg">
                    <div className="flex justify-start gap-3">
                        <History />
                        <Link to={'/history'}>
                            Vote history
                        </Link>
                    </div>
                    <div className="flex justify-start gap-3">
                        <Settings2 />
                        <Link to={'/settings'}>
                            Settings
                        </Link>
                    </div>
                    <div className="flex justify-start gap-3">
                        <LogOut />
                        <button onClick={() => Logout()}>
                            Logout
                        </button>
                    </div>
                </nav>
            </SheetContent>
        </Sheet>
    )
}

export default ProfileSheet