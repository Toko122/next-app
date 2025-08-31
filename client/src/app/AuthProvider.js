'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import {jwtDecode} from 'jwt-decode'

const authContext = createContext()

const AuthProvider = ({children}) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userId, setUserId] = useState(null)

    useEffect(() => {
       const token = localStorage.getItem('token')
       const id = localStorage.getItem('userId')
       if(token){
        setIsLoggedIn(true)
        setUserId(id)
        autoLogout(token)
       }else {
        setIsLoggedIn(false)
       }
    }, [])

    const login = (token, id) => {
        localStorage.setItem('token', token)
        localStorage.setItem('userId', id)
        autoLogout(token)
        setUserId(id)
        setIsLoggedIn(true)   
    }

    const logout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('userId')
        localStorage.removeItem('username')
        setIsLoggedIn(false)
        setUserId(null)
    }

    const autoLogout = (token) => {
      try {
         const decode = jwtDecode(token)
         if(!decode.exp) return;

         const expirationTime = decode.exp * 1000 - Date.now()

         if(expirationTime <= 0){
           logout()
         }else{
           setTimeout(() => {
                logout()
            }, expirationTime)
         }

      } catch (err) {
        console.error('Invalid token:', err)
        logout()
      }
    }
    
  return (
    <authContext.Provider value={{login, logout, isLoggedIn, autoLogout, userId}}>
           {children}
    </authContext.Provider>
  )
}

export default AuthProvider

export const useAuth = () => useContext(authContext)
