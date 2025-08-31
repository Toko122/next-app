'use client'

import { useRouter } from 'next/navigation'
import axios from '../app/axios'
import React, { useEffect, useRef, useState } from 'react'
import { FaRegUserCircle } from 'react-icons/fa'
import { IoMdClose } from 'react-icons/io'

const Followings = ({ onClose, userId }) => {

  const modalRef = useRef()
  const [followings, setFollowings] = useState([])
  const router = useRouter()

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)

  }, [onClose])


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(`/follow/getFollowersAndFollowing/${userId}`)
        setFollowings(res.data.followings)
      } catch (err) {
        console.log('error getting followings', err);

      }
    }
    fetchUserData()
  }, [userId])

  return (
    <div className='fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50'>
      <div ref={modalRef} className='w-[450px] h-fit bg-white rounded-lg px-6 py-4 flex flex-col gap-8 pb-12'>

        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-bold'>Followings</h2>

          <span
            className='hover:text-red-500 transition duration-200 cursor-pointer text-[18px]'
            onClick={onClose}
          >
            <IoMdClose />
          </span>
        </div>


        <div className='flex flex-col gap-4'>
          {
            followings.length > 0 ? (
              followings.map(following => (
                <div onClick={() => router.push(`/user/${following._id}`)} key={following._id} className='flex gap-8 items-center cursor-pointer px-4 hover:bg-[#d9d9d9] transition duration-200 py-1 rounded-lg'>
                  {
                    following.imageUrl ? <img src={following.imageUrl} className='w-[70px] h-[70px] rounded-full object-cover' /> : <FaRegUserCircle className='text-[70px]' />
                  }
                  <h1 className='font-semibold text-[20px]'>{following.username}</h1>
                </div>
              ))
            ) : (
              <p>No following yet</p>
            )
          }
        </div>

      </div>
    </div>
  )
}

export default Followings
