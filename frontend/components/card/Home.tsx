'use client'
import { gethomepostpageintion } from '@/queries/Queries';
import { useLazyQuery } from '@apollo/client';
import { Posts2 } from '@/Types/types';
import { useEffect, useState } from 'react'
import { getFollowingPosts } from '@/utils/clientApollo';
import PostCard from './PostCard';

const Home = ({ids}:{ids:string[]}) => {
  const [posts,setPosts] = useState<Posts2[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [getfollowingPost] = useLazyQuery(gethomepostpageintion)
  const [skip, setSkip] = useState(0);

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
      
  useEffect(() => {
      fetchMore();
  }, [skip]);
  
  return (
    <div onScroll={handleScroll} className='gap-1 grid grid-cols-1 w-full h-[80vh] overflow-y-scroll'>
      {posts.map((post:Posts2)=>(
        <PostCard key={post.id} followings={post.follower.count} file={post} profile={post.user.picture} name={post.user.name} userID={post.user.id}/>
      ))}
    </div>
  )
}

export default Home
