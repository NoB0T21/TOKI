'use client'
import { gethomepostpageintion } from '@/queries/Queries';
import { useLazyQuery } from '@apollo/client';
import { Posts2 } from '@/Types/types';
import { useEffect, useRef, useState } from 'react'
import { getFollowingPosts } from '@/utils/clientApollo';
import PostCard from './PostCard';

const Home = ({ids}:{ids:string[]}) => {
  const [posts,setPosts] = useState<Posts2[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [play, setPlay] = useState(true);
  const [getfollowingPost] = useLazyQuery(gethomepostpageintion)
  const [skip, setSkip] = useState(0);
   const containerRef = useRef<HTMLDivElement>(null)
    const currentIndex = 0

  const fetchMore = async () => {
    if (!hasMore) return;
  
    const homeposts = await getFollowingPosts({ids,skip,getfollowingPost})

    const newPosts = homeposts || [];
    if (newPosts.length < 10 ) {
      setHasMore(false); // No more posts to fetch
    }
    if (newPosts.length) {
      setPosts((prev) => {
        const merged = [...prev, ...homeposts];
        const unique = Array.from(
          new Map(merged.map((p) => [p.id, p])).values()
        );
        //const unique = [...new Set(merged)]
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

  const handlepaly = (play:boolean) => {
    setPlay(play)
  }
      
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
    <div ref={containerRef} onScroll={handleScroll} className='gap-1 rounded-md px-2 scroll-smooth grid grid-cols-1 w-full bg-[#1a1e23] pb-5 h-[78vh] overflow-y-scroll snap-mandatory snap-y'>
      {posts.map((post:Posts2)=>(
        <PostCard onSelect={handlepaly} key={post.id} play={play} followings={post.follower.count} file={post} profile={post.user.picture} name={post.user.name} userID={post.user.id}/>
      ))}
    </div>
  )
}

export default Home
