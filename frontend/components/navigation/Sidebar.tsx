import Image from 'next/image'
import React from 'react'
import SidebarBtn from './SidebarBtn'
import Link from 'next/link'

const Sidebar = () => {
  return (
    <div className='flex flex-col items-center px-4 w-[75px] lg:w-[250px] xl:w-[300px] transition-(w) duration-200 ease-in-out py-5'>
      <Link href={'/'} className="flex justify-center items-center mb-5 p-1 w-full h-1/6 sm:size-19">
        <Image className='p-2 sm:w-full' src={'/Images/Logo.png'} width={200} height={200} alt="logo"/>
        <p className='hidden lg:block content-center font-semibold text-4xl'>Toki</p>
      </Link>
      <div className="flex flex-col gap-6 py-4 w-full">
        <div className="w-full h-9 xl:h-12"><SidebarBtn pathname={'/'} name={'Dashboard'}/></div>
        <div className="w-full h-9 xl:h-12"><SidebarBtn pathname={'/explore'} name={'Explore'}/></div>
        <div className="w-full h-9 xl:h-12"><SidebarBtn pathname={'/create'} name={'Create'}/></div>
        <div className="w-full h-9 xl:h-12"><SidebarBtn pathname={'/profile'} name={'Profile'}/></div>
      </div>
    </div>
  )
}

export default Sidebar
