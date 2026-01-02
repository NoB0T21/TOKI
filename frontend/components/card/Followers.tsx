'use client'

import { getfollowinguser } from "@/queries/Queries"
import { useLazyQuery } from "@apollo/client"
import { useEffect, useState } from "react";
import { User } from "@/Types/types";
import { getFollowingList } from "@/utils/clientApollo";
import { removeusers } from "@/utils/clientAction";
import Image from "next/image";
import Cookies from "js-cookie"
import Toasts from "../toasts/Toasts";

interface Following{
    followinglist:string[],
    user:any
}

const Followers = ({followinglist,user}:Following) => {
  const token = Cookies.get('token');
  const userID = Cookies.get('user') || '';
  const [getuserList] = useLazyQuery(getfollowinguser)
  const [hasMore, setHasMore] = useState(true);
  const [users,setUsers] = useState<User[]>([]);
  const [skip, setSkip] = useState(0);
  const [following, setFollowing ] = useState<string[]>()
  const [showToast,setShowToast] = useState<boolean>(false)
  const [responseMsg,setResponseMsg] = useState<string>('')
  if(followinglist.length===0){
      return(<div className="font-bold text-2xl">Go get life on one follows you</div>)
  }

  const fetchMore = async () => {
    if (!hasMore) return;

    const followinguser = await getFollowingList({followinglist,skip,getuserList})

    const newPosts = followinguser || [];
      if (newPosts.length < 10 ) {
        setHasMore(false);
      }
      if (newPosts.length) {
        setUsers((prev) => {
          const merged = [...prev, ...followinguser];
          const unique = Array.from(
            new Map(merged.map((p) => [p.id, p])).values()
          );
        return unique;
      });
    }
  }

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
      setSkip(prev => prev + 1);
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
      const currentLikes = Array.isArray(following) ? following : [];
      const index = currentLikes.indexOf(userID);
      let updatedFollow;
      
      if (index === -1) {
        updatedFollow = [...currentLikes, userID];
        //setLikeCount(prev => prev + 1);
      } else {
        updatedFollow = currentLikes.filter(id => id !== userID);
        //setLikeCount(prev => (prev > 0 ? prev - 1 : 0));
      }
      
      setFollowing(updatedFollow);
      setResponseMsg(data.data.message)
      setTimeout(() => {
          setShowToast(false)
        }, 3000);
      return
    }
  }

  return (
    <div className="py-10 w-110 lg:w-150 h-full">
      <div className="flex flex-col items-center gap-7 bg-[#1a1e23] mb-5 p-3 border-[#3e4a57] border-1 rounded-2xl w-full h-full">
        <h1 className="font-semibold text-2xl">Follower</h1>
        <div onScroll={handleScroll} className="flex flex-col gap-3 w-full h-full">
            {users.map((user: User)=>(
                <div key={user.id} className="bg-zinc-900 px-7 rounded-md w-full h-15 overflow-hidden">
                    <div className="flex justify-between items-center w-full h-full">
                        <div className="flex items-center gap-4 h-full">
                          <Image
                            src={user.picture}
                            alt="Post"
                            width={700}
                            height={700}
                            className="bg-black rounded-full size-12 object-contain md:object-cover"
                          />
                          {user.name}
                        </div>
                         
                        {userID !== user.id ? 
                        <div className="px-2 border-1 rounded-md" onClick={()=>removeuser({CreatorId:user.id})}>remove</div>
                        : 'helo'}
                    </div>
                </div>
            ))}
        </div>
      </div>
      {showToast && <Toasts type={'successMsg'} msg={responseMsg}/>}
    </div>
  )
}

export default Followers
