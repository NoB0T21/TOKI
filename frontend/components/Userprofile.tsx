'use client'

import { useEffect, useState } from 'react';
import ProfileData from './ProfileData';
import ProfileNav from './navigation/ProfileNav';
import { Posts, User2 } from '@/Types/types';
import { useUserdata } from '@/utils/actions';
import Link from 'next/link';
import { motion } from 'motion/react';
import PostViewer from './PostViewer';
import { getProfilePostowner } from '@/utils/clientAction';

const Userprofile = ({userid}:{userid?: string}) => {
  const { data } = useUserdata(userid||'')
  const userId = data?.userId ||''
  
  const [posts,setPosts] = useState<Posts[]>([]);
  const [skip, setSkip] = useState(1);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const user: User2 = data?.res.user
  const p: Posts[] = data?.res.posts

  const fetchMore = async () => {
    if (!hasMore || !userId) return;

    const userposts = await getProfilePostowner(skip)
  
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
  }

  useEffect(() => {
    if (user?.postcount?.postcount !== undefined) {
      setPosts(p)
    }
  }, [user])
  
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
    <div onScroll={handleScroll} className='h-screen w-full overflow-y-scroll overflow-x-clip'>
      {!user ? <>
        <div className="flex items-center justify-center h-full">
          Loading...
        </div>
      </> : <>
      {/* Header */}
      <div className="sticky top-0 z-50 glass border-b border-border px-4 py-3">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="h-6 w-6 text-foreground">{`<=`}</div>
          </Link>
          <h2 className="text-base font-semibold font-display text-foreground">{user.name}</h2>
          <div className="flex gap-4">
            <Link href="/settings">
              <div className="h-6 w-6 text-foreground hover:text-primary transition-colors">Settings</div>
            </Link>
          </div>
        </div>
      </div>

      {/* Profile */}
      <ProfileData 
        id={user._id||''}
        picture={user.picture} 
        posts={user?.postcount?.postcount ?? 0} 
        follower={user.follower.followerCount} 
        following={user.following.folloingCount}
        followinglist={user.following.count[0]}
        followerlist={user.follower.count[0]}
        userid={userid}
        name={user.name}
      />
      <div className='top-0 z-51 sticky glass border-b border-border px-4'>
        <ProfileNav/>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-0.5">
        {posts.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="aspect-square cursor-pointer"
            onClick={() => setSelectedIndex(i)}
          >
            <img src={img.pictureURL} alt="" className="w-full h-full object-cover hover:opacity-80 transition-opacity" />
          </motion.div>
        ))}
      </div>
    </>
    }
    {selectedIndex !== null && (
      <PostViewer
        posts={posts}
        initialIndex={selectedIndex}
        onClose={() => setSelectedIndex(null)}
      />
    )}
  </div>
  )
}

export default Userprofile
