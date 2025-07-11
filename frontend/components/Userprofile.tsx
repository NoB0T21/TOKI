'use client'
import { getpostpageintion } from '@/queries/Queries';
import {useLazyQuery} from '@apollo/client'
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { ProfileHeader } from './navigation/Header';
import ProfileData from './ProfileData';
import ProfileNav from './navigation/ProfileNav';
import PostCard from './card/PostCard';
import { useRouter } from 'next/navigation';

interface Posts {
  id:string,
    pictureURL: string,
    creator:string
    message:string,
    title:string,
    owner:string,
    tags: [],
    originalname:string,
    like:{
        like:string[]
        likeCount:number
    }
}

interface User {
  follower: {
    count: string[]
    followerCount:number
  },
  following:{ 
    count: string[]
    folloingCount:number
  },
  id: string,
  name: string,
  picture: string,
  postcount:{
    postcount: number|undefined
  }
}

const Userprofile = ({userId , user}:{userId:string,user:User}) => {
  const [posts,setPosts] = useState<Posts[]>([]);
  const [skip, setSkip] = useState(0);
  const [postId, setPostId] = useState('');
  const [count ,setCount]=useState<number|undefined>(!user.postcount?0:user.postcount.postcount)
  const [show, setShow] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [getuserPost] = useLazyQuery(getpostpageintion)
  const containerRef = useRef<HTMLDivElement>(null)
  const currentIndex = posts.findIndex((post) => post.id === postId)
  const router = useRouter();
  const fetchMore = async () => {
    if (!hasMore) return;
    const { data } = await getuserPost({
      variables: {
        owner: userId,
        offset: skip*10,
        limit: 10,
      },
    })
    
    const newPosts = data?.posts || [];
    if (newPosts.length < 10 ) {
      setHasMore(false); // No more posts to fetch
    }
    if (newPosts.length) {
      setPosts((prev) => {
        const merged = [...prev, ...data.posts]; // Merge old and new posts
        const unique = Array.from(
          new Map(merged.map((p) => [p.id, p])).values() // Deduplicate by post.id
        );
        return unique; // Set state with only unique posts
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
        <ProfileHeader name={user.name}/>
        <ProfileData 
          picture={user.picture} 
          posts={count} 
          follower={user.follower.followerCount} 
          following={user.following.folloingCount}
          followinglist={user.following.count}
        />
        <div className='top-12 z-3 sticky'>
          <ProfileNav/>
        </div>
        <div onScroll={handleScroll} className="gap-4 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 mt-5 w-full h-2/3 overflow-y-scroll">
          {posts.map((f:any)=>(
            <div key={f.id} onClick={()=>{setShow(true);setPostId(f.id)}} className="bg-[rgba(84,84,84,0.6)] md:bg-[rgba(84,84,84,0.4)] backdrop-blur-xl rounded-md w-full h-70 overflow-hidden">
            <div className="w-full h-full">
              <Image
                src={f.pictureURL}
                alt="Post"
                width={1920}
                height={1080}
                className="bg-black rounded-md w-full h-full object-contain md:object-cover"
              />
              </div>
            </div>
            ))} 
          </div>
      </>}
      {show && 
      <>
        <h1 className='flex gap-3 font-bold text-2xl'><div onClick={()=>setShow(false)}>/</div> Posts</h1>
        <div ref={containerRef} onScroll={handleScroll} className="gap-4 grid mt-5 w-full h-[80vh] overflow-y-scroll scroll-smooth snap-mandatory snap-y">
          {posts.map((f:any)=>(
            <PostCard key={f.id} followings={user.following.count} file={f} profile={user.picture} name={user.name} userID={userId}/>
          ))} 
        </div>
      </>}
    </>
  )
}

export default Userprofile
