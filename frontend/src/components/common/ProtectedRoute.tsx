import { useAuthContext } from "@/context/AuthContext"
import Forbidden from "@/Pages/Forbidden"
import { PropsWithChildren } from "react"
import { Navigate } from "react-router"

type ProtectedRouteProps = {
    roles: string[],
    redirectTo?: string
} & PropsWithChildren

const ProtectedRoute = ({
    roles,
    redirectTo,
    children
}: ProtectedRouteProps) => {
    const { user } = useAuthContext() 
    
    // since it's protected we make sure that if he is unauthorized we will not allow him
    if(!user) return <Navigate to={'/login'} /> 

    if(!roles.includes(user.role)) {
        if(redirectTo) {
            return <Navigate to={redirectTo} />
        } else {
            return <Forbidden />
        }
    }

    return children
}

export default ProtectedRoute