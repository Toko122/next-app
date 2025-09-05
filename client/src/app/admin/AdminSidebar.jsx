'use client'

import Link from 'next/link'
import React from 'react'
import { IoMdSettings } from "react-icons/io";

const AdminSidebar = () => {
    return (
        <div className='min-h-screen py-4 w-[350px] rounded-t-2xl bg-gray-400 px-8'>

            <div className='flex flex-col justify-between h-full pb-14'>
                <div className='flex flex-col gap-4'>

                    <h1 className='font-semibold text-2xl text-white'>Admin Dashboard</h1>

                    <div className='px-2 flex flex-col gap-2 text-[18px] font-semibold w-fit'>
                        <Link href='/admin/users' className='hover:underline'>All Users</Link>
                        <Link href='/admin/posts' className='hover:underline'>All Posts</Link>
                    </div>

                </div>

                <div className='px-4 flex gap-4 items-center cursor-pointer w-fit'>
                     <IoMdSettings/>
                     <span className='font-semibold text-[20px]'>Settings</span>
                </div>

            </div>
        </div>
    )
}

export default AdminSidebar
