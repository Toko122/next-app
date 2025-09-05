'use client'

import React from 'react'
import AdminSidebar from '../AdminSidebar'
import AdminPosts from '../AdminPosts'

const AdminPostsChart = () => {
  return (
    <div className='flex gap-4 bg-gray-50'>
        <AdminSidebar />
        <AdminPosts />
    </div>
  )
}

export default AdminPostsChart
