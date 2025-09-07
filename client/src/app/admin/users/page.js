'use client'

import React from 'react'
import AdminSidebar from '../AdminSidebar'
import AdminHomePage from '../AdminHomePage'

const AdminPage = () => {
  return (
    <div className='flex gap-4 bg-gray-50 md:flex-row flex-col'>
       <AdminSidebar/>
       <AdminHomePage />
    </div>
  )
}

export default AdminPage
