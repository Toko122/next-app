import React, { useEffect, useRef, useState } from 'react'
import { IoMdClose } from "react-icons/io";
import { FaRegUserCircle } from 'react-icons/fa'
import axios from '../app/axios';
import { useParams } from 'next/navigation';
import { ButtonLoading } from './ui/Loading';

const EditProfile = ({ onClose, setTargetUser }) => {

    const modalRef = useRef()
    const [loading, setLoading] = useState(false)
    const [imageLoading, setImageLoading] = useState(false)

    const [image, setImage] = useState(null)
    const [uploadedUrl, setUploadedUrl] = useState(null)

    const [uploadMessage, setUploadMessage] = useState('')
    const [uploadMessageError, setUploadMessageError] = useState('')

    const [form, setForm] = useState({
        username: '',
        bio: ''
    })

    const params = useParams()
    const targetUserId = params.id

    const [usernameMessage, setUsernameMessage] = useState('')

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token")
                const userId = localStorage.getItem("userId")
                const res = await axios.get(`/users/${userId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const user = res.data
                setForm({
                    username: '',
                    bio: user.bio || ''
                })
            } catch (err) {
                console.log("Error fetching user", err)
            }
        }
        fetchUser()
    }, [])


    const handleChangeFile = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImage(URL.createObjectURL(file))
            setUploadedUrl(file)
        }
    }


    const handleSubmitImage = async (e) => {
        e.preventDefault()
        if (!uploadedUrl) return;
        setImageLoading(true)

        const formData = new FormData()
        formData.append('image', uploadedUrl)

        try {

            const token = localStorage.getItem('token')
            const res = await axios.post('/images/uploadImage', formData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            setImage(res.data.url)
            setUploadMessage('Image uploaded successfully')
            setTimeout(() => setUploadMessage(''), 3000)

        } catch (err) {
            console.log('Error uploading image', err)
            setUploadMessageError(err.response?.data?.message || 'Cannot upload this type of image')
            setTimeout(() => setUploadMessageError(''), 3000)
        } finally {
            setImageLoading(false)
        }
        window.location.reload()
    }


    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose()
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [onClose])


    const handleSaveProfile = async () => {
        setLoading(true)
        try {
            const updates = {}
            if (form.username.trim()) updates.username = form.username
            if (form.bio.trim()) updates.bio = form.bio


            if (Object.keys(updates).length === 0) {
                setLoading(false)
                return
            }

            const token = localStorage.getItem("token")
            const userId = localStorage.getItem("userId")
            const res = await axios.put(`/users/editProfile/${userId}`, updates, {
                headers: { Authorization: `Bearer ${token}` }
            })


            setTargetUser(res.data.user)
            onClose()
        } catch (err) {
            console.log(err)
            setUsernameMessage(err.response?.data?.message || 'Update failed')
            setTimeout(() => setUsernameMessage(''), 3000)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const fetchProfileImage = async () => {
            try {
                const res = await axios.get(`/images/getImage/${targetUserId}`)
                setImage(res.data.imageUrl)

            } catch (err) {
                console.log(err);

            }
        }
        fetchProfileImage()
    }, [targetUserId])

    return (
        <div className='fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-50'>
            <form onSubmit={handleSubmitImage} onKeyDown={(e) => { if (e.key === 'Enter') { handleSaveProfile() } }} ref={modalRef} className='w-[450px] h-fit bg-white rounded-lg px-6 py-4 flex flex-col gap-8 pb-12'>

                <div className='flex justify-between items-center'>
                    <h2 className='text-xl font-bold'>Profile Settings</h2>
                    <span
                        className='hover:text-red-500 transition duration-200 cursor-pointer text-[18px]'
                        onClick={onClose}>
                        <IoMdClose />
                    </span>
                </div>

                <div className='flex flex-col gap-8 items-center justify-center'>
                    {image ? (
                        <img src={image} className='w-[120px] h-[120px] rounded-full object-cover' />
                    ) : (
                        <FaRegUserCircle className='text-[130px]' />
                    )}

                    <input type="file" accept="image/*" onChange={handleChangeFile} className="hidden" id="fileInput" />
                    <label htmlFor="fileInput" className="cursor-pointer px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">Choose File</label>

                    <button disabled={!uploadedUrl} type='submit' className='w-full cursor-pointer py-2 px-4 rounded-lg bg-[#2b2b2b] text-white font-semibold hover:bg-[#171717] transition duration-200'>
                        {imageLoading ? <ButtonLoading /> : 'Upload Image'}
                    </button>

                    {uploadMessage && <h1 className='bg-[rgba(105,242,125,0.5)] px-4 py-2 rounded-lg w-full text-white font-semibold text-center'>{uploadMessage}</h1>}
                    {uploadMessageError && <h1 className='bg-[rgba(189,87,87,0.5)] px-4 py-2 rounded-lg w-full text-white font-semibold text-center'>{uploadMessageError}</h1>}
                </div>

                <div className='flex flex-col gap-6'>
                    <div className='flex flex-col gap-2'>
                        <label className='font-semibold'>Change Username:</label>
                        <input onChange={handleChange} value={form.username} name='username' type='text' placeholder='Enter New Username' className='border rounded-lg px-2 py-2' />
                    </div>

                    {usernameMessage && <div className='bg-red-500 py-2 px-4 rounded text-white font-semibold'>{usernameMessage}</div>}

                    <div className='flex flex-col gap-2'>
                        <label className='font-semibold'>Add Bio:</label>
                        <input onChange={handleChange} value={form.bio} type='text' name='bio' placeholder='Add bio' className='border rounded-lg px-2 py-2' />
                    </div>

                </div>

                <button onClick={handleSaveProfile} className='py-2 px-4 hover:bg-blue-600 transition duration-300 bg-blue-500 rounded text-center cursor-pointer text-white font-semibold'>
                     {loading ? <ButtonLoading /> : "Save"}
                </button>

            </form>
        </div>
    )
}

export default EditProfile
