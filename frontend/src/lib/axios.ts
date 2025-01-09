import axios from 'axios'

const axiosFetch = axios.create({
    baseURL: 'http://localhost:5000/api',
    validateStatus: () => true
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

export default axiosFetch