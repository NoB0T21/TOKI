import React from 'react'
import Image from 'next/image'

const Layout = ({children}:{children: React.ReactNode}) => {
  return (
    <div className='flex min-h-screen'>
      <section className='hidden lg:flex flex-col gap-8 bg-purple-800 p-10 rounded-r-xl w-1/3'>
        <div className='flex justify-start xl:justify-center items-center gap-2 xl:pr-7'>
          <Image src='/Images/Logo.png' alt='Logo' width={500} height={500} className='h-auto size-20 xl:size-30'/>
          <h2 className='mb-3 font-semibold text-3xl xl:text-5xl'>トki</h2>
        </div>
        <div className='flex flex-col gap-5'>
          <h1 className='font-black text-4xl xl:text-6xl'>Capture Time. Share Life.</h1>
          <h5 className='xl:text-3xl'>Toki is a minimalist social platform where memories become timeless. Snap, share, and relive life’s best moments — all in your own flow, in your own time.</h5>
        </div>
        <div className='flex justify-center my-7'>
          <Image src='/files.png' alt='Logo' width={500} height={500} className='h-auto xl:size-60 hover:-rotate-5 hover:scale-120 transition-all duration-300 ease-in-out'/>
        </div>
      </section>
      <div className='flex flex-col flex-1 lg:justify-center items-center gap-5 p-4 lg:p-10 py-10 lg:py-0'>
        <div className='lg:hidden flex justify-center items-center gap-2'>
            <Image src='/Images/Logo.png' alt='Logo' width={500} height={500} className='size-20'/>
            <h2 className='mb-3 font-bold text-4xl'>Toki</h2>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Layout