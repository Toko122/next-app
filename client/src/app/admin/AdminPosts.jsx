import React from 'react'
import {PostsChart} from './PostsChart'

const AdminPosts = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen w-full flex flex-col justify-center">
            <div className="bg-white p-4 rounded-lg shadow-md">
                <PostsChart />
            </div>
        </div>
  )
}

export default AdminPosts
