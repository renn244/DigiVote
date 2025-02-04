import axios from 'axios';

const isProduction = import.meta.env.VITE_SOFTWARE_ENV === 'production'

const axiosFetch = axios.create({
    baseURL: isProduction ? '/api' : import.meta.env.VITE_BACKEND_URL,
    validateStatus: (status) => {
        if(status === 401) {
            return false
        }
        return true
    }
})

axiosFetch.interceptors.request.use((config) => {
    const access_token = localStorage.getItem('access_token');

    if(access_token) {
        config.headers.Authorization = `Bearer ${access_token}`;
    }
    config.headers.RefreshToken = localStorage.getItem('refrest_token');

    return config
}, (error) => {
    return Promise.reject(error)
})

// setup the interceptor later
axiosFetch.interceptors.response.use(async (response) => {
    return response
}, async (error) => {
    const originalRequest = error.config

    if(error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        
        const newTokens = await axiosFetch.post('/auth/refreshToken', {
            refreshToken: localStorage.getItem('refresh_token')
        })

        if(newTokens.status >= 400) {
            return Promise.reject(error)
        }

        localStorage.setItem('access_token', newTokens.data.access_token);
        localStorage.setItem('refresh_token', newTokens.data.refresh_token)

        axiosFetch.defaults.headers.common['Authorization'] = `Bearer ${newTokens.data.access_token}`

        return axiosFetch(originalRequest)
    }

    return Promise.reject(error)
})

export default axiosFetch