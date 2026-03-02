'use client'

import { useEffect, useState } from "react";
import { User } from "@/Types/types";
import { followusers, getProfileFollowingdata, removeusers } from "@/utils/clientAction";
import Image from "next/image";
import Cookies from "js-cookie"
import Toasts from "../toasts/Toasts";
import Link from 'next/link'
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { addPosts, increaseSkip, removeUserById } from "@/state/profileFollowers";
import { adduserProfileFollowers, increaseSkipofuserProfileFollowers } from "@/state/userProfileFollowers";
import { useParams } from "next/navigation";

interface Following{
    followinglist:string[],
    userid?: string
}

function paginateIds(ids: string[], page: number, limit: number=3) {
  const start = (page - 1) * limit;
  const end = start + limit;
  return ids.slice(start, end);
}

const Followers = ({followinglist,userid}:Following) => {
  const params = useParams();
  const userId = params.type?.toString() || '';
  const dispatch = useDispatch();
  const token = Cookies.get('token');
  const userID = Cookies.get('user') || '';
  const users = useSelector((state: RootState) => userid ? state.userProfileFollowers.userprofileFollowing :state.profileFollowers.profileFollowers);
  const [following, setFollowing ] = useState<string[]>(followinglist)
  const skip = useSelector((state: RootState) => userid ? state.userProfileFollowers.skip :state.profileFollowers.skip);
  const hasMore = useSelector((state: RootState) => userid ? state.userProfileFollowers.hasMore :state.profileFollowers.hasMore);
  const [showToast,setShowToast] = useState<boolean>(false)
  const [responseMsg,setResponseMsg] = useState<string>('')
  if(followinglist.length===0){
      return(<div className="font-bold text-2xl">Go get life on one follows you</div>)
  }

  const fetchMore = async () => {
    if (!hasMore) return;
    const followinguser = await getProfileFollowingdata(paginateIds(followinglist, skip, 14), skip, 14)
    
    const newPosts = followinguser || [];
    if (newPosts.length) dispatch(userid ? adduserProfileFollowers(followinguser):addPosts(followinguser));
  }

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (Math.round(scrollTop + clientHeight) >= scrollHeight && hasMore) {
      dispatch(userid ? increaseSkipofuserProfileFollowers():increaseSkip());
    }
  };
    
  useEffect(() => {
    fetchMore();
  }, [skip]);
  
  const removeuser = async ({CreatorId}:{CreatorId:string}) => {    
    if(!token)return

    const data = await removeusers({CreatorId})
    if(data.status === 200) {
      setShowToast(true)
      dispatch(removeUserById(CreatorId));
      
      setResponseMsg("user removed successfully")
      setTimeout(() => {
          setShowToast(false)
        }, 3000);
      return
    }
  }

  const followuser = async ({CreatorId}:{CreatorId:string}) => {    
      if(!token)return
      const follow = await followusers({CreatorId})
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
    <div className="py-10 w-110 lg:w-150 h-screen">
      <div className="flex flex-col gap-7 bg-[#1a1e23] mb-5 p-3 border-[#3e4a57] border rounded-2xl w-full h-full">
        <h1 className="font-semibold text-2xl">Follower</h1>
        {!users ? <>
          <div className="flex items-center justify-center h-full">
            Loading...
          </div>
        </> : <>
          <div 
            onScroll={handleScroll} 
            className="space-y-3 w-full min-h-0 overflow-y-auto"
          >
            {users.map((user: User)=>(
                <div  key={user.id} className="bg-zinc-900 px-7 rounded-md w-full h-15 overflow-hidden">
                    <div className="flex justify-between items-center w-full h-full">
                        <Link href={`/user/${user._id}`} className="flex items-center gap-4 h-full">
                          <Image
                            src={user.picture}
                            alt="Post"
                            width={700}
                            height={700}
                            className="bg-black rounded-full size-12 object-contain md:object-cover"
                          />
                          {user.name}
                        </Link>
                         <p>
                          {user.follower && following.includes(userID)?'message':'FollowBack'}
                         </p>
                        {!userId && (userID !== user._id ? 
                        <div className="px-2 border-1 rounded-md" onClick={()=>removeuser({CreatorId:user._id})}>remove</div>
                        : 'helo')}
                        {userId && (userId !== user.id ? 
                          <div className="px-2 border-1 rounded-md" onClick={()=>followuser({CreatorId:user._id})}>{following.includes(userId)?'Following':'Follow'}</div>
                        : '')}
                    </div>
                </div>
            ))}
          </div>
        </>}
      </div>
      {showToast && <Toasts type={'successMsg'} msg={responseMsg}/>}
    </div>
  )
}

export default Followers
