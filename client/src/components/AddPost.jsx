'use client'

import axios from '../app/axios'
import React, { useEffect, useRef, useState } from 'react'
import { IoMdClose } from 'react-icons/io'
import { ButtonLoading } from './ui/Loading'

const AddPost = ({ onClose, onPostAdded }) => {

  const targetUserId = localStorage.getItem('userId')
  const [form, setForm] = useState({ title: '' })
  const [loading, setLoading] = useState(false)
  const modalRef = useRef()
  const [imageUrl, setImageUrl] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)

  const [imageUploadError, setImageUploadError] = useState('')

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    setPreviewImage(URL.createObjectURL(file))
    setImageUrl(file)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) onClose()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const handleUpload = async (e) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('title', form.title)
    formData.append('image', imageUrl)

    try {
      const token = localStorage.getItem("token")
      await axios.post(`/post/addPost/${targetUserId}`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      setForm({ title: "" })
      setImageUrl(null)
      setPreviewImage(null)
      if (onPostAdded) onPostAdded()
      onClose()
      window.location.reload()
    } catch (err) {
      console.log('Error uploading', err)
      setImageUploadError(err.response.message || "This type of file can't be uploaded")
      setTimeout(() => setImageUploadError(''), 4000)
    } finally {
      setLoading(false)
    }

  }

  return (
    <div className='fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50'>
      <form ref={modalRef} onSubmit={handleUpload} className='w-[500px] h-fit bg-white rounded-lg px-6 py-4 flex flex-col gap-8 pb-12'>
        <div className='flex justify-between items-center'>
          <h2 className='text-xl font-bold'>Add Post</h2>
          <span className='hover:text-red-500 transition duration-200 cursor-pointer text-[18px]' onClick={onClose}>
            <IoMdClose />
          </span>
        </div>

        <div className='flex flex-col gap-6'>
          <textarea
            onChange={handleChange}
            name='title'
            placeholder='Share your mind'
            className='outline-none border min-h-[100px] max-h-[200px] border-gray-200 rounded-lg px-2 py-2'
          />

          {previewImage ? (
            <img src={previewImage} className='w-full max-h-[400px] object-cover' />
          ) : (
            <div className='w-full h-[300px] bg-[#f2f2f2] flex items-center justify-center'>
              <div className='flex flex-col gap-2 items-center'>
                <label htmlFor='imageUpload' className='text-indigo-500 cursor-pointer'>Upload Image</label>
                <p className='text-[#636465]'>Share images or a single video in your post.</p>
              </div>
              <input id='imageUpload' type='file' onChange={handleFileChange} className='hidden' />
            </div>
          )}
        </div>

        {
          imageUploadError && <span className='bg-red-400 w-full py-2 rounded px-3 font-semibold text-white'>{imageUploadError}</span>
        }

        {loading ? (
          <ButtonLoading />
        ) : (
          <button type='submit' className='py-2 text-white font-semibold cursor-pointer rounded-lg px-4 bg-blue-400 hover:bg-blue-500 transition duration-200'>
            Post
          </button>
        )}
      </form>
    </div>
  )
}

export default AddPost
