'use client'
import { Story } from '@/Types/types'
import Link from 'next/link';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { addstory } from '@/state/storySlicer';
import { getuserstorys } from '@/utils/clientAction';

const StoryBar = ({ids}:{ids:string[]}) => {
  const dispatch = useDispatch();
  const stories = useSelector((state: RootState) => state.story.posts);
  useEffect(()=>{
    let id = ''
    const fetch = async () => {
      const story = await getuserstorys(ids)
      const newPosts:Story[] = story.creatorIds || [];
      id = story.id
      if (newPosts.length) dispatch(addstory(newPosts));
    }
    fetch()
  },[ids])
  return (
    <div className='flex gap-4 px-4 py-3 h-27 overflow-x-auto scrollbar-hide mb-0.5 border-b border-border'>
      <Link href={'/story/ownview'} className='flex flex-col items-center gap-1 shrink-0'>
        <div className='relative h-16 w-16 rounded-full border-2 border-border'>
          +
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full gradient-primary flex items-center justify-center border-2 border-background">
            <div className="h-3 w-3 text-primary-foreground"> + </div>
          </div>
        </div>
        <p className='text-[10px] text-muted-foreground'>You story</p>
      </Link>
        {stories ? stories.map((story:Story, idx:number)=>(
          <Link key={idx} href={'/story/view'} >
            <motion.div
              key={story.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center gap-1 shrink-0 cursor-pointer"
            >
              {/* <div className={`h-16 w-16 rounded-full p-[2px] ${story.stories[idx].views.count.includes(id) ? "gradient-story" : "border-2 border-muted"}`}> */}
              <div className={`h-16 w-16 rounded-full p-[2px] gradient-story`}>
                <img
                  src={story.picture}
                  alt={story.name}
                  className="h-full w-full rounded-full object-cover border-2 border-background"
                />
              </div>
              <span className='text-[10px] text-muted-foreground max-w-[64px] truncate'>{story.name}</span>
            </motion.div>
          </Link>
        )) : <><div>helo</div></>}
    </div>
  )
}

export default StoryBar

