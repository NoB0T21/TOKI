import React from 'react'
import SidebarBtn from './SidebarBtn'

const MobileNav = () => {
  return (
    <div className='flex items-center justify-around py-2 max-w-lg mx-auto'>
      <div className="w-9 h-9 flex flex-col items-center gap-0.5 p-2 transition-colors"><SidebarBtn pathname={'/'} name={'Dashboard'}/></div>
      <div className="w-9 h-9 flex flex-col items-center gap-0.5 p-2 transition-colors"><SidebarBtn pathname={'/explore'} name={'Explore'}/></div>
      <div className="w-9 h-9 flex flex-col items-center gap-0.5 p-2 transition-colors"><SidebarBtn pathname={'/create'} name={'Create'}/></div>
      <div className="w-9 h-9 flex flex-col items-center gap-0.5 p-2 transition-colors"><SidebarBtn pathname={'/profile'} name={'Profile'}/></div>
    </div>
  )
}

export default MobileNav
