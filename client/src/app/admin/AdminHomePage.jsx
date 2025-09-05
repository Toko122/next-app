'use client'

import React from 'react'
import { UsersChart } from './UsersChart'

const AdminHomePage = () => {
    return (
        <div className="p-6 bg-gray-50 min-h-screen w-full flex flex-col justify-center">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <UsersChart />
            </div>
        </div>
    )
}

export default AdminHomePage
