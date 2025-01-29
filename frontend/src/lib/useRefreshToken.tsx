import { useAuthContext } from "@/context/AuthContext";
import axiosFetch from "./axios";

const useRefreshToken = () => {
    const { refetch } = useAuthContext()

    const refreshToken = async () => {
        const newTokens = await axiosFetch.post('/auth/refreshToken', {
            refreshToken: localStorage.getItem('refresh_token')
        })

        if(newTokens.status >= 400) {
            // if error then just wait for the update of the jwt
            return 
        }

        localStorage.setItem('access_token', newTokens.data.access_token);
        localStorage.setItem('refresh_token', newTokens.data.refresh_token)

        refetch && refetch() // refetch the checkUser
    }

    return { refreshToken }
}

export default useRefreshToken