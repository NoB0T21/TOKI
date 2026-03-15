'use client'
import Image from 'next/image'
import LogoutBtn from './LogoutBtn'
import Link from 'next/link'
import HeaderBtn from './HeaderBtn'
import { Search } from '../Icons'

export const DashboardHeader = () => {
  return (
    <div className='sticky top-0 z-50 glass border-b border-border'>
      <div className='flex items-center justify-between px-4 py-3 max-w-lg mx-auto'>
        <Link href={'/'} className='flex items-center justify-between gap-1 max-w-lg'>
          <Image className='size-8' src={'/images/Logo.png'} alt='Logo' width={300} height={300}/>
          <p className='text-xl font-display font-bold text-primary glow-text'>Toki</p>
        </Link>
        <HeaderBtn/>
        <LogoutBtn/>
      </div>
    </div>
  )
}

export const ExploreHeader = () => {
  return (
    <div className="sticky top-0 z-50 glass px-4 py-3">
      <div className="relative">
        <div className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground'><Search/></div>
        <input
          type="text"
          placeholder="Search"
          className="w-full bg_secondary rounded-lg pl-10 pr-4 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  )
}


export const ProfileHeader = ({name}:{name:string}) => {
  return (
    <div className='flex justify-between items-center backdrop-blur-2xl mb-3 w-full h-12'>
      <h2 className='font-semibold sm:text-xl'>{name}</h2>
      <LogoutBtn/>
    </div>
  )
}
