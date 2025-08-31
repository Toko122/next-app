"use client";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link";
import { useState } from "react";
import axios from "../app/axios";
import { useAuth } from "../app/AuthProvider";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { ButtonLoading } from "./ui/Loading";

export function LoginForm({
  className,
  ...props
}) {

  const { login } = useAuth()
  const [form, setForm] = useState({ password: '', username: '' })
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [message, setMessage] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setUsernameMessage('')
    setMessage('')

    if (form.username.trim() === '') {
      setUsernameMessage('Invalid username')
      setTimeout(() => setUsernameMessage(''), 3000)
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/users/login', form)

      localStorage.setItem('token', res.data.token)
      localStorage.setItem('username', res.data.username)
      localStorage.setItem('userId', res.data.user)
      login(res.data.token, res.data.user)

      router.push('/')
    } catch (err) {
      console.log('error login user', err);

      if (err.response.status === 400) {
        setUsernameMessage("Invalid username or password")
        setTimeout(() => setUsernameMessage(''), 3000)
        return
      }
      setMessage(err.response.message || 'Server error')
      setTimeout(() => setMessage(''), 3000)

    } finally {
      setLoading(false)
    }
  }


  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post('/users/google-auth', {
        token: credentialResponse.credential
      })
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('username', res.data.user.username)
      localStorage.setItem('userId', res.data.user._id)
      login(res.data.token, res.data.user._id)
      router.push('/')
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6 shadow-lg", className)} {...props}>
      <Card onKeyDown={(e) => e.key === 'Enter' && handleSubmit()} className={'border-[rgb(0,0,0,0.2)]'}>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="Username">Email</Label>
                <Input onChange={handleChange} name='username' id="username" type="text" placeholder="Username" required />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input onChange={handleChange} name='password' id="password" type="password" required />
              </div>

              {
                usernameMessage &&
                <p className='w-full p-2 bg-[rgba(249,103,103,0.7)] text-white font-semibold rounded-md'>
                  {usernameMessage}
                </p>
              }

              <Link href={'/auth/forgotPassword'} className="w-full text-left text-indigo-600 hover:underline">Forgot Password?</Link>

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full bg-[#1e1e1e] cursor-pointer text-white hover:bg-[#141414] transition duration-200">
                  {loading ? <ButtonLoading /> : "Login"}
                </Button>

                {
                  message &&
                  <p className='w-full p-2 bg-[rgba(249,103,103,0.7)] text-white font-semibold rounded-md'>
                    {message}
                  </p>
                }

                <GoogleLogin onSuccess={handleGoogleSuccess} type="button" variant="outline" className="w-full cursor-pointer hover:bg-[#eaeaea] transition duration-200">
                  Login with Google
                </GoogleLogin>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
