import React from 'react'
import SidebarBtn from './SidebarBtn'

const MobileNav = () => {
  return (
    <div className='w-full h-full'>
      <div className="flex justify-between items-center gap-5 bg-[#1a1e23] px-4 rounded-sm w-full h-full">
        <div className="w-12 h-12"><SidebarBtn pathname={'/'} name={'Dashboard'}/></div>
        <div className="w-12 h-12"><SidebarBtn pathname={'/explore'} name={'Explore'}/></div>
        <div className="w-12 h-12"><SidebarBtn pathname={'/create'} name={'Create'}/></div>
        <div className="w-12 h-12"><SidebarBtn pathname={'/profile'} name={'Profile'}/></div>
      </div>
    </div>
  )
}

export default MobileNav
