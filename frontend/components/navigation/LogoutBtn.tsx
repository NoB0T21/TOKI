"use client"

import { useRouter } from 'next/navigation'
import { Logout } from '../Icons'
import Cookie from 'js-cookie'
import { useDispatch } from 'react-redux'
import { resetFeed } from '@/state/feedSlice'

const LogoutBtn = () => {
    const router= useRouter()
    const dispatch = useDispatch();
    const logout = () => {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      Cookie.remove('token')
      Cookie.remove('user')
      dispatch(resetFeed());
      router.push('/sign-up')
    }
  return (
    <button onClick={logout} className='flex justify-center items-center gap-2 bg-red-700 hover:bg-red-600 mx-2 p-1 rounded-full w-10 sm:w-30 h-8'>
      <Logout/>
      <p className='hidden sm:flex'>Logout</p>
    </button>
  )
}

export default LogoutBtn
