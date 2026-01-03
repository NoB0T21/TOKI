'use client'

import { Like, LikeFill, Music } from "./Icons";
import Image from 'next/image'
import Link from 'next/link'
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from 'react';
import {motion} from 'motion/react'
import { Posts } from '@/Types/types';
import { followusers, likePosts } from '@/utils/clientAction';

interface Prop {
  post:Posts,
  LikeCount:number,
  Likes:string[],
  Following:string[]
}


const ExploreGrid = ({post, LikeCount,Likes,Following}:Prop) => {
  const userId = Cookies.get('user') || ''
  const [following, setFollowing ] = useState<string[]>(Following)
  const [likecount, setLikeCount ] = useState<number>(LikeCount)
  const [like, setLike ] = useState<string[]>(Likes)
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const likePost = async () => {    
    const data = await likePosts({id:post.id})
    if(data.status === 200) {
      const currentLikes = Array.isArray(like) ? like : [];
      const index = currentLikes.indexOf(userId);
      let updatedLikes;

      if (index === -1) {
        updatedLikes = [...currentLikes, userId]; // Add like
        setLikeCount(prev => prev + 1);
      } else {
        updatedLikes = currentLikes.filter(id => id !== userId); // Remove like
        setLikeCount(prev => (prev > 0 ? prev - 1 : 0));
      }

      setLike(updatedLikes);
    }
  }

  const followuser = async () => {    
    const data = await followusers({CreatorId:post.user.id})
    if(data.status === 200) {
      const currentLikes = Array.isArray(following) ? following : [];
      const index = currentLikes.indexOf(userId);
      let updatedFollow;

      if (index === -1) {
        updatedFollow = [...currentLikes, userId]; // Add like
      } else {
        updatedFollow = currentLikes.filter(id => id !== userId); // Remove like
      }

      setFollowing(updatedFollow);
    }
  }

  useEffect(()=>{
    if (!audioRef.current) return;
  
    const a = audioRef.current;
  
    a.currentTime = post.start;
  
    const onTime = () => {
      if (a.currentTime >= post.end) {
        a.pause();
      }
    };
  
    a.addEventListener('timeupdate', onTime);
    return () => a.removeEventListener('timeupdate', onTime);
  },[])

  return (
    <>
      <div className="relative flex flex-col items-start gap-7 bg-gradient-to-t from-[rgba(5,11,15,1)] to-[rgba(14,18,23,1)] p-5 py-8 rounded-2xl w-full sm:h-[80%] max-h-130 overflow-y-auto">
        <div className='flex justify-between items-center mt-6 sm:mt-0 w-full h-8'>
          <Link href={`/user/${post.user.id}`} className='flex items-center'>
            <Image
              src={post.user.picture}
              alt="Post"
              width={500}
              height={500}
              className="rounded-full size-[30px] sm:size-11 object-cover"
            />
            <div className="flex flex-col text-sm md:text-md justify-center px-2">
              <div className="truncate px-2">{post.user.name}</div>
              {post.song &&
                <>
                  {post.song.previewUrl&&<audio autoPlay ref={audioRef} src={`${post.song.previewUrl}`}/>}
                  <div className='flex gap-1 items-center'>
                      <p className='flex size-6 animate-spin'><Music/></p>
                      {post.song.title} - 
                      <p className='text-sm'>{post.song.artist}</p>
                    </div>
                </>
              }
            </div>
          </Link>
          <motion.div
              whileTap={{ scale: 0.7 }}
              onClick={followuser} 
              className="flex items-center px-2 border-1 rounded-md text-sm animated-gradient hover:animate-wiggl"
            >
              {following?.includes(userId)?'Following':'Follow'}
            </motion.div>
        </div>
        <Image
          src={post.pictureURL}
          alt="Post"
          width={1920}
          height={1080}
          className="rounded-md w-full aspect-video object-cover"
        />
          <div>
            <motion.div 
              whileTap={{ scale: 0.7 }}
              onClick={() =>likePost()}
              className="flex gap-1 w-10 sm:w-12"
            >
              <div className={`size-6 sm:size-7`}>
                {like?.includes(userId)?<LikeFill/>:<Like/>}
              </div>
              <p className='font-semibold'>{likecount}</p>
            </motion.div>
            <div className='flex justify-start gap-1 flex-wrap p-1 '>
              {post.tags.map((tag, index) => (
                  <span key={index} className="truncate w-auto items-center text-[#2EF6FF] hover:text-[#aafcff] text-sm hover:underline hover:underline-offset-1 cursor-pointer">
                      {tag}
                  </span>
              ))}
            </div>
            <h1>{post.title}</h1>
            <div className="text-[#b0bec5] break-words w-full  whitespace-pre-wrap">
                {post.message}
            </div>
          </div>
        </div>
      <div className="hidden md:flex bg-amber-400 w-80 lg:w-130">comment</div>
    </>
  )
}

export default ExploreGrid
