'use client'
import { Like, LikeFill, Music, Mute, Playaudio } from "../Icons"
import { useEffect, useRef, useState } from "react"
import {motion, AnimatePresence} from 'motion/react'
import { Posts2 } from "@/Types/types"
import { followusers, likePosts } from "@/utils/clientAction"
import Image from "next/image"
import Readmore from "../Readmore"
import Cookies from "js-cookie"
import FileDropdown from "./FileDropdown"
import Link from "next/link"

const PostCard = ({file, profile, name, userID,play,followings,onSelect}:{file:Posts2, profile:string,play:boolean, name:string, userID:string, followings:string[],onSelect:(play: boolean) => void}) => {
  const user = Cookies.get('user') || '';
  const [like, setLike ] = useState<string[]>(file?.like?.like)
  const [show,setShow]=useState(false)
  const [likecount, setLikeCount ] = useState<number>(file?.like?.likeCount)
  const [following, setFollowing ] = useState<string[]>(followings)
  const audioRef = useRef<HTMLAudioElement>(null);
  const [url, setUrl ] = useState<string>('gg')
  const [paused, setPaused] = useState(true);
  
  const likePost = async () => {
    const data = await likePosts({id:file.id})
    if(data.status === 200) {
      const currentLikes = Array.isArray(like) ? like : [];
      const index = currentLikes.indexOf(user);
      let updatedLikes;
      if (index === -1) {
        updatedLikes = [...currentLikes, user]; // Add like
        setLikeCount(prev => prev + 1);
      } else {
        updatedLikes = currentLikes.filter(id => id !== user); // Remove like
        setLikeCount(prev => (prev > 0 ? prev - 1 : 0));
      }
      setLike(updatedLikes);
    }
  }

  const followuser = async () => {
     const data = await followusers({CreatorId:file.owner})
    if(data.status === 200) {
      const currentLikes = Array.isArray(following) ? following : [];
      const index = currentLikes.indexOf(user);
      let updatedFollow;

      if (index === -1) {
        updatedFollow = [...currentLikes, user]; // Add like
        //setLikeCount(prev => prev + 1);
      } else {
        updatedFollow = currentLikes.filter(id => id !== user); // Remove like
        //setLikeCount(prev => (prev > 0 ? prev - 1 : 0));
      }

      setFollowing(updatedFollow);
    }
  }

  const audio = () => {
    if (!audioRef.current) return;
  
    const a = audioRef.current;
    if(!play){
      a.pause();
      return
    }
  
    a.currentTime = file.start;
  
    const onTime = () => {
      if (a.currentTime >= file.end) {
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

  return (
    <AnimatePresence mode="wait">
      <motion.div
        whileInView={{opacity:1}}
        onViewportEnter={()=>{audio();setUrl(`${file.song?.previewUrl}`)}}
        onViewportLeave={()=>{setUrl('gg');audioRef.current?.pause()}}
        viewport={{amount: 0.8 }}
        key={file.id} 
        className="relative bg-black my-1 sm:my-3 py-1 rounded-md w-full snap-start"
      >
          <div className="flex justify-between items-center w-full">
            <Link href={`/user/${file.owner}`} className="flex w-2/3 items-center sm:my-3 px-2">
              <Image
                src={profile}
                alt="Post"
                width={500}
                height={500}
                className="rounded-full size-[30px] sm:size-10 xl:size-12 object-cover"
              />
                <div className="flex flex-col text-sm md:text-md justify-center px-2">
                  <div className="truncate px-2">{name}</div>
                {file.song &&
                  <>
                    {file.song.previewUrl&&<audio autoPlay ref={audioRef} src={`${url}`}/>}
                    <div className='flex gap-1 text-xs md:text-sm items-center'>
                        <p className='size-5 sm:size-6 animate-spin'><Music/></p>
                        <p>{file.song.title} - {file.song.artist}</p>
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
                  className="right-5 absolute animated-gradient hover:animate-wiggle flex items-center px-2 border-1 rounded-md"
                >{following?.includes(user)?'Following':'Follow'}</motion.div>}
            </div>
          </div>

          <Image
              src={file.pictureURL}
              alt="Post"
              width={3840}
              height={2160}
              className="rounded-md max-w-screen w-full mt-1 aspect-video object-cover"
          />
          <div className="absolute top-[30px] sm:top-10 xl:top-12 my-7 p-2 flex justify-end items-end w-full aspect-video">
            {file.song?.previewUrl && (
              <div
                onClick={() => {
                  if (!audioRef.current) return;
                  if (paused) {
                    audioRef.current.play();
                    onSelect(true)
                  } else {
                    audioRef.current.pause();
                    onSelect(false)
                }}}
                
                className=" bg-[#1d1c1c9d] z-50 size-6 sm:size-7 sm:mx-1 rounded-full p-1"
              >
                {paused ? <Mute /> : <Playaudio />}
              </div>
            )}
          </div>

        <div className="px-1 py-2 w-full ">
          <motion.div
            whileTap={{ scale: 0.7 }}
            onClick={() =>likePost()} 
            className="flex gap-3 w-7"
          >
            <div className="flex gap-1"><div className={`size-6`}>{like?.includes(user)?<LikeFill/>:<Like/>}</div><p className='text-[#b0bec5]'>{likecount}</p></div>
          </motion.div>
          <div className='space-x-1 mx-1 mt-1 p-1 truncate'>
            {file.tags.map((tag, index) => (
              <span key={index} className="text-blue-500 hover:text-blue-600 text-sm hover:underline hover:underline-offset-1 cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
            <Readmore text={file.message} maxLength={30} />
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
