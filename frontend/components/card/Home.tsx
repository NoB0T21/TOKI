'use client'
import { Posts2 } from '@/Types/types';
import { useEffect, useRef, useState } from 'react'
import PostCard from './PostCard';
import { NoPosts } from '../Icons';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { addPosts, increaseSkip, setScrollPosition } from "@/state/feedSlice";
import { getProfilePosts } from '@/utils/clientAction';
import StoryBar from '@/components/story/StoryBar'

const Home = ({ids}:{ids:string[]}) => {
  const dispatch = useDispatch();
  const scrollPosition = useSelector(
    (state: RootState) => state.feed.scrollPosition
  );
  const posts = useSelector((state: RootState) => state.feed.posts);
  const skip = useSelector((state: RootState) => state.feed.skip);
  const hasMore = useSelector((state: RootState) => state.feed.hasMore);
  const [play, setPlay] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null)
  const fetchMore = async () => {
    if (!hasMore) return;
    const homeposts = await getProfilePosts(ids,skip);

    const newPosts = homeposts || [];

    dispatch(addPosts(newPosts));
  };
  
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    dispatch(setScrollPosition(scrollTop));

    if (Math.round(scrollTop + clientHeight) >= scrollHeight && hasMore) {
      dispatch(increaseSkip());
    }
  };

  useEffect(() => {
    if (containerRef.current && posts.length > 0) {
      containerRef.current.scrollTo({
        top: scrollPosition,
        behavior: "auto",
      });
    }
  }, [posts]);

  const handlepaly = (play:boolean) => {
    setPlay(play)
  }

  useEffect(() => {
    if (posts.length === 0) {
      fetchMore();
    }
  }, []);

  
  useEffect(() => {
    if (skip !== 0) {
      fetchMore();
    }
  }, [skip])
  
  return (
    <div ref={containerRef} onScroll={handleScroll} className='scroll-smooth grid grid-cols-1 w-full pb-5 h-screen overflow-y-scroll'>
      <StoryBar ids={ids}/>
      {posts.length > 0 ? 
        posts.map((post:Posts2)=>(
          <PostCard onSelect={handlepaly} key={post.id} play={play} followings={post.follower.count} file={post} profile={post.user.picture} name={post.user.name} userID={post.user.id}/>
        )) : 
        <div className='text:2xl md:text-4xl flex flex-col justify-center items-center text-[#8a8a8a]'>
          <div className='size-9 md:size-12'><NoPosts/></div>
          Follow to see posts
        </div>
      }
    </div>
  )
}

export default Home
