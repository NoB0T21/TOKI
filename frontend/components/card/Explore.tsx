'use client'

import { getexplorepostpageintion } from "@/queries/Queries";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import ExploreGrid from "../ExploreGrid";
import { Posts } from "@/Types/types";
import { getUserPosts } from "@/utils/clientApollo";

const p = {
    id: '',
    pictureURL: '',
    message:'',
    title:'',
    tags: [],
    song:{
        title: '',
        artist: '',
        previewUrl: '',
      },
    start:0,
    end:60,
    like:{
      like: [],
      likeCount: 0
    }, 
    following:{
      count:[]
    },
    follower:{
      count:[]
    },
    user:{
      id: '',
      picture: '',
      name:''
    }
  }

const Explore = () => {
  const userId = Cookies.get('user') || ''
  const [getuserPost] = useLazyQuery(getexplorepostpageintion)
  const [posts,setPosts] = useState<Posts[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [skip, setSkip] = useState(0);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<Posts>(p);
  
  const fetchMore = async () => {
  if (!hasMore || loading) return;
  setLoading(true);

  const posts = await getUserPosts({ userId, skip, getuserPost });

  const newPosts = posts || [];
  if (newPosts.length < 10) setHasMore(false);

  if (newPosts.length) {
    setPosts(prev => {
      const merged = [...prev, ...posts];
      const unique = Array.from(new Map(merged.map(p => [p.id, p])).values());
      return unique;
    });
  }
  setLoading(false);
};
  
  const handleScroll = () => {
    const el = scrollRef.current;
  if (!el) return; 

  const { scrollTop, scrollHeight, clientHeight } = el;
  if (scrollTop + clientHeight >= scrollHeight -100) {
    setSkip(prev => prev + 1);
  }
  };
  
  useEffect(() => {
    fetchMore();
  }, [skip]);

         
  return (
    <div onScroll={handleScroll} ref={scrollRef} className={`gap-1 ${(posts.length > 0 && !post.id) ? 'grid' : 'flex'} grid-cols-4 grid-flow-dense auto-rows-[80px] md:auto-rows-[150px] w-full h-full overflow-y-scroll`}>
      {(posts.length > 0 && !post.id)? posts.map((post,index)=>(
        <div 
          key={post.id}
          onClick={()=>{
            setPost(post);
          }}
          className={`${index % 7 === 0 ? 'col-span-2 row-span-2 ' : ''} w-full h-full`}>
            <Image
              src={post.pictureURL}
              alt="Post"
              width={1920}
              height={1080}
              className={` rounded-md w-full h-full object-cover`}
            />
        </div>
      )) : <div className={`w-full h-full ${post.id ? 'hidden' : 'flex'} justify-center items-center`}>There is problem with server</div>}
      {post.id && 
        <div className="flex flex-col justify-start gap-2 w-full h-full">
          <div onClick={()=>{
            setPost(p);
          }} className="flex justify-center items-center bg-red-500 p-2 rounded-md size-6 md:size-8 text-2xl">
            <p>x</p>
          </div>
          <ExploreGrid post={post} Likes={post.like.like} LikeCount={post.like.likeCount} Following={post.follower.count}/>
        </div>
      }
    </div>
  )
}

export default Explore
