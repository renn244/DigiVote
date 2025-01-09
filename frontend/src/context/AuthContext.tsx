import axiosFetch from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { createContext, PropsWithChildren, useContext } from "react";

type AuthContextState = {
    user: any | undefined,
    loading: boolean
}

const initialState  = {
    user: undefined,
    loading: true
}

const AuthContext = createContext<AuthContextState>(initialState);

export const useAuthContext = () => {
    const context = useContext(AuthContext)
    return context
}

const AuthProvider = ({
    children
}: PropsWithChildren) => {
    
    const { data:user, isLoading } = useQuery({
        queryKey: ['user'],
        queryFn: async () => {
            if(!localStorage.getItem('access_token') && !localStorage.getItem('refresh_token')) return

            const response = await axiosFetch.get('/auth/check')

            if(response.status >= 400) {
                return
            }

            return response.data
        },
        refetchOnWindowFocus: false,
        retry: false
    })

    const value = {
        user: user,
        loading: isLoading
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider