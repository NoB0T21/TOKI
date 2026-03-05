'use client'
import { Like, LikeFill, Music, Mute, Playaudio, Save, Send, Comment } from "../Icons"
import { useEffect, useRef, useState } from "react"
import {motion, AnimatePresence} from 'motion/react'
import { Posts2 } from "@/Types/types"
import { followusers, likePosts } from "@/utils/clientAction"
import Image from "next/image"
import Readmore from "../Readmore"
import Cookies from "js-cookie"
import FileDropdown from "./FileDropdown"
import Link from "next/link"
import {timeAgo} from '@/utils/utils'

const PostCard = ({file, profile, name, userID,play,followings,onSelect}:{file:Posts2, profile:string,play:boolean, name:string, userID:string, followings:string[],onSelect:(play: boolean) => void}) => {
  const user = Cookies.get('user') || '';
  const [like, setLike ] = useState<string[]>(file?.like?.like)
  const [show,setShow]=useState(false)
  const [liked, setLiked] = useState(false);
  const [likecount, setLikeCount ] = useState<number>(file?.like?.likeCount)
  const [following, setFollowing ] = useState<string[]>(followings)
  const audioRef = useRef<HTMLAudioElement>(null);
  const [paused, setPaused] = useState(true);
  const [manualPause, setManualPause] = useState(false)
  const [inView, setInView] = useState(false)

  const likePost = async () => {
    const currentLikes = Array.isArray(like) ? like : [];
    const index = currentLikes.indexOf(user);
    let updatedLikes;

    if (index === -1) {
      updatedLikes = [...currentLikes, user];
      setLikeCount(prev => prev + 1);
    } else {
      updatedLikes = currentLikes.filter(id => id !== user);
      setLikeCount(prev => (prev > 0 ? prev - 1 : 0));
    }

    setLike(updatedLikes);

    const data = await likePosts({id:file.id})

    if(data.status !== 200) {
      setLike(currentLikes)
    }
  }

  const followuser = async () => {
    const currentLikes = Array.isArray(following) ? following : [];
    const index = currentLikes.indexOf(user);
    let updatedFollow;

    if (index === -1) {
      updatedFollow = [...currentLikes, user];
    } else {
      updatedFollow = currentLikes.filter(id => id !== user);
    }

    setFollowing(updatedFollow);
    
    const data = await followusers({CreatorId:file.owner})

    if(data.status !== 200) {
      setFollowing(currentLikes)
    }
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

  useEffect(() => {
  const audio = audioRef.current
  if (!audio) return

  if (play && inView) {
    audio.currentTime = file.start

    // attach start/end limiter
    const onTime = () => {
      if (audio.currentTime >= file.end) {
        audio.pause()
      }
    }

    audio.ontimeupdate = onTime

    audio.play().catch(() => {})
    setPaused(false)

  } else {
    audio.pause()
    setPaused(true)
  }

}, [play, inView])

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileInView={{opacity:1}}
        onViewportEnter={()=>{
          setInView(true)
        }}

        onViewportLeave={()=>{
          setInView(false)
          audioRef.current?.pause()
        }}
        viewport={{amount: 0.6 }}
        key={file.id} 
        className="relative border-b muted_border pb-4 rounded-md"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          <Link href={`/user/${file.owner}`} className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full gradient-story p-[2px]">
              <Image
                src={profile}
                alt={name}
                width={500}
                height={500}
                className="h-full w-full rounded-full object-cover border-2 border-background"
              />
            </div>

            <div className="flex flex-col text-sm md:text-md justify-center">
              <div className="text-sm font-bold">{name}</div>

              {file.song &&
                <>
                  {file.song.previewUrl &&
                    <audio
                      ref={audioRef}
                      preload="metadata"
                      src={file.song.previewUrl.toString() || 'kk'}
                    />
                  }

                  <div className='flex gap-1 text-xs md:text-sm items-center'>
                    <p className='flex size-5 animate-spin'><Music/></p>
                    <p className="muted_text">{file.song.title} - {file.song.artist}</p>
                  </div>
                </>
              }
            </div>
          </Link>

          <div className="flex cursor-pointer text-sm justify-between items-center p-5 h-full">
            {userID===user?
              <p onClick={()=>setShow(true)}>...</p>
              :
              <motion.div
                whileTap={{ scale: 0.7 }}
                onClick={followuser}
                className={`right-5 absolute animated-gradient hover:animate-wiggle flex items-center px-2 ${following?.includes(user) && "muted_text muted_story"} border rounded-md`}
              >
                {following?.includes(user)?'Following':'Follow'}
              </motion.div>
            }
          </div>
        </div>
        
        {/* Image */}
        <div className="relative" onDoubleClick={likePost}>
          <img src={file.pictureURL} alt="Post" className="w-full aspect-square object-cover" />

          {liked && (
            <motion.div
              initial={{ scale: 0, opacity: 1 }}
              animate={{ scale: 0.4, opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              {like?.includes(user)?<LikeFill/>:<Like/>}
            </motion.div>
          )}

          <div className="absolute bottom-0 p-2 flex justify-end items-end w-full aspect-video">
            {file.song?.previewUrl && (
              <div
                onClick={() => {

                                   if (paused) {
                    onSelect(true)
                  } else {
                    onSelect(false)
                  }
                }}
                className=" bg-[#1d1c1c9d] z-50 size-6 sm:size-7 sm:mx-1 rounded-full p-1"
              >
                {paused ? <Mute /> : <Playaudio />}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between px-4 pt-3">
          <div className="flex items-center gap-4">
            <motion.button whileTap={{ scale: 1.3 }} onClick={likePost} className="flex items-end gap-1">
              <div className={`size-6`}>{like?.includes(user)?<LikeFill/>:<Like/>}</div>
            </motion.button>

            <div className={`size-6`}><Comment/></div>
            <div className={`size-6`}><Send/></div>
          </div>

          <motion.button whileTap={{ scale: 1.3 }}>
            <div className={`size-6`}><Save/></div>
          </motion.button>
        </div>

        {/* Likes & Caption */}
        <div className="px-4 pt-2">
          <p className="text-sm font-semibold ">{likecount} likes</p>

          <p className="text-sm mt-1">
            <span className="font-semibold">{name}</span>{" "}
            <span className="secondary_text">{file.title}</span>
          </p>

          <div className=" w-full ">
            <Readmore text={file.message} maxLength={0} />
          </div>

          <div className='space-x-1 truncate'>
            {file.tags.map((tag, index) => (
              <span key={index} className="text-blue-500 hover:text-blue-600 text-sm hover:underline hover:underline-offset-1 cursor-pointer">
                {tag}
              </span>
            ))}
          </div>

          <p className="text-xs muted_text mt-1 uppercase">{timeAgo(file.createdAt.toString())}</p>
        </div>
        
      </motion.div>

      {show && 
        <div className="top-0 left-0 absolute z-50 backdrop-blur-sm py-10 p-5 w-full max-w-[700px] h-full">
          <div className="flex justify-center rounded-md bg-red-600 size-8 items-center" onClick={()=>setShow(false)}>X</div>
          <FileDropdown title={file.title} url={file.pictureURL} filename={file.originalname}/>
        </div>
      }

    </AnimatePresence>
  )
}

export default PostCard