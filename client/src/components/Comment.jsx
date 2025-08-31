'use client'

import React, { useEffect, useState } from 'react';
import { IoSend } from "react-icons/io5";
import axios from '../app/axios';
import { MdDelete } from "react-icons/md";
import { FaRegUserCircle } from 'react-icons/fa';
import { useParams } from 'next/navigation';


const Comment = ({ postId }) => {
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);

    const [showAll, setShowAll] = useState(false);

    const [loading, setLoading] = useState(false)
    const [loadingDeleteId, setLoadingDeleteId] = useState(null)

    const [errorMessage, setErrorMessage] = useState('');

    const [userId, setUserId] = useState(null)
    const [user, setUser] = useState(null);

    const [postOwnerId, setPostOwnerId] = useState(null);

    useEffect(() => {
        setUserId(localStorage.getItem('userId'))
    }, [])

    useEffect(() => {
        const fetchPostOwner = async () => {
            try {
                const res = await axios.get(`/post/${postId}`)
                setPostOwnerId(res.data.userId)
            } catch (err) {
                console.log(err);
            }
        }
        fetchPostOwner()
    }, [postId])

    useEffect(() => {
        if (!userId) return
        const fetchUserData = async () => {
            try {
                const res = await axios.get(`/users/${userId}`)
                setUser(res.data)
            } catch (err) {
                console.log(err);
            }
        }
        fetchUserData()
    }, [userId])

    const handlePostComment = async () => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.post(`/comments/postComment/${postId}`, { comment }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setComments((prev) => [res.data.comment, ...prev])
            setComment('')
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        const handleGetComment = async () => {
            try {
                const res = await axios.get(`/comments/getComment/${postId}`)
                setComments(res.data.comments)
            } catch (err) {
                console.log(err);
            }
        }
        handleGetComment()
    }, [postId])

    const showMoreComments = showAll ? comments : comments.slice(0, 2)

    const handleDeleteComment = async (commentId) => {
        try {
            const token = localStorage.getItem('token')
            const res = await axios.delete(`/comments/deleteComment/${postId}/${commentId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setComments((prev) => prev.filter((c) => c._id !== commentId))
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='flex flex-col gap-4'>
            <div className='flex flex-col gap-6'>

                {
                    comments.length > 2 && !showAll && (
                        <div onClick={() => setShowAll(true)} className='cursor-pointer text-blue-500'>
                            Show all comments
                        </div>
                    )
                }

                {showMoreComments.map((c) => (
                    <div key={c._id} className='flex flex-col gap-2'>
                        <div className='flex justify-between items-center'>
                            <div className='flex items-center gap-3 border-b border-gray-300 pb-2'>

                                {
                                    c.user.imageUrl ? <img src={c.user.imageUrl} className='w-8 h-8 rounded-full object-cover' />
                                        :
                                        <FaRegUserCircle className='w-8 h-8 rounded-full object-cover' />

                                }

                                <div className='flex flex-col'>
                                    <span className='font-semibold'>{c.user?.username ? c.user.username : 'toko'}</span>

                                </div>
                            </div>

                            {
                                (userId === c.user._id || userId === String(postOwnerId)) && <div onClick={() => handleDeleteComment(c._id)} className='hover:underline cursor-pointer h-fit w-fit text-red-500'><MdDelete /></div>
                            }

                        </div>

                        <span className='px-2'>{c.text}</span>

                    </div>
                ))}

                {
                    showAll && (
                        <span onClick={() => setShowAll(false)} className='cursor-pointer text-blue-500'>Show less</span>
                    )
                }

                {user && (
                    <div className='flex gap-4 items-center'>

                        {
                            user.imageUrl ? <img src={user.imageUrl} className='w-8 h-8 rounded-full object-cover' />
                                :
                                <FaRegUserCircle className='w-10 h-10 rounded-full object-cover' />
                        }

                        <input
                            type='text'
                            placeholder='Leave the comment'
                            className='border p-2 px-3 rounded-[20px] flex-1 outline-none w-[350px]'
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}

                        />
                        <IoSend onClick={handlePostComment} onKeyDown={(e) => e.key === 'Enter' && handlePostComment()} className='cursor-pointer text-2xl text-blue-500' />
                    </div>
                )}


            </div>
        </div>
    );
};

export default Comment;
