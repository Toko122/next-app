"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import axios from "../app/axios";
import { useRouter } from 'next/navigation'
import { ButtonLoading } from "./ui/Loading";

export function RegisterForm() {

  const [form, setForm] = useState({ email: '', password: '', username: '', job: '' })
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  const [passwordMessage, setPasswordMessage] = useState('')
  const [emailMessage, setEmailMessage] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [jobMessage, setJobMessage] = useState('')
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setPasswordMessage('')
    setEmailMessage('')
    setUsernameMessage('')

    if (!form.email) {
      setEmailMessage('Enter a valid email');
      setTimeout(() => setEmailMessage(''), 2000);
      return;
    }

    if (!form.username || form.username.trim().length < 6) {
      setUsernameMessage('Username must be more than 6 characters')
      setTimeout(() => setUsernameMessage(''), 2000)
      return;
    }

    if (!form.password || form.password.trim().length < 6) {
      setPasswordMessage('Password must be more than 6 characters')
      setTimeout(() => setPasswordMessage(''), 2000)
      return;
    }

    if (form.job === '') {
      setJobMessage('Select your job')
      setTimeout(() => setJobMessage(''), 2000)
      return;
    }

    try {
      const res = await axios.post('/users/register', form)
      router.push('/auth/login')
    } catch (err) {
      console.log('error register user', err);
      setMessage(err.response?.data?.message || 'Server Error')
      setTimeout(() => setMessage(''), 2000)
    } finally {
      setLoading(false)
    }
  }

  return (


    <form onSubmit={handleSubmit} className="border border-black/40 shadow-lg rounded-lg flex flex-col gap-6 py-8 px-12 max-w-md mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-6">Register</h1>

      <div className="flex flex-col gap-6 md:items-start items-center">
        <div className="flex flex-col gap-2 w-fit">
          <Label htmlFor="email">Email</Label>
          <input
            placeholder="Enter your email"
            id="email"
            type="email"
            name="email"
            required
            onChange={handleChange}
            className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-[270px] md:w-[350px] transition
         focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {emailMessage && (
          <p className='w-full p-2 bg-[rgba(249,103,103,0.7)] text-white font-semibold rounded-md'>
            {emailMessage}
          </p>
        )}

        <div className="flex flex-col gap-2 w-fit">
          <Label htmlFor="username">Username</Label>
          <input
            placeholder="Username"
            id="username"
            type="text"
            name="username"
            required
            onChange={handleChange}
            className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-[270px] md:w-[350px] transition
         focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {usernameMessage && (
          <p className='w-full p-2 bg-[rgba(249,103,103,0.7)] text-white font-semibold rounded-md'>
            {usernameMessage}
          </p>
        )}

        <div className="flex flex-col gap-2 w-fit">
          <Label htmlFor="password">Password</Label>
          <input
            placeholder="Password"
            id="password"
            type="password"
            name="password"
            required
            onChange={handleChange}
            className="outline-none border border-gray-300 rounded-lg py-2 px-3 w-[270px] md:w-[350px] transition
         focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {passwordMessage && (
          <p className='w-full p-2 bg-[rgba(249,103,103,0.7)] text-white font-semibold rounded-md'>
            {passwordMessage}
          </p>
        )}


        {/* Uncomment if confirm password needed
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          required
          onChange={handleChange}
        />
      </div>
      */}

        <div className='flex flex-col gap-2 w-full'>
          <Label className='font-semibold'>Your Job:</Label>
          <select
            name="job"
            value={form.job}
            onChange={handleChange}
            className="border rounded-lg px-2 py-2 bg-white hover:bg-gray-100 cursor-pointer"
          >
            <option value="">Select your job</option>
            <option value="Software Engineer">Software Engineer</option>
            <option value="Product Manager">Product Manager</option>
            <option value="Designer">Designer</option>
            <option value="Data Scientist">Data Scientist</option>
            <option value="Marketing Specialist">Marketing Specialist</option>
            <option value="Sales Manager">Sales Manager</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Teacher">Teacher</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Lawyer">Lawyer</option>
            <option value="Student">Student</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {
          jobMessage &&
          <p className='w-full p-2 bg-[rgba(249,103,103,0.7)] text-white font-semibold rounded-md'>
            {jobMessage}
          </p>
        }

        <Button
          type="submit"
          className="w-full bg-[#eee] cursor-pointer py-5.5 text-1xl px-4 hover:bg-[#dddcdc] transition duration-200"
        >
          {loading ? <ButtonLoading /> : 'Register'}
        </Button>

        {message && (
          <p className='w-full p-2 bg-[rgba(249,103,103,0.7)] text-white font-semibold rounded-md'>
            {message}
          </p>
        )}

        <p className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 underline">
            Log in
          </Link>
        </p>
      </div>
    </form>

  );
}
