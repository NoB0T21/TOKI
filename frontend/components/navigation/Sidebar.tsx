import Image from 'next/image'
import React from 'react'
import SidebarBtn from './SidebarBtn'

const Sidebar = () => {
  return (
    <div className='flex flex-col items-center px-4 w-19 lg:w-60 xl:w-70 transition-(w) duration-200 ease-in-out'>
      <div className="hidden lg:flex justify-center items-center gap-2 w-full h-1/6">
        <Image className='lg:w-40 xl:w-50 lg:h-30 xl:h-40' src={'/Images/Logotxt.png'} width={100} height={100} alt="logo"/>
      </div>
      <div className="lg:hidden flex justify-center items-center w-full h-1/6">
        <Image className='w-full' src={'/Images/Logo.png'} width={100} height={100} alt="logo"/>
      </div>
      <div className="flex flex-col gap-6 py-4 w-full">
        <div className="w-full h-10"><SidebarBtn pathname={'/'} name={'Dashboard'}/></div>
        <div className="w-full h-10"><SidebarBtn pathname={'/Explore'} name={'Explore'}/></div>
        <div className="w-full h-10"><SidebarBtn pathname={'/create'} name={'Create'}/></div>
        <div className="w-full h-10"><SidebarBtn pathname={'/Profile'} name={'Profile'}/></div>
      </div>
    </div>
  )
}

export default Sidebar
