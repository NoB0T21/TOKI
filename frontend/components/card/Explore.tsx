'use client'

import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { addPosts, increaseSkip, setScrollPosition } from "@/state/exploreSlice";
import { motion } from "motion/react";
import PostViewer from "../PostViewer";
import { getExplorePosts } from "@/utils/clientAction";

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
  const dispatch = useDispatch();
  const scrollPosition = useSelector(
    (state: RootState) => state.explore.scrollPosition
  );
  const posts = useSelector((state: RootState) => state.explore.posts);
  const skip = useSelector((state: RootState) => state.explore.skip);
  const hasMore = useSelector((state: RootState) => state.explore.hasMore);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  
  const fetchMore = async () => {
    if (!hasMore) return;
    const posts = await getExplorePosts(skip);
    const newPosts = posts || [];
    if (newPosts) {
      dispatch(addPosts(newPosts));
    }
  };
  
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    dispatch(setScrollPosition(scrollTop));
    if (Math.round(scrollTop + clientHeight) >= scrollHeight && hasMore) {
      dispatch(increaseSkip());
    }
  };
  
  useEffect(() => {
    if (scrollRef.current && posts.length > 0) {
      scrollRef.current.scrollTo({
        top: scrollPosition,
        behavior: "auto",
      });
    }
  }, [posts]);
  
  useEffect(() => {
    fetchMore();
  }, [skip])

  return (
    <>
      {/* Grid */}
      <div onScroll={handleScroll} ref={scrollRef} className="grid grid-cols-3 gap-0.5 auto-rows-[140px] h-screen overflow-y-scroll">
        {posts.map((post, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.03 }}
            className={`cursor-pointer overflow-hidden ${i % 5 === 0 ? "col-span-2 row-span-2" : ""} w-full h-full`}
            onClick={() => setSelectedIndex(i)}
          >
            <img
              src={post.pictureURL}
              alt=""
              className="w-full h-full aspect-square object-cover hover:opacity-80 transition-opacity"
            />
          </motion.div>
        ))}
      </div>
      {selectedIndex !== null && (
        <PostViewer
          posts={posts}
          initialIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </>
  )
}

export default Explore
