'use client'

import { getexplorepostpageintion } from "@/queries/Queries";
import { useLazyQuery } from "@apollo/client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Cookies from "js-cookie";
import Image from "next/image";
import ExploreGrid from "../ExploreGrid";
import { Posts } from "@/Types/types";
import { getUserPosts } from "@/utils/clientApollo";



const Explore = () => {
  const userId = Cookies.get('user') || ''
  const [getuserPost] = useLazyQuery(getexplorepostpageintion)
  const [posts,setPosts] = useState<Posts[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [skip, setSkip] = useState(0);
  const [post, setPost] = useState<Posts>({
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
  });
  
  const fetchMore = async () => {
    if (!hasMore) return;

    const posts = await getUserPosts({userId,skip,getuserPost})

    const newPosts = posts || [];
    if (newPosts.length < 10 ) {
      setHasMore(false);
    }
    if (newPosts.length) {
      setPosts((prev) => {
        const merged = [...prev, ...posts];
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
    <div onScroll={handleScroll} className='gap-1 grid grid-cols-4 grid-flow-dense auto-rows-[80px] md:auto-rows-[150px] w-full h-full overflow-y-scroll'>
      {posts.map((post,index)=>(
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
      ))}
      {post.id && 
        <div className="top-0 left-0 absolute flex justify-between gap-2 backdrop-blur-sm p-2 md:p-10 w-full h-full">
          <ExploreGrid post={post} Likes={post.like.like} LikeCount={post.like.likeCount} Following={post.follower.count}/>
          <div 
            onClick={()=>setPost({
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
            })}
            className="top-7 md:top-0 right-10 md:right-0 z-5 absolute md:relative flex justify-center items-center bg-red-500 p-2 rounded-md size-6 md:size-8 text-2xl"
          >
            <p>x</p>
          </div>
        </div>
      }
    </div>
  )
}

export default Explore
