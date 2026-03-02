'use client'
import { gethomepostpageintion } from '@/queries/Queries';
import { useLazyQuery } from '@apollo/client';
import { Posts2 } from '@/Types/types';
import { useEffect, useRef, useState } from 'react'
import { getFollowingPosts } from '@/utils/clientApollo';
import PostCard from './PostCard';
import { NoPosts } from '../Icons';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { addPosts, increaseSkip, setScrollPosition } from "@/state/feedSlice";

const Home = ({ids}:{ids:string[]}) => {
  const dispatch = useDispatch();
  const scrollPosition = useSelector(
    (state: RootState) => state.feed.scrollPosition
  );
  const posts = useSelector((state: RootState) => state.feed.posts);
  const skip = useSelector((state: RootState) => state.feed.skip);
  const hasMore = useSelector((state: RootState) => state.feed.hasMore);
  const [play, setPlay] = useState(true);
  const [getfollowingPost] = useLazyQuery(gethomepostpageintion)
  const containerRef = useRef<HTMLDivElement>(null)

  const fetchMore = async () => {
    if (!hasMore) return;
    console.log('yppp')
    const homeposts = await getFollowingPosts({
      ids,
      skip,
      getfollowingPost,
    });

    const newPosts = homeposts || [];

    if (newPosts.length > 0) {
      dispatch(addPosts(newPosts));
    }
  };
  
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    dispatch(setScrollPosition(scrollTop));

    if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
      dispatch(increaseSkip());
    }
  };

  useEffect(() => {
    if (containerRef.current && posts.length > 0) {
      containerRef.current.scrollTo({
        top: scrollPosition,
        behavior: "auto", // IMPORTANT: not smooth
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
    <div ref={containerRef} onScroll={handleScroll} className='gap-1 rounded-md px-2 scroll-smooth grid grid-cols-1 w-full bg-[#1a1e23] pb-5 h-[77%] sm:h-[78vh] overflow-y-scroll snap-mandatory snap-y'>
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
