import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://next-app-ocg8.vercel.app'
})

instance.interceptors.request.use((config) => {
   
       const token = localStorage.getItem('token')
       if(token) config.headers.Authorization = `Bearer ${token}` 
       return config
     
})

export default instance;