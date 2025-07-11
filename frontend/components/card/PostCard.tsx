'use client'
import { Like, LikeFill } from "../Icons"
import { api } from "@/utils/api"
import { useState } from "react"
import Image from "next/image"
import Readmore from "../Readmore"
import Cookies from "js-cookie"
import FileDropdown from "./FileDropdown"

interface Post{
    id:string,
    pictureURL: string,
    creator:string
    message:string,
    title:string,
    owner:string,
    tags: [],
    originalname:string,
    like:{
        like:string[]
        likeCount:number
    }
}

const PostCard = ({file, profile, name, userID,followings}:{file:Post, profile:string, name:string, userID:string, followings:string[]}) => {
  const token = Cookies.get('token');
  const user = Cookies.get('user') || '';
    const [like, setLike ] = useState<string[]>(file?.like?.like)
    const [show,setShow]=useState(false)
    const [likecount, setLikeCount ] = useState<number>(file?.like?.likeCount)
    const [following, setFollowing ] = useState<string[]>(followings)
    
    const likePost = async () => {    
      if(!token){
        return
      }
      console.log(file)
      const data = await api.get(`/post/like/${file.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      if(data.status === 200) {
        const currentLikes = Array.isArray(like) ? like : [];
        const index = currentLikes.indexOf(userID);
        let updatedLikes;

        if (index === -1) {
          updatedLikes = [...currentLikes, userID]; // Add like
          setLikeCount(prev => prev + 1);
        } else {
          updatedLikes = currentLikes.filter(id => id !== userID); // Remove like
          setLikeCount(prev => (prev > 0 ? prev - 1 : 0));
        }

        setLike(updatedLikes);
      }
  }

  const followuser = async () => {    
             if(!token){
               return
             }
             
             const data = await api.get(`/post/follow/${file.owner}`,
               {
                 headers: {
                   Authorization: `Bearer ${token}`,
                 },
                 withCredentials: true,
               }
             );
             if(data.status === 200) {
               const currentLikes = Array.isArray(following) ? following : [];
               const index = currentLikes.indexOf(user);
               let updatedFollow;
       
               if (index === -1) {
                 updatedFollow = [...currentLikes, user]; // Add like
                 //setLikeCount(prev => prev + 1);
               } else {
                 updatedFollow = currentLikes.filter(id => id !== user); // Remove like
                 //setLikeCount(prev => (prev > 0 ? prev - 1 : 0));
               }
       
               setFollowing(updatedFollow);
             }
         }

  return (
    <>
      <div key={file.id} className="relative bg-black my-6 rounded-md w-full lg:w-2/3 h-[78vh] overflow-y-auto snap-center scrollbar">
        <div className="w-full h-full">
          <Image
              src={file.pictureURL}
              alt="Post"
              width={3840}
              height={2160}
              className="bg-black p-1 rounded-md w-full h-full object-contain"
          />
        </div>
        <div className="top-0 absolute flex justify-between p-5 w-full h-20">
          <div className="flex justify-start items-center gap-2 w-2/3">
              <Image
                src={profile}
                alt="Post"
                width={500}
                height={500}
                className="rounded-full w-10 h-10 object-cover"
              />
              <p className="truncate">{name}</p>
          </div>
          <div>
            {userID===user?
            <p onClick={()=>setShow(true)}>...</p>
            :
            <div onClick={followuser} className="right-5 absolute flex items-center px-2 border-1 rounded-md">{following?.includes(user)?'Following':'Follow'}</div>}
          </div>
        </div>
        <div className="bottom-0 absolute p-5 w-full h-25">
          <div onClick={() =>likePost()} className="flex gap-3">
            <div className="flex gap-1"><div className={`size-7 `}>{like?.includes(userID)?<LikeFill/>:<Like/>}</div>{likecount}</div>
            <div className="flex gap-1"><div className={`size-7`}><LikeFill/></div>{likecount}</div>
          </div>
          <div className='flex justify-start mx-1mt-1 p-1'>
                {file.tags.map((tag, index) => (
                    <span key={index} className="flex items-center text-blue-500 hover:text-blue-600 text-sm hover:underline hover:underline-offset-1 cursor-pointer">
                        {tag}
                    </span>
                ))}
            </div>
          <div className="">
            <Readmore text={file.message} maxLength={30} />
          </div>
        </div>
      </div>
      {show && 
        <div className="top-0 left-0 absolute backdrop-blur-sm p-5 w-full h-full">
          <div className="flex justify-end" onClick={()=>setShow(false)}>X</div>
          <FileDropdown title={file.title} url={file.pictureURL} filename={file.originalname}/>
        </div>
      }
    </>
  )
}

export default PostCard
