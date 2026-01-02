
import { Story } from '@/Types/types'
import React from 'react';
import Link from 'next/link';
import { getuserstorys } from '@/utils/apolloclient';

const StoryBar = async ({ids}:{ids:string[]}) => {
  const getUsers = await getuserstorys({ids})
  const stories:Story[] =getUsers.userstories
  return (
    <div className='w-full text-sm mb-0.5 h-25'>
      <div className='flex mt-1 gap-3 h-full'>
        <Link href={'/story/ownview'} className='space-y-1.5 flex flex-col w-15  items-center'>
          <div className='block content-center border rounded-full size-12 text-[#2EF6FF] text-2xl text-center align-middle'>+</div>
          <p className='text-[#b0bec5] sm:text-md flex justify-center text-xs w-full'>You story</p>
        </Link>
        <div className='flex mt-1 gap-3 w-[90%] h-full overflow-x-auto'>
          {stories ? stories.map((story:Story)=>(
            <Link key={story.id} href={'/story/view'} className='space-y-1 w-15'>
              <img src={story.picture} className='block content-center border-2 rounded-full size-12 text-[#2EF6FF]'/>
              <p className='text-[#b0bec5] sm:text-md flex justify-center text-xs w-full'>{story.name.split(' ')[0]}</p>
            </Link>
          )) : <><div>helo</div></>}
        </div>
      </div>
    </div>
  )
}

export default StoryBar
