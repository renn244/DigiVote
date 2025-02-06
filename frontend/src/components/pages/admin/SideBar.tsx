import { LayoutDashboard, Users, ChartNoAxesColumn, Flag } from "lucide-react"
import { NavLink } from "react-router"

const sidebarItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
    { icon: Users, label: 'Users', href: '/admin/users' },
    { icon: ChartNoAxesColumn, label: 'Polls', href: '/admin/polls' },
    { icon: Flag, label: 'Parties', href: '/admin/parties' },
]

const SideBar = () => {
    return (
        <div className="min-h-[771px] flex flex-col h-auto bg-blue-900 text-yellow-400 w-64 py-8 px-4">
            <nav className="flex-1">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-center">DigiVote Admin</h1>
                </div>
                <ul className="space-y-2">
                {sidebarItems.map((item) => (
                    <li key={item.label}>
                    <NavLink
                    to={item.href}
                    className={({ isActive }) => `flex items-center space-x-3 p-3 rounded-lg hover:bg-blue-800 transition-colors ${isActive ? "bg-blue-800" : ""}`}
                    >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                    </NavLink>
                    </li>
                ))}
                </ul>
            </nav>
        </div>
    )
}

export default SideBar