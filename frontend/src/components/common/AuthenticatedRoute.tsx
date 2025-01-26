import { useAuthContext } from "@/context/AuthContext"
import { PropsWithChildren } from "react"
import { Navigate, useLocation } from "react-router"

const AuthenticatedRoute = ({
    children
}: PropsWithChildren) => {
    const location = useLocation();
    const { user } = useAuthContext();

    if(!user) {
        return <Navigate to={`/login?next=${location.pathname}`} />
    }

    return children
}

export default AuthenticatedRoute