'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { IoMdSettings } from "react-icons/io";
import { FiMenu, FiX } from 'react-icons/fi'

const AdminSidebar = () => {

    const [openMenu, setOpenMenu] = useState(false)

    return (
        <div className='md:min-h-screen py-4 md:w-[350px] h-[90px] w-full md:rounded-t-2xl bg-gray-400 px-8 flex items-center'>

            <div className='flex-col justify-between h-full pb-14 md:flex hidden'>
                <div className='flex md:flex-col flex-row gap-4 md:items-start items-center md:justify-start justify-between'>

                    <h1 className='font-semibold text-2xl text-white'>Admin Dashboard</h1>

                    <div className='px-2 flex flex-col gap-2 text-[18px] font-semibold w-fit'>
                        <Link href='/admin/users' className='hover:underline'>All Users</Link>
                        <Link href='/admin/posts' className='hover:underline'>All Posts</Link>
                    </div>

                </div>

                <div className='px-4 flex gap-4 items-center cursor-pointer w-fit'>
                    <IoMdSettings />
                    <span className='font-semibold text-[20px]'>Settings</span>
                </div>

            </div>


            <div className='justify-between md:hidden flex items-center w-full'>
                <h1 className='font-semibold text-2xl text-white md:hidden flex'>Admin Dashboard</h1>

                <button
                    className="md:hidden text-2xl flex"
                    onClick={() => setOpenMenu(!openMenu)}
                >
                    {openMenu ? <FiX /> : <FiMenu />}
                </button>

                {
                    openMenu && (
                        <div className='absolute right-0 top-0 min-h-screen pb-14 pt-8 px-10 bg-gray-400 z-50 flex flex-col gap-4'>
                            <button onClick={() => setOpenMenu(false)} className='w-full flex items-center justify-end'>
                                <FiX className='text-[24px] cursor-pointer hover:text-red transition duration-300' />
                            </button>

                            <div className='flex flex-col gap-4'>
                                <Link href='/admin/users' className='hover:underline'>All Users</Link>
                                <Link href='/admin/posts' className='hover:underline'>All Posts</Link>
                            </div>
                        </div>
                    )
                }

            </div>


        </div>
    )
}

export default AdminSidebar
