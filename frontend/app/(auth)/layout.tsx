import React from 'react'
import Image from 'next/image'

const Layout = ({children}:{children: React.ReactNode}) => {
  return (
    <div className='flex min-h-screen'>
      <section className='hidden lg:flex flex-col gap-8 bg-blue-600 p-10 rounded-r-xl w-1/3 max-w-[900px]'>
        <div className='flex justify-start md:justify-center items-center gap-2'>
          <Image src='/Images/Logo.png' alt='Logo' width={500} height={500} className='h-auto size-20 md:size-20'/>
          <h2 className=' font-semibold text-3xl xl:text-5xl'>トki</h2>
        </div>
        <div className='flex flex-col gap-5'>
          <h1 className='font-black text-2xl xl:text-5xl'>Capture Time. Share Life.</h1>
          <h5 className='md:text-2xl'>Toki is a minimalist social platform where memories become timeless. Snap, share, and relive life’s best moments — all in your own flow, in your own time.</h5>
        </div>
        <div className='flex justify-center'>
          <Image src='/files.png' alt='Logo' width={500} height={500} className='h-auto md:size-40 hover:-rotate-5 hover:scale-120 transition-all duration-300 ease-in-out'/>
        </div>
      </section>
      <div className='flex flex-col flex-1 lg:justify-center items-center gap-5 p-4 lg:p-10 py-5 lg:py-0'>
        <div className='lg:hidden flex justify-center items-center gap-2'>
            <Image src='/Images/Logo.png' alt='Logo' width={500} height={500} className='size-18'/>
            <h2 className='font-bold text-4xl'>Toki</h2>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Layout