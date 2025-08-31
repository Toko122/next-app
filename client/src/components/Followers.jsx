'use client'

import axios from './../app/axios'
import React, { useEffect, useRef, useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'
import { useRouter } from 'next/navigation'

const Followers = ({ onClose, userId }) => {

  const [followers, setFollowers] = useState([])
  const modalRef = useRef(null)

  const router = useRouter()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/follow/getFollowersAndFollowing/${userId}`)
        setFollowers(res.data.followers)
      } catch (err) {
        console.log('error getting followers', err);
      }
    }

    if (userId) {
      fetchUserData()
    }
  }, [userId])


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])


  return (
    <div className='fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50'>
      <div ref={modalRef} className='w-[450px] h-fit bg-white rounded-lg px-6 py-4 flex flex-col gap-8 pb-12'>

        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-bold'>Followers</h2>

          <span
            className='hover:text-red-500 transition duration-200 cursor-pointer text-[18px]'
            onClick={onClose}
          >
            <IoMdClose />
          </span>
        </div>

        <div className='flex flex-col gap-4 overflow-y-auto'>
          {
            followers.length > 0 ? (
              followers.map(follower => (
                <div onClick={() => router.push(`/user/${follower._id}`)} key={follower._id} className='flex gap-8 items-center px-4 cursor-pointer hover:bg-[#d9d9d9] transition duration-200 py-1 rounded-lg'>
                  {
                    follower.imageUrl ? <img src={follower.imageUrl} className='w-[70px] h-[70px] rounded-full object-cover' /> : <FaRegUserCircle className='text-[70px]' />
                  }
                  <h1 className='font-semibold text-[20px]'>{follower.username}</h1>
                </div>
              ))
            ) : (
              <span>No followers yet</span>
            )
          }

        </div>
      </div>
    </div>
  )
}

export default Followers
