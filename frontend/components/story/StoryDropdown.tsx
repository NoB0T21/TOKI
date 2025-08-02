import Link from 'next/link'
import React from 'react'
import { motion } from 'motion/react'
import { DeleteStory } from '@/utils/clientAction'
import { useRouter } from 'next/navigation'

const StoryDropdown = ({id,count}:{id:string,count:number}) => {
  const route = useRouter()
  const deletestory = () => {DeleteStory({id});route.push('/')}
  return (
    <motion.div 
        initial={{scale:0,opacity:0}}
        animate={{scale:1,opacity:1}}
        exit={{scale:0,opacity:0}}
        className='bottom-10 left-2 absolute space-y-3 bg-[#1a1e23] px-3 py-2 border-[#3e4a57] border-1 rounded-md w-50'
    >
        <p>Views: {count}</p>
        <Link className='block content-center' href={'/story'}>Add Story</Link>
        <p onClick={deletestory}>Delete</p>
    </motion.div> 
    
  )
}

export default StoryDropdown
