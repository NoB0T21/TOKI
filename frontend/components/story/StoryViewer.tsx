'use client'

import { Story } from '@/Types/types'
import { AnimatePresence, motion, useAnimation } from 'motion/react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import StoryDropdown from './StoryDropdown'

interface StoryViewerProps {
  stories: Story[]
  routes:string
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories,routes}) => {
  const route = useRouter()
if(stories.length === 0)route.push('/story')
  const [isPaused, setIsPaused] = useState(false);
  const controls = useAnimation();
  const [userIndex, setUserIndex] = useState(0)
  const [progressKey, setProgressKey] = useState(0)
  const [storyIndex, setStoryIndex] = useState(0)
  
  const currentUser = stories[userIndex]
  const currentStory = currentUser.stories[storyIndex]

  const nextStory = () => {
    if (!currentUser) return
    if (storyIndex < currentUser.stories.length - 1) {
      setStoryIndex((prev) => prev + 1)
      setProgressKey((prev)=>prev+1)
    } else if (userIndex < stories.length - 1) {
      setUserIndex((prev) => prev + 1)
      setStoryIndex(0)
      setProgressKey((prev)=>prev+1)
    }
    if (storyIndex === currentUser.stories.length-1 && userIndex === stories.length-1) {
      route.push(routes)
    }
  }

  if (!currentStory) return <div>No more stories</div>

  const prevStory = () => {
  if (!currentUser || !currentStory) return;

  if (storyIndex > 0) {
    setStoryIndex((prev) => prev - 1);
    setProgressKey((prev) => prev - 1);
  } else if (userIndex > 0) {
    const previousUser = stories[userIndex - 1];
    const lastStoryIndex = previousUser.stories.length - 1;
    setUserIndex((prev) => prev - 1);
    setStoryIndex(lastStoryIndex);
    setProgressKey((prev) => prev - 1);
  } else {
    // Already at the first story of the first user
    setStoryIndex(0);
    setUserIndex(0);
    setProgressKey(0);
  }
};

useEffect(() => {
  if (!currentStory) return;

  controls.set({ width: 0 }); // Reset animation
  if (!isPaused) {
    controls.start({
      width: '100%',
      transition: { duration: 6 },
    });
  }else {
    controls.stop(); // Pauses the animation
  }
}, [userIndex, storyIndex, isPaused]);


  return (
    <div className="z-50 w-full h-full">
      <div className="block relative content-center bg-[#1a1e23] rounded-xl w-full h-full overflow-hidden">
        {/* Timer Progress Bar */}
        <div className={`grid gap-x-0.5 grid-cols-${currentUser.stories.length} top-0 left-0 absolute w-full h-1`}>
          {currentUser.stories.map((_, index) => (
            <div key={index} className="z-999 bg-gray-700 rounded w-full h-full overflow-hidden">
              {index === storyIndex  && (
                <motion.div
                  key={storyIndex}
                  initial={{ width: 0 }}
                  animate={controls}
                  className="bg-[#2EF6FF] h-full"
                  onAnimationComplete={nextStory}
                />
              )}
              {index < storyIndex  && (
                <div className="bg-[#2EF6FF] w-full h-full" />
              )}
            </div>
          ))}
        </div>

        {/*skip*/}
        <div onClick={()=>prevStory()} className='absolute w-10 h-full'>
        </div>
        <div onClick={()=>nextStory()} className='right-0 absolute w-10 h-full'>
        </div>


        {/* Story Image */}
        <motion.div
          key={progressKey}
          initial={{x: 200}}
          animate={{x:0}}
          className='w-full h-full'
        >
          <Image
            src={currentStory.imageUrl}
            alt="story"
            width={1960}
            height={1080}
            className="w-full h-full object-cover sm:object-contain"
          />
        </motion.div>
        

        {/* User Info */}
        <div className="top-2 left-2 absolute flex justify-center items-center gap-2 mt-1 text-white text-sm">
          <img
            src={currentUser.picture}
            alt="story"
            className="rounded-full size-8 object-cover"
          />
          <div className="font-bold">{currentUser.name}</div>
        </div>
        {routes === '/story/ownview' && <div className='bottom-2 left-2 absolute'>
          <button
            onClick={() => setIsPaused((prev) => !prev)}
            className="text-white"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        </div>}
        <AnimatePresence>{isPaused && <StoryDropdown/>}</AnimatePresence>
        
      </div>
    </div>
  )
}

export default StoryViewer
