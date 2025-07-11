'use client'

import { getexplorepostpageintion } from "@/queries/Queries";
import { useLazyQuery } from "@apollo/client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Like, LikeFill } from "../Icons";
import { api } from "@/utils/api";
import Link from "next/link";

interface Posts {
    id: string
    pictureURL: string
    message:string,
    title:string,
    tags: string[],
    like:{
            like: string[]
            likeCount: number
        }, 
    following:{
            count:string[]
        },
    user:{
      id: string,
      picture: string,
      name:string
    }
}

const Explore = () => {
    const userId = Cookies.get('user') || ''
    const token = Cookies.get('token')
    const [posts,setPosts] = useState<Posts[]>([]);
    const [like, setLike ] = useState<string[]>()
    const [following, setFollowing ] = useState<string[]>()
    const [skip, setSkip] = useState(0);
    const [post, setPost] = useState<Posts>({
        id: '',
        pictureURL: '',
        message:'',
        title:'',
        tags: [],
        like:{
            like: [],
            likeCount: 0
        }, 
        following:{
                count:[]
        },
        user:{
          id: '',
          picture: '',
          name:''
      }
    });
    const [hasMore, setHasMore] = useState(true);
    const [likecount, setLikeCount ] = useState<number>(0)
    const [getuserPost] = useLazyQuery(getexplorepostpageintion)
    const router = useRouter();
    
    const fetchMore = async () => {
        if (!hasMore) return;
    
        const { data } = await getuserPost({
          variables: {
            offset: skip*10,
            limit: 10,
            excludeOwner: userId
          },
        })
        const newPosts = data?.exploreposts || [];
        if (newPosts.length < 10 ) {
          setHasMore(false); // No more posts to fetch
        }
        if (newPosts.length) {
          setPosts((prev) => {
            const merged = [...prev, ...data.exploreposts]; // Merge old and new posts
            const unique = Array.from(
              new Map(merged.map((p) => [p.id, p])).values() // Deduplicate by post.id
            );
            return unique; // Set state with only unique posts
          });
        }
        console.log(data.exploreposts)
        router.refresh();
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

       const likePost = async () => {    
             if(!token){
               return
             }
             
             const data = await api.get(`/post/like/${post.id}`,
               {
                 headers: {
                   Authorization: `Bearer ${token}`,
                 },
                 withCredentials: true,
               }
             );
             if(data.status === 200) {
               const currentLikes = Array.isArray(like) ? like : [];
               const index = currentLikes.indexOf(userId);
               let updatedLikes;
       
               if (index === -1) {
                 updatedLikes = [...currentLikes, userId]; // Add like
                 setLikeCount(prev => prev + 1);
               } else {
                 updatedLikes = currentLikes.filter(id => id !== userId); // Remove like
                 setLikeCount(prev => (prev > 0 ? prev - 1 : 0));
               }
       
               setLike(updatedLikes);
             }
         }

         const followuser = async () => {    
             if(!token){
               return
             }
             
             const data = await api.get(`/post/follow/${post.user.id}`,
               {
                 headers: {
                   Authorization: `Bearer ${token}`,
                 },
                 withCredentials: true,
               }
             );
             if(data.status === 200) {
               const currentLikes = Array.isArray(following) ? following : [];
               const index = currentLikes.indexOf(userId);
               let updatedFollow;
       
               if (index === -1) {
                 updatedFollow = [...currentLikes, userId]; // Add like
                 //setLikeCount(prev => prev + 1);
               } else {
                 updatedFollow = currentLikes.filter(id => id !== userId); // Remove like
                 //setLikeCount(prev => (prev > 0 ? prev - 1 : 0));
               }
       
               setFollowing(updatedFollow);
             }
         }
         
  return (
    <>
    <div onScroll={handleScroll} className='gap-1 grid grid-cols-3 w-full lg:w-1/2 overflow-y-scroll'>
        {posts.map((post)=>(
            <div 
              key={post.id}
              onClick={()=>{setPost(post);setLikeCount(post.like.likeCount);setLike(post.like.like);setFollowing(post.following.count)}}
              className='w-full h-35'>
                <Image
                    src={post.pictureURL}
                    alt="Post"
                    width={1920}
                    height={1080}
                    className="bg-black rounded-md w-full h-full object-cover"
                />
        </div>))}
    </div>
    {post.id && 
    <div className="top-0 left-0 absolute flex justify-between gap-2 backdrop-blur-sm p-10 w-full h-full">
        <div onClick={()=>setPost({
                id: '',
                pictureURL: '',
                message:'',
                title:'',
                tags: [],
                like:{
                    like: [],
                    likeCount: 0
                }, 
                following:{
                        count:[]
                },
                user:{
                  id: '',
                  picture: '',
                  name:''
              }
            })}
            className="top-7 md:top-0 right-10 md:right-0 z-5 absolute md:relative flex justify-center items-center bg-red-500 p-2 rounded-md size-6 md:size-8 text-2xl"
            ><p>x</p>
        </div>
        <div className="relative flex flex-col justify-between items-start bg-black p-5 py-8 rounded-2xl w-full md:w-2/3 xl:w-350 h-full overflow-y-scroll">
            <Image
                src={post.pictureURL}
                alt="Post"
                width={1920}
                height={1080}
                className="bg-black rounded-md w-full h-1/2 xs:h-2/3 sm:h-3/4 object-contain"
            />
            <div onClick={followuser} className="right-5 absolute flex items-center px-2 border-1 rounded-md">{following?.includes(userId)?'Following':'Follow'}</div>
            <Link href={`/User/${post.user.id}`} className="left-5 absolute flex items-center gap-3 px-2">
              <Image
                src={post.user.picture}
                alt="Post"
                width={500}
                height={500}
                className="bg-black rounded-full size-11 object-cover"
              />
              <div className="font-semibold">{post.user.name}</div>
            </Link>
            <div>
                <div onClick={() =>likePost()} className="flex gap-3">
                <div className="flex gap-1"><div className={`size-7`}>{like?.includes(userId)?<LikeFill/>:<Like/>}</div>{likecount}</div>
                <div className="md:hidden flex gap-1"><div className={`size-7`}><LikeFill/></div>{likecount}</div>
            </div>
             <div className='flex justify-start mx-1mt-1 p-1'>
                {post.tags.map((tag, index) => (
                    <span key={index} className="flex items-center text-blue-500 hover:text-blue-600 text-sm hover:underline hover:underline-offset-1 cursor-pointer">
                        {tag}
                    </span>
                ))}
            </div>
            <h1 className="font-semibold text-xl">{post.title}</h1>
            <div className="break-words whitespace-pre-wrap">
                {post.message}
            </div>
            </div>
        </div>
        <div className="hidden md:flex w-80 lg:w-130">comment</div>
    </div>}
    </>
  )
}

export default Explore
