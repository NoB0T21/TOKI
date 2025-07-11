import React from 'react'
import SidebarBtn from './SidebarBtn'

const MobileNav = () => {
  return (
    <div className='w-full h-13'>
      <div className="flex justify-between items-center gap-6 px-4 w-full h-full">
        <div className="w-10 h-10"><SidebarBtn pathname={'/'} name={'Dashboard'}/></div>
        <div className="w-10 h-10"><SidebarBtn pathname={'/Explore'} name={'Explore'}/></div>
        <div className="w-10 h-10"><SidebarBtn pathname={'/create'} name={'Create'}/></div>
        <div className="w-10 h-10"><SidebarBtn pathname={'/Profile'} name={'Profile'}/></div>
      </div>
    </div>
  )
}

export default MobileNav
