import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://next-app-796d.onrender.com/api',
    withCredentials: true
})

instance.interceptors.request.use((config) => {
   
       const token = localStorage.getItem('token')
       if(token) config.headers.Authorization = `Bearer ${token}` 
       return config
     
})

export default instance;