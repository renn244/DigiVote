import { useAuthContext } from "@/context/AuthContext"
import { BarChart3, HelpCircle, Info, LogIn, Menu, UserCircle, Vote, X, UserRoundCog } from "lucide-react"
import { ComponentProps, PropsWithChildren, useState } from "react"
import { Link, NavLink as ReactNavLink } from "react-router"
import { Button } from "../ui/button"
import ProfileSheet from "./ProfileSheet"

const Navbar = () => {
    const { user } = useAuthContext()
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
    
    return (
        <nav className="bg-yellow-400 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0">
                            <span className="text-blue-900 text-2xl font-bold">STI voting</span>
                        </Link>
                    </div>
                    {user && <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-4">
                            <NavLink href="/elections" icon={<Vote className="h-5 w-5 mr-1" />}>Elections</NavLink>
                            <NavLink href="/results" icon={<BarChart3 className="h-5 w-5 mr-1" />}>Results</NavLink>
                            <NavLink href="/about" icon={<Info className="h-5 w-5 mr-1" />}>About</NavLink>
                        </div>
                    </div>}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6">
                            <NavLink href="/help" icon={<HelpCircle className="h-5 w-5 mr-1" />} >Help</NavLink>
                            {user?.role === 'admin' && (
                                <NavLink href="/admin" icon={<UserRoundCog className="h-5 w-5 mr-1" />}>Admin</NavLink>
                            )}
                            {!user ? (
                                <>
                                    <NavLink href="/about" icon={<Info className="h-5 w-5 mr-1" />}>About</NavLink>
                                    <Link to={'/login'}>
                                        <Button variant={'outline'} className="ml-2">
                                            <LogIn className="h-5 w-5 mr-1" />
                                            Login
                                        </Button>
                                    </Link>
                                </> 
                            ) : (
                                <ProfileSheet />
                            )}
                        </div>
                    </div>
                    <div className="md:hidden">
                        <Button
                        variant={'ghost'}
                        size="icon"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-expanded={isMenuOpen}
                        >
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? (
                                <X className="h-6 w-6" aria-hidden="true" />
                            ): (
                                <Menu className="h-6 w-6" aria-hidden="true" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
              
            {isMenuOpen && (
                <div className="md:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <MobileNavLink href="/elections" icon={<Vote className="h-5 w-5 mr-2" />}>Elections</MobileNavLink>
                        <MobileNavLink href="/results" icon={<BarChart3 className="h-5 w-5 mr-2" />}>Results</MobileNavLink>
                        <MobileNavLink href="/about" icon={<Info className="h-5 w-5 mr-2" />}>About</MobileNavLink>
                        <MobileNavLink href="/help" icon={<HelpCircle className="h-5 w-5 mr-2" />}>Help</MobileNavLink>
                        <MobileNavLink href="/profile" icon={<UserCircle className="h-5 w-5 mr-2" />}>Profile</MobileNavLink>
                        <MobileNavLink href="/login" icon={<LogIn className="h-5 w-5 mr-2" />}>Login</MobileNavLink>
                    </div>
                </div>
            )}
        </nav>
    )
}

type NavLinkProps = {
    href: string,
    icon: React.ReactNode,
    className?: string,
} & PropsWithChildren & Partial<ComponentProps<typeof Link>>

const NavLink = ({
    href,
    className,
    icon,
    children,
    ...props
}: NavLinkProps) =>  (
    <ReactNavLink
    {...props}
    to={href} 
    className={({ isActive }) => `
        text-blue-900 hover:bg-yellow-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium flex items-center transition duration-150 ease-in-out
        ${isActive ? "text-white bg-yellow-500" : ""}
    ` + className}>
        {icon}
        {children}
    </ReactNavLink>
)


type MobileNavLinkProps = {
    href: string,
    icon: React.ReactNode,
    className?: string,
} & PropsWithChildren & Partial<ComponentProps<typeof Link>>

const MobileNavLink = ({
    href,
    icon,
    className,
    children,
    ...props
}: MobileNavLinkProps) => (
    <Link
    {...props}
    to={href}
    className="text-blue-900 hover:bg-yellow-500 hover:text-white px-3 py-2 rounded-md text-base font-medium flex items-center transition duration-150 ease-in-out"
    >
      {icon}
      {children}
    </Link>
)

export default Navbar