import React from 'react'
import Image from 'next/image'

const Layout = ({children}:{children: React.ReactNode}) => {
  return (
    <div className='flex justify-center items-center min-h-screen animated-gradient2 animate-wiggle2 p-3 sm:p-0'>
      <div className='flex flex-col justify-center items-center w-300 max-w-[550px] rounded-xl bg-[#2525255d] gap-5 p-4'>
        <div className='flex justify-center items-center gap-2'>
            <Image src='/Images/Logo.png' alt='Logo' width={500} height={500} className='size-18'/>
            <h2 className='font-bold text-4xl'>Toki</h2>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Layout