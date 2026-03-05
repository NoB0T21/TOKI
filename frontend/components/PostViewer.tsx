'use client'

import { Like, LikeFill, Music, Save, Send, Comment, Mute, Playaudio} from "./Icons";
import Image from 'next/image'
import Link from 'next/link'
import Cookies from "js-cookie";
import { useEffect, useRef, useState } from 'react';
import {AnimatePresence, motion} from 'motion/react'
import { Posts } from '@/Types/types';
import { followusers, likePosts } from '@/utils/clientAction';
import Readmore from "./Readmore";

interface Prop {
  posts:Posts[],
  initialIndex: number;
  onClose: () => void;
}


const PostViewer = ({posts,initialIndex,onClose}:Prop) => {
  const userId = Cookies.get('user') || ''
  const [following, setFollowing ] = useState<string[]>(posts[initialIndex].follower.count)
  const [likecount, setLikeCount ] = useState<number>(posts[initialIndex].like.likeCount)
  const [like, setLike ] = useState<string[]>(posts[initialIndex].like.like)
  const [post, setPost ] = useState<Posts>(posts[initialIndex])
  const [index, setIndex] = useState(initialIndex);
  const [paused, setPaused] = useState(true);
  const goNext = () => setIndex((i) => Math.min(i + 1, posts.length - 1));
  const goPrev = () => setIndex((i) => Math.max(i - 1, 0));
  const audioRef = useRef<HTMLAudioElement>(null);
  const audio = () => {
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
  }

  useEffect(() => {
  const audio = audioRef.current;
  if (!audio) return;

  const handlePlay = () => setPaused(false);
  const handlePause = () => setPaused(true);

  audio.addEventListener('play', handlePlay);
  audio.addEventListener('pause', handlePause);

  return () => {
    audio.removeEventListener('play', handlePlay);
    audio.removeEventListener('pause', handlePause);
  };
}, []);

  const likePost = async () => {    
    const data = await likePosts({id:posts[index].id})
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
    const data = await followusers({CreatorId:posts[index].user.id})
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
  
    a.currentTime = posts[index].start;
  
    const onTime = () => {
      if (a.currentTime >= posts[index].end) {
        a.pause();
      }
    };
  
    a.addEventListener('timeupdate', onTime);
    return () => a.removeEventListener('timeupdate', onTime);
  },[])

  useEffect(() => {
    setPost(posts[index])
    setLike(posts[index].like.like)
    setFollowing(posts[index].follower.count)
    setLikeCount(posts[index].like.likeCount)
  },[index])
  return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-3">
              {post.user.picture && (
                <img src={post.user.picture} alt="" className="h-8 w-8 rounded-full object-cover" />
              )}
              <div className="flex flex-col text-sm md:text-md justify-center">
                <span className="text-sm font-semibold text-foreground">{post.user.name}</span>
                {post.song.previewUrl &&
                  <>
                    {post.song.previewUrl&&<audio autoPlay ref={audioRef} src={`${post.song.previewUrl}`}/>}
                    <div className='flex gap-1 text-xs md:text-sm items-center'>
                      <p className='flex size-5 animate-spin'><Music/></p>
                      <p className="muted_text">{post.song.title} - {post.song.artist}</p>
                    </div>
                  </>
                }
              </div>
              {post.user.id !== userId && (
                <div className="flex cursor-pointer text-sm justify-between items-center p-5 h-full">
                  <motion.div
                    whileTap={{ scale: 0.7 }}
                    onClick={()=>followuser()}
                    className={`animated-gradient hover:animate-wiggle flex items-center px-2 ${following?.includes(userId) && "muted_text muted_story"} border rounded-md`}
                  >{following?.includes(userId)?'Following':'Follow'}</motion.div>
                </div>
              )}
            </div>
            <button onClick={onClose}>
              <div className="h-6 w-6 text-foreground hover:text-primary transition-colors" >x</div>
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            <motion.img
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              src={post.pictureURL}
              alt=""
              className="max-w-full max-h-full object-contain"
              onDoubleClick={() => likePost()}
            />
            <div className="absolute bottom-0 p-2 flex justify-end items-end w-full aspect-video">
              {post.song?.previewUrl && (
                <div
                  onClick={() => {
                    if (!audioRef.current) return;
                    if (paused) {
                      audioRef.current.play();
                    } else {
                      audioRef.current.pause();
                  }}}
                  
                  className=" bg-[#1d1c1c9d] z-50 size-6 sm:size-7 sm:mx-1 rounded-full p-1"
                >
                  {paused ? <Mute /> : <Playaudio />}
                </div>
              )}
            </div>
            {index > 0 && (
              <button onClick={goPrev} className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-secondary/80 flex items-center justify-center">
                <div className="h-5 w-5 text-foreground" >{'<'}</div>
              </button>
            )}
            {index < posts.length - 1 && (
              <button onClick={goNext} className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-secondary/80 flex items-center justify-center">
                <div className="h-5 w-5 text-foreground">{'>'}</div>
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-border px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <motion.button whileTap={{ scale: 1.3 }} onClick={() => likePost()}>
                  <div className={`size-6`}>{like?.includes(userId)?<LikeFill/>:<Like/>}</div>
                </motion.button>
                <div className={`size-6`}><Comment/></div>
                <div className={`size-6`}><Send/></div>
              </div>
              <motion.button whileTap={{ scale: 1.3 }}>
                <div className={`size-6`}><Save/></div>
              </motion.button>
            </div>
          </div>

          {/* Likes & Caption */}
        <div className="px-4 pt-2">
          <p className="text-sm font-semibold ">{likecount} likes</p>
          <p className="text-sm mt-1">
            <span className="font-semibold">{post.user.name}</span>{" "}
            <span className="secondary_text">{post.title}</span>
          </p>
          <div className=" w-full ">
            <Readmore text={post.message} maxLength={30} />
          </div>
          <div className='space-x-1 truncate'>
            {post.tags.map((tag, index) => (
              <span key={index} className="text-blue-500 hover:text-blue-600 text-sm hover:underline hover:underline-offset-1 cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
          {/* {comments > 0 && (
            <p className="text-sm text-muted-foreground mt-1 cursor-pointer">
              View all {comments} comments
            </p>
          )} */}
        </div>
        </motion.div>
     </AnimatePresence>
  )
}

export default PostViewer
