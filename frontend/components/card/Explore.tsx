'use client'

import { getexplorepostpageintion } from "@/queries/Queries";
import { useLazyQuery } from "@apollo/client";
import { useEffect, useId, useRef, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import ExploreGrid from "../ExploreGrid";
import { Posts } from "@/Types/types";
import { getUserPosts } from "@/utils/clientApollo";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { addPosts, increaseSkip, setScrollPosition, resetSkip } from "@/state/exploreSlice";

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
  const dispatch = useDispatch();
  const scrollPosition = useSelector(
    (state: RootState) => state.explore.scrollPosition
  );
  const posts = useSelector((state: RootState) => state.explore.posts);
  const skip = useSelector((state: RootState) => state.explore.skip);
  const hasMore = useSelector((state: RootState) => state.explore.hasMore);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState<Posts>(p);
  
  const fetchMore = async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    const posts = await getUserPosts({ userId, skip, getuserPost });
    const newPosts = posts || [];
    if (newPosts) {
      dispatch(addPosts(newPosts));
    }
    setLoading(false);
  };
  
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    dispatch(setScrollPosition(scrollTop));

    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
      dispatch(increaseSkip());
    }
  };
  
  useEffect(() => {
    if (scrollRef.current && posts.length > 0) {
      scrollRef.current.scrollTo({
        top: scrollPosition,
        behavior: "auto", // IMPORTANT: not smooth
      });
    }
  }, [posts]);
         
  useEffect(() => {
    setLoading(false)
    if (posts.length === 0) {
      dispatch(resetSkip());
      fetchMore();
    }
  }, []);
  
  useEffect(() => {
    if (skip !== 0) {
      fetchMore();
    }
  }, [skip])

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
