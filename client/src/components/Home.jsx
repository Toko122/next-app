'use client'

import Link from 'next/link';
import axios from '../app/axios'
import React, { useEffect, useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { FiArrowRight } from "react-icons/fi";
import { ButtonLoading } from './ui/Loading';


const Home = () => {

    const [users, setUsers] = useState([])
    const [visibleCount, setVisibleCount] = useState(5);

    const [loggedUser, setLoggedUser] = useState(null)

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoggedUser(localStorage.getItem('token'))
    }, [])

    const visibleUsers = users.slice(0, visibleCount)


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`/users/allUsers`)
                setUsers(res.data)
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false)
            }
        }
        fetchUser()
    }, [])


    return (
        <div className='w-full min-h-screen pb-12 flex justify-center pt-28 bg-[#F4F2EE] md:px-8 px-4'>
            <div className='flex flex-col gap-4 w-full items-center'>

                {
                    loading ? (
                        <span className='animation-spin'>Loading...</span>
                       ) :
                        (
                            
                                visibleUsers.map((user) => (
                                    <Link href={loggedUser ? `/user/${user._id}` : '/auth/login'} className='flex justify-between items-center cursor-pointer hover:bg-[#e7e7e7] transition duration-200 bg-white py-3 px-4 rounded-lg w-full max-w-3xl pr-6'>
                                        <div className='flex gap-4 items-center'>
                                            {
                                                user.imageUrl ? (
                                                    <img src={user.imageUrl} className='w-[60px] h-[60px] rounded-full object-cover' />
                                                ) : (
                                                    <FaRegUserCircle className='w-[60px] h-[60px] rounded-full ' />
                                                )
                                            }

                                            <div className='flex flex-col gap-2'>
                                                <h1 className='font-semibold text-[18px]'>{user.username}</h1>
                                                <p className='text-black'>{user.job}</p>
                                            </div>

                                        </div>
                                        <div className=''>
                                            <FiArrowRight className='text-2xl' />
                                        </div>
                                    </Link>
                                ))
                            
                        )
                }

                {
                    visibleCount < users.length && (
                        <button
                            className="py-2 px-4 cursor-pointer hover:bg-blue-600 transition duration-200 bg-blue-500 text-white rounded-lg"
                            onClick={() => setVisibleCount((prev) => prev + 5)}
                        >
                            Show More
                        </button>
                    )
                }

            </div>
        </div>
    )
}

export default Home
