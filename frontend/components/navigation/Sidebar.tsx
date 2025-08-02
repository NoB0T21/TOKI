import Image from 'next/image'
import React from 'react'
import SidebarBtn from './SidebarBtn'

const Sidebar = () => {
  return (
    <div className='flex flex-col items-center px-4 w-[75px] lg:w-[250px] transition-(w) duration-200 ease-in-out py-10'>
      <div className="flex justify-center items-center gap-2 mb-5 p-1 w-full h-1/6 sm:size-20">
        <Image className='p-2 sm:w-full' src={'/Images/Logo.png'} width={100} height={100} alt="logo"/>
        <p className='hidden lg:block content-center font-semibold text-5xl'>Toki</p>
      </div>
      <div className="flex flex-col gap-6 py-4 w-full">
        <div className="w-full h-10"><SidebarBtn pathname={'/'} name={'Dashboard'}/></div>
        <div className="w-full h-10"><SidebarBtn pathname={'/Explore'} name={'Explore'}/></div>
        <div className="w-full h-10"><SidebarBtn pathname={'/Create'} name={'Create'}/></div>
        <div className="w-full h-10"><SidebarBtn pathname={'/Profile'} name={'Profile'}/></div>
      </div>
    </div>
  )
}

export default Sidebar
