'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useAuth } from '../AuthProvider'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from '../axios'
import { FaRegUserCircle } from 'react-icons/fa'
import { FiMenu, FiX } from 'react-icons/fi'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  
  const dropdownRef = useRef(null)

  const { isLoggedIn, logout, userId } = useAuth()
  const router = useRouter()

  const location = usePathname()
  const isAdminRoute = location.startsWith('/admin');
  
  
  useEffect(() => {
    setMounted(true)
  }, [])

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/users/allUsers')
        setUsers(res.data)
      } catch (err) {
        console.log(err)
      }
    }
    fetchUsers()
  }, [])

  
  useEffect(() => {
    if (!mounted || searchTerm.trim() === '') {
      setFilteredUsers([])
      setDropdownOpen(false)
      return
    }

    const filtered = users.filter((user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    )

    setFilteredUsers(filtered)
    setDropdownOpen(true)
  }, [searchTerm, users, mounted])

  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        if (window.innerWidth >= 768) setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelectUser = (id) => {
    router.push(`/user/${id}`)
    setSearchTerm('')
    setDropdownOpen(false)
    setMenuOpen(false)
  }

  const handleLogout = () => {
    if (isLoggedIn) {
      logout()
      router.push('/auth/login')
    }
  }

  if(isAdminRoute) return null;

  return (
    <nav className="w-full bg-gray-800 text-white px-6 py-3 fixed top-0 shadow-md z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <h1
          className="text-2xl font-bold cursor-pointer"
          onClick={() => {
            router.push('/')
            setSearchTerm('')
            setMenuOpen(false)
          }}
        >
          Neti
        </h1>

        
        <div ref={dropdownRef} className="relative hidden md:block w-[400px]">
          <input
            type="text"
            placeholder="Search users..."
            className="border w-full text-white border-gray-400 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {mounted && dropdownOpen && (
            <div className="absolute bg-white w-full max-h-60 overflow-y-auto rounded-md shadow-lg mt-1 z-50 text-black">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="px-6 py-2 cursor-pointer flex gap-4 items-center hover:bg-gray-100"
                    onClick={() => handleSelectUser(user._id)}
                  >
                    {user.imageUrl ? (
                      <img
                        src={user.imageUrl}
                        alt=""
                        className="w-[40px] h-[40px] rounded-full"
                      />
                    ) : (
                      <FaRegUserCircle className="text-[40px]" />
                    )}
                    <h1 className="font-medium">{user.username}</h1>
                  </div>
                ))
              ) : (
                <div className="px-6 py-4 text-gray-500 text-center">Not found</div>
              )}
            </div>
          )}
        </div>

        
        <div className="hidden md:flex gap-2 items-center">
          {mounted && isLoggedIn && userId ? (
            <Link
              href={`/user/${userId}`}
              className="hover:bg-gray-700 transition duration-200 py-1.5 cursor-pointer px-6 rounded-lg bg-gray-600"
            >
              Profile
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="text-center w-[100px] cursor-pointer py-2 px-4 rounded-lg hover:bg-gray-700 transition"
            >
              Sign up
            </Link>
          )}

          {mounted && isLoggedIn && (
            <button
              onClick={handleLogout}
              className="text-center w-[100px] cursor-pointer py-2 px-4 rounded-lg hover:bg-gray-700 transition"
            >
              Logout
            </button>
          )}
        </div>

       
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      
      {menuOpen && mounted && (
        <div className="md:hidden mt-3 space-y-3 px-4 pb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="border w-full text-white border-gray-400 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {dropdownOpen && (
              <div className="absolute bg-white w-full max-h-60 overflow-y-auto rounded-md shadow-lg mt-1 z-50 text-black">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <div
                      key={user._id}
                      className="px-6 py-2 cursor-pointer flex gap-4 items-center hover:bg-gray-100"
                      onClick={() => handleSelectUser(user._id)}
                    >
                      {user.imageUrl ? (
                        <img
                          src={user.imageUrl}
                          alt=""
                          className="w-[40px] h-[40px] rounded-full"
                        />
                      ) : (
                        <FaRegUserCircle className="text-[40px]" />
                      )}
                      <h1 className="font-medium">{user.username}</h1>
                    </div>
                  ))
                ) : (
                  <div className="px-6 py-4 text-gray-500 text-center">Not found</div>
                )}
              </div>
            )}
          </div>

          {mounted && isLoggedIn && userId ? (
            <Link
              href={`/user/${userId}`}
              className="block py-2 px-4 rounded-lg bg-gray-600 hover:bg-gray-700 transition text-center"
            >
              Profile
            </Link>
          ) : (
            <Link
              href="/auth/login"
              className="block w-full py-2 px-4 rounded-lg bg-gray-700 text-center transition"
              onClick={() => setMenuOpen(false)}
            >
              Sign up
            </Link>
          )}

          {mounted && isLoggedIn && (
            <button
              onClick={handleLogout}
              className="w-full py-2 px-4 rounded-lg bg-gray-700 text-center"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar
