'use client'

import Image from "next/image";
import { useState } from "react";
import Cookies from "js-cookie"
import { followusers } from "@/utils/clientAction";
import Toasts from "../toasts/Toasts";
import Link from "next/link";

interface Following{
    followinglist:string[],
    id:string
}

const Following = ({user}:any) => {
  const token = Cookies.get('token');
  const userId = Cookies.get('user') || '';
  const [following, setFollowing ] = useState<string[]>(user.follower.count[0])
  const [showToast,setShowToast] = useState<boolean>(false)
  const [responseMsg,setResponseMsg] = useState<string>('')
  const followuser = async ({CreatorId}:{CreatorId:string}) => {    
    if(!token)return
    const follow = await followusers({CreatorId:user._id})
    if(follow.status === 200) {
      const currentLikes = Array.isArray(following) ? following : [];
      const index = currentLikes.indexOf(userId);
      let updatedFollow;

      if (index === -1) {
        updatedFollow = [...currentLikes, userId];
      } else {
        updatedFollow = currentLikes.filter(id => id !== userId);
      }

      setFollowing(updatedFollow);
      setShowToast(true)
      setResponseMsg(follow.data.message)
      setTimeout(() => {
        setShowToast(false)
      }, 3000);
      return
    }
  }

  return (
    <div key={user.id} className="bg-zinc-900 px-7 rounded-md w-full h-15 overflow-hidden">
      <div className="flex justify-between items-center w-full h-full">
        <Link href={`/user/${user.id}`} className="flex items-center gap-4 h-full">
          <Image
            src={user.picture}
            alt="Post"
            width={700}
            height={700}
            className="bg-black rounded-full size-12 object-contain md:object-cover"
          />
          {user.name}
        </Link>
        {userId !== user.id ? 
        <div className="px-2 border-1 rounded-md" onClick={()=>followuser({CreatorId:user.id})}>{following.includes(userId)?'Following':'Follow'}</div>
        : ''}
      </div>
      {showToast && <Toasts type={'successMsg'} msg={responseMsg}/>}
    </div>
  )
}

export default Following
