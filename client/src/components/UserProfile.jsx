'use client'

import React, { use, useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import axios from '../app/axios'
import { FaRegUserCircle } from 'react-icons/fa'
import EditProfile from './EditProfile'
import Followers from './Followers'
import Followings from './Followings'
import Link from 'next/link'
import AddPost from './AddPost'
import { ButtonLoading } from './ui/Loading'
import GetPosts from './GetPosts'

const UserProfile = () => {
  const params = useParams()
  const targetUserId = params.id
  const [targetUser, setTargetUser] = useState(null)

  const [token, setToken] = useState(null)

  const [followers, setFollowers] = useState([])
  const [followings, setFollowings] = useState([])
  const [posts, setPosts] = useState([])

  const [isFollowing, setIsFollowing] = useState(false)

  const [openFollowers, setOpenFollowers] = useState(false)
  const [openFollowings, setOpenFollowings] = useState(false)


  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showAddPost, setShowAddPost] = useState(false)

  const [profileImage, setProfileImage] = useState(null);

  const [loading, setLoading] = useState(false)


  const [currentUserId, setCurrentUserId] = useState(null)


  useEffect(() => {
    setCurrentUserId(localStorage.getItem('userId'))
    setToken(localStorage.getItem('token'))
  }, [])

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const res = await axios.get(`/images/getImage/${targetUserId}`)
        setProfileImage(res.data.imageUrl)

      } catch (err) {
        console.log(err);

      }
    }
    fetchProfileImage()
  }, [targetUserId])

  const fetchUserData = async () => {
    try {
      const res = await axios.get(`/users/${targetUserId}`)
      setTargetUser(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  const fetchFollowersAndFollowing = async () => {
    if (!targetUserId) return
    try {
      const res = await axios.get(`/follow/getFollowersAndFollowing/${targetUserId}`)
      setFollowers(res.data.followers || [])
      setFollowings(res.data.followings || [])

      const alreadyFollowing = res.data.followers.some(
        (f) => String(f._id) === String(currentUserId)
      )

      setIsFollowing(alreadyFollowing)

    } catch (err) {
      console.log('Error fetching followers:', err)
    }
  }

  const fetchPosts = async () => {
    try {
      const res = await axios.get(`/post/getPosts/${targetUserId}`)
      setPosts(res.data.posts)
    } catch (err) {
      console.log(err);

    }
  }


  useEffect(() => {
    if (targetUserId && currentUserId) {
      fetchUserData()
      fetchFollowersAndFollowing()
      fetchPosts()
    }
  }, [targetUserId, currentUserId])

  const handleFollow = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      if (!isFollowing) {

        await axios.post(`/follow/postFollow/${targetUserId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {

        await axios.put(`/follow/unfollow/${targetUserId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false)
    }
    fetchFollowersAndFollowing()
  }


  return (

    <>

      <div className='w-full min-h-screen flex flex-col items-center pt-22 px-4 bg-[#F4F2EE] pb-8 overflow-x-hidden'>
        <div className='flex flex-col gap-8 items-center'>
          <div className='flex flex-col justify-between sm:flex-row items-center gap-6 sm:gap-12 p-6 sm:p-10 w-full max-w-4xl'>
            {
              profileImage ? (
                <img src={profileImage} alt="profile" className="w-[100px] h-[100px] rounded-full object-cover" />
              ) : (
                <FaRegUserCircle className='text-[100px]' />
              )
            }
            <div className='flex flex-col items-center sm:items-start gap-3'>
              <h1 className='text-2xl sm:text-3xl font-semibold select-none'>{targetUser ? targetUser.username : <ButtonLoading />}</h1>
              <div className='flex gap-6 sm:gap-12 text-center'>
                <div className='flex flex-col text-lg sm:text-xl cursor-pointer'>
                  <span>{posts.length}</span><span>Posts</span>
                </div>
                <div onClick={() => setOpenFollowers(true)} className='flex flex-col text-lg sm:text-xl cursor-pointer'>
                  <span>{followers.length}</span><span>Followers</span>
                </div>
                <div onClick={() => setOpenFollowings(true)} className='flex flex-col text-lg sm:text-xl cursor-pointer'>
                  <span>{followings.length}</span><span>Following</span>
                </div>
              </div>
            </div>

            {
              currentUserId && (
                currentUserId === targetUserId ? (
                  <div className='flex flex-col gap-2'>
                    <button
                      className='py-2 px-4 bg-[#1d1d1d] hover:bg-[#111111] transition duration-200  rounded-lg text-white cursor-pointer'
                      onClick={() => setShowEditProfile(true)}>
                      Profile Settings
                    </button>

                    <button onClick={() => setShowAddPost(true)} className='bg-blue-400 py-2 px-4 cursor-pointer text-white hover:bg-blue-500 transition duration-200 rounded-lg'>
                      Add Post
                    </button>

                  </div>
                ) : (
                  token ? (
                    <button
                      className={`px-4 py-2 rounded-lg text-white cursor-pointer ${isFollowing ? "bg-red-500" : "bg-blue-500"
                        } ${loading ? <ButtonLoading /> : ""}`}
                      onClick={handleFollow}
                      disabled={loading}
                    >
                      {loading ? <ButtonLoading /> : isFollowing ? "Unfollow" : "Follow"}
                    </button>
                  ) : (
                    <Link
                      href="/auth/login"
                      className="px-4 py-2 rounded-lg text-white bg-blue-500 hover:bg-blue-600 cursor-pointer"
                    >
                      Follow
                    </Link>
                  )
                )
              )
            }

          </div>

          <div className='flex justify-center items-center'>
            <div className='font-semibold text-[18px]'><span className='text-[16px] font-normal'>{targetUser ? targetUser.bio : 'Loading...'}</span></div>
          </div>


          {
            posts.length > 0 && (
              <GetPosts />
            )
          }


        </div>

      </div>



      {
        showEditProfile && <EditProfile onClose={() => setShowEditProfile(false)} setTargetUser={setTargetUser} />
      }

      {
        openFollowers && <Followers onClose={() => setOpenFollowers(false)} userId={targetUserId} />
      }

      {
        openFollowings && <Followings onClose={() => setOpenFollowings(false)} userId={targetUserId} />
      }

      {
        showAddPost && <AddPost onClose={() => setShowAddPost(false)} />
      }

    </>
  )
}

export default UserProfile
