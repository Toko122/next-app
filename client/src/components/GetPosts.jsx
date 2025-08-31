'use client'

import { useParams } from 'next/navigation'
import axios from '../app/axios'
import React, { useEffect, useState } from 'react'
import { AiFillLike } from "react-icons/ai";
import { FaShare } from "react-icons/fa";
import { FaCommentDots } from "react-icons/fa";
import Comment from './Comment';

const GetPosts = ({ userId }) => {
    const { id } = useParams()
    const targetId = userId || id
    const [posts, setPosts] = useState([])
    const [currentUserId, setCurrentUserId] = useState(null)
    const [profileImage, setProfileImage] = useState(null)
    const [username, setUsername] = useState('')

    const [openComments, setOpenComments] = useState(false)

    const [commentsForPost, setCommentsForPost] = useState({})

    useEffect(() => {
        setCurrentUserId(localStorage.getItem("userId"))
    }, [])

    const handleOpeComments = (postId) => {
        setOpenComments(openComments === postId ? null : postId)
    }

    useEffect(() => {
        const getPosts = async () => {
            try {
                const res = await axios.get(`/post/getPosts/${targetId}`)
                setPosts(res.data.posts)
            } catch (err) {
                console.log(err)
            }
        }
        getPosts()
    }, [targetId])

    const handleDeletePost = async (postId) => {
        try {
            const token = localStorage.getItem("token")
            const res = await axios.delete(`/post/deletePost/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setPosts((prev) => prev.filter((p) => p._id !== postId))
            window.location.reload()
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const getUserData = async () => {
            try {
                const res = await axios.get(`/users/${id}`)
                setUsername(res.data.username)
                setProfileImage(res.data.imageUrl)

            } catch (err) {
                console.log(err);

            }
        }
        getUserData()
    }, [])

    return (

        <div className='w-full h-full overflow-y-auto flex flex-col gap-14 rounded-md sm:px-2 p-2 justify-center items-center'>
            {
                posts.map((post) => (
                    <div key={post._id} className='p-4 rounded-lg bg-white flex flex-col gap-2 h-full max-w-[600px] sm:max-w-[700px] md:max-w-[800px] w-full'>

                        <div className='flex justify-between w-full'>
                            <div className='flex gap-4 items-center'>

                                {
                                    profileImage && <img src={profileImage} className='sm:w-[50px] sm:h-[50px] w-[40px] h-[40px] rounded-full object-cover' />
                                }
                                <div className='flex flex-col'>
                                    {username && <span className='font-semibold'>{username}</span>}
                                    {post.createdAt && <span className='text-gray-500 text-[14px]'>{new Date(post.createdAt).toLocaleTimeString()}</span>}
                                </div>
                            </div>
                            {
                                String(post.userId) === String(currentUserId) && <div onClick={() => handleDeletePost(post._id)} className='text-red-500 h-fit hover:underline cursor-pointer'>Delete</div>
                            }
                        </div>

                        <div className='w-full mt-2 break-words'>
                            {post.title && <span className='px-6 block'>{post.title}</span>}
                        </div>

                        {
                            post._id &&

                            <img src={post.imageUrl} className='w-full max-h-[500px] object-cover rounded' />

                        }

                        <span className='h-[1px] w-full bg-gray-200 mt-4'></span>

                        <div className='flex justify-between w-full items-center mt-2'>

                            <div className='flex gap-2 sm:gap-4 items-center cursor-pointer hover:bg-[#e2e2e2] transition duration-300 px-5 py-2 rounded-lg'>
                                <AiFillLike className='sm:text-2xl text-[20px]' />
                                <h1 className='sm:text-[20px] text-[16px]'>Like</h1>
                            </div>

                            <div onClick={() => handleOpeComments(post._id)} className='flex gap-2 sm:gap-4 items-center cursor-pointer hover:bg-[#e2e2e2] transition duration-300 px-5 py-2 rounded-lg'>
                                <FaCommentDots className='sm:text-2xl text-[20px]' />
                                <h1 className='sm:text-[20px] text-[16px]'>Comment</h1>
                            </div>

                            <div className='flex gap-2 sm:gap-4 items-center cursor-pointer hover:bg-[#e2e2e2] transition duration-300 px-5 py-2 rounded-lg'>
                                <FaShare className='sm:text-2xl text-[20px]' />
                                <h1 className='sm:text-[20px] text-[16px]'>Share</h1>
                            </div>

                        </div>

                        {
                            openComments === post._id &&
                            <div className='w-full flex flex-col gap-8 items-center justify-center mt-8'>
                                <span className='w-full bg-gray-300 h-[1px]'></span>
                                {openComments && <Comment postId={post._id} />}
                            </div>
                        }

                    </div>
                ))
            }
        </div>
    )
}

export default GetPosts
