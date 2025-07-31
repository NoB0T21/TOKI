'use client'
import { Like, LikeFill } from "../Icons"
import { useState } from "react"
import {motion} from 'motion/react'
import { Posts2 } from "@/Types/types"
import { followusers, likePosts } from "@/utils/clientAction"
import Image from "next/image"
import Readmore from "../Readmore"
import Cookies from "js-cookie"
import FileDropdown from "./FileDropdown"

const PostCard = ({file, profile, name, userID,followings}:{file:Posts2, profile:string, name:string, userID:string, followings:string[]}) => {
  const user = Cookies.get('user') || '';
  const [like, setLike ] = useState<string[]>(file?.like?.like)
  const [show,setShow]=useState(false)
  const [likecount, setLikeCount ] = useState<number>(file?.like?.likeCount)
  const [following, setFollowing ] = useState<string[]>(followings)
  
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

  return (
    <>
      <div key={file.id} className="relative bg-black my-1 sm:my-6 py-3 rounded-md w-full md:w-160 h-[60vh] sm:h-[70vh] overflow-y-auto snap-always snap-center scrollbar">
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center my-3 px-2">
              <Image
                src={profile}
                alt="Post"
                width={500}
                height={500}
                className="rounded-full size-[30px] sm:size-11 object-cover"
              />
                <div className="flex items-center gap-3 px-2">
                  <div className="truncate">{name}</div>
                </div>
            </div>
            <div className="flex justify-between items-center p-5 w-full h-full">
                {userID===user?
                <p onClick={()=>setShow(true)}>...</p>
                :
                <motion.div
                  whileTap={{ scale: 0.7 }}
                  onClick={followuser}
                  className="right-5 absolute flex items-center px-2 border-1 rounded-md"
                >{following?.includes(user)?'Following':'Follow'}</motion.div>}
            </div>
          </div>
          <Image
              src={file.pictureURL}
              alt="Post"
              width={3840}
              height={2160}
              className="rounded-md w-full h-2/3 object-cover"
          />
        <div className="px-1 py-2 w-full h-25">
          <motion.div
            whileTap={{ scale: 0.7 }}
            onClick={() =>likePost()} 
            className="flex gap-3 w-7"
          >
            <div className="flex gap-1"><div className={`size-6 sm:size-7 `}>{like?.includes(user)?<LikeFill/>:<Like/>}</div><p className='font-semibold'>{likecount}</p></div>
          </motion.div>
          <div className='flex justify-start mx-1mt-1 p-1'>
                {file.tags.map((tag, index) => (
                    <span key={index} className="flex items-center text-blue-500 hover:text-blue-600 text-sm hover:underline hover:underline-offset-1 cursor-pointer">
                        {tag}
                    </span>
                ))}
            </div>
          <div className="">
            <Readmore text={file.message} maxLength={30} />
          </div>
        </div>
      </div>
      {show && 
        <div className="top-0 left-0 absolute backdrop-blur-sm p-5 w-full h-full">
          <div className="flex justify-end" onClick={()=>setShow(false)}>X</div>
          <FileDropdown title={file.title} url={file.pictureURL} filename={file.originalname}/>
        </div>
      }
    </>
  )
}

export default PostCard
