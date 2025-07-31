'use client'

import { getpostpageintion } from '@/queries/Queries';
import {useLazyQuery} from '@apollo/client'
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import ProfileData from './ProfileData';
import ProfileNav from './navigation/ProfileNav';
import PostCard from './card/PostCard';
import Image from 'next/image';
import { getUserPosts2 } from '@/utils/clientApollo';
import { Posts, User2 } from '@/Types/types';

const Userprofile = ({userId , user}:{userId:string,user:User2}) => {
  const router = useRouter();
  const [posts,setPosts] = useState<Posts[]>([]);
  const [skip, setSkip] = useState(0);
  const [postId, setPostId] = useState('');
  const [count ,setCount]=useState<number|undefined>(!user.postcount?0:user.postcount.postcount)
  const [show, setShow] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [getuserPost] = useLazyQuery(getpostpageintion)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentIndex = posts.findIndex((post) => post.id === postId)

  const fetchMore = async () => {
    if (!hasMore) return;

    const userposts = await getUserPosts2({userId,skip,getuserPost})
  
    const newPosts = userposts || [];
    if (newPosts.length < 10 ) {
      setHasMore(false);
    }
    if (newPosts.length) {
      setPosts((prev) => {
        const merged = [...prev, ...userposts];
        const unique = Array.from(
          new Map(merged.map((p) => [p.id, p])).values()
        );
        return unique;
      });
    }
    
    router.refresh();
  }
  
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
      setSkip(prev => prev + 1);
      setCount(!user.postcount.postcount?user.postcount.postcount:0)
    }
  };
  
  useEffect(() => {
    fetchMore();
  }, [skip]);
  
  useEffect(() => {
    if (containerRef.current) {
      const postElement = containerRef.current.children[currentIndex] as HTMLElement
      postElement?.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' })
    }
  }, [currentIndex])


  return (
    <>
      {!show && 
      <>
        <ProfileData 
          id={user.id}
          picture={user.picture} 
          posts={count} 
          follower={user.follower.followerCount} 
          following={user.following.folloingCount}
          followinglist={user.following.count}
          followerlist={user.follower.count}
        />
        <div className='top-12 z-3 sticky'>
          <ProfileNav/>
        </div>
        <div onScroll={handleScroll} className="gap-1 grid grid-cols-3 md:grid-cols-4 mt-5 w-full h-2/3 overflow-y-scroll">
          {posts.map((f:any)=>(
            <div key={f.id} onClick={()=>{setShow(true);setPostId(f.id)}} className="rounded-md w-full h-30 sm:h-70 overflow-hidden">
            <div className="w-full h-full">
              <Image
                src={f.pictureURL}
                alt="Post"
                width={1920}
                height={1080}
                className="bg-black rounded-md w-full h-full object-cover"
              />
              </div>
            </div>
            ))} 
          </div>
      </>}
      {show && 
      <div className='py-5 w-full h-full'>
        <h1 className='top-1 z-9 sticky flex gap-3 font-bold text-2xl'>
          <div onClick={()=>setShow(false)}>back</div> Posts
        </h1>
        <div ref={containerRef} onScroll={handleScroll} className="gap-4 grid mt-5 w-full h-[80vh] overflow-y-scroll scroll-smooth snap-mandatory snap-y">
          {posts.map((f:any)=>(
            <PostCard key={f.id} followings={user.follower.count} file={f} profile={user.picture} name={user.name} userID={userId}/>
          ))} 
        </div>
      </div>}
    </>
  )
}

export default Userprofile
