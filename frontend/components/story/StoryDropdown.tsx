import Link from 'next/link'
import React from 'react'
import { motion, AnimatePresence } from 'motion/react'

const StoryDropdown = () => {
  return (
    
        <motion.div 
            initial={{scale:0,opacity:0}}
            animate={{scale:1,opacity:1}}
            exit={{scale:0,opacity:0}}
            className='bottom-10 left-2 absolute space-y-3 bg-[#1a1e23] px-3 py-2 border-[#3e4a57] border-1 rounded-md w-50'
        >
            <p>Views</p>
            <Link className='block content-center' href={'/story'}>Add Story</Link>
            <p>Delete</p>
        </motion.div> 
    
  )
}

export default StoryDropdown
