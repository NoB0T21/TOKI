'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Following from './card/Following'
import Followers from './card/Followers'
import { getstory } from '@/queries/Queries'
import { useLazyQuery } from '@apollo/client'
import { getstorys } from '@/utils/clientApollo'
import StoryViewer from './story/StoryViewer'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/store/store'
import { addPosts, increaseSkip } from '@/state/userProfilefollowings'
import { getProfileFollowingdata } from '@/utils/clientAction'
import { addprofileFollowing, increaseSkipofprofile } from '@/state/profileFollowing'

interface User {
    picture:string,
    posts:number|undefined,
    follower:number,
    following:number,
    followinglist:string[],
    followerlist:string[]
    id:string,
    userid?: string
}

function paginateIds(ids: string[], page: number, limit: number=3) {
  const start = (page - 1) * limit;
  const end = start + limit;
  return ids.slice(start, end);
}

const ProfileData = ({picture,posts,follower,following,followerlist,followinglist,id,userid}:User) => {
  const dispatch = useDispatch();
  let usersfollowing
  let skip
  let hasMore
  usersfollowing = useSelector((state: RootState) => userid ? state.userProfilefollowings.userprofileFollowing : state.profileFollowing.profileFollowing);
  userid ? skip = useSelector((state: RootState) => state.userProfilefollowings.skip) : skip = useSelector((state: RootState) => state.profileFollowing.skip);
  userid ? hasMore = useSelector((state: RootState) => state.userProfilefollowings.hasMore) : hasMore = useSelector((state: RootState) => state.profileFollowing.hasMore);
  const [showFlowing, setShowFlowing] = useState(false);
  const [showFlower, setShowFlower] = useState(false);
  const [showsory, setShowsory] = useState(false);
  const [getstoryList] = useLazyQuery(getstory)
  const [story,Setstory] = useState<any>()

  const fetchMorefollowing = async () => {
    if (!hasMore) return;
    const followinguser = await getProfileFollowingdata(paginateIds(followinglist, skip, 14), skip, 14)      
    const newPosts = followinguser || [];
    if (newPosts.length) dispatch(userid ?addPosts(followinguser): addprofileFollowing(followinguser));
  }
  
  const handleFollowingScroll = (e: React.UIEvent<HTMLElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (Math.round(scrollTop + clientHeight) >= scrollHeight && hasMore) {
      userid ? dispatch(increaseSkip()) : dispatch(increaseSkipofprofile());
    }
  };

  const viewsstory = async () => {
    let usersFollowing:string[] = []
    usersFollowing.push(id||'')
    const getUsers = await getstorys({ids:usersFollowing,getStory:getstoryList})
    if(getUsers.userstories.length!==0)Setstory(getUsers.userstories)
    
  }

  useEffect(() => {
    viewsstory();
  }, []);

  useEffect(() => {
    fetchMorefollowing();
  }, [skip]);

  return (
    <>
      <div className='flex justify-between sm:justify-start items-center sm:gap-6 bg-gradient-to-tl from-[#1A1C22] to-[#5A5C6A] backdrop-blur-5xl px-5 rounded-md w-full sm:w-90 lg:w-100 h-20'>
          <Image onClick={()=>setShowsory(true)} className={`${story && 'border-[#2EF6FF] border-2'} rounded-full size-11 sm:size-16`} src={picture} alt='profile' width={720} height={720}/>
          <div className='flex flex-col justify-center h-18'>
            <h3 className='font-semibold lg:text-xl'>{posts}</h3>
            <p className='lg:text-xl'>posts</p>
          </div>
          <div onClick={()=>setShowFlower(true)} className='flex flex-col justify-center h-18'>
            <h2 className='font-semibold lg:text-xl'>{follower}</h2>
            <p className='lg:text-xl'>followers</p>
          </div>
          <div onClick={()=>setShowFlowing(true)} className='flex flex-col justify-center h-18'>
            <h2 className='font-semibold lg:text-xl'>{following}</h2>
            <p className='lg:text-xl'>followings</p>
          </div>
      </div>
      {showFlowing && (
        <div className='top-0 left-0 z-6 absolute flex flex-col justify-center items-center gap-2 backdrop-blur-sm overflow-hidden w-screen h-screen'>
          <div className='w-110 lg:w-150 flex flex-col justify-center h-full'>
            <div className='flex justify-end'><p onClick={()=>setShowFlowing(false)} className='flex justify-center cursor-pointer items-center bg-red-500 p-1 rounded-md size-7 text-xl'>X</p></div>
            { usersfollowing.length > 0 ?
              <div className="mb-3 py-5 w-110 lg:w-150 h-full">
                <div className="flex flex-col items-center gap-7 bg-[#1a1e23] p-3 border-[#3e4a57] border-1 rounded-2xl w-full h-full">
                  <h1 className="font-semibold text-2xl">Following</h1>
                  <div onScroll={handleFollowingScroll} className="flex flex-col gap-3 w-full h-full">
                      {usersfollowing.map((user: any)=>(
                          <Following user={user}/>
                      ))}
                  </div>
                </div>
              </div> :
              <div className="font-bold text-2xl">Fuck you, you fucking blind don't u see it say's 0</div>
            }
          </div>
        </div>
      )}
      {showFlower && (
        <div className='top-0 left-0 z-6 absolute flex flex-col justify-center items-center gap-2 backdrop-blur-sm overflow-hidden w-screen h-screen'>
          <div className='w-110 lg:w-150 flex flex-col justify-center h-full'>
            <div className='flex justify-end'><p onClick={()=>setShowFlower(false)} className='flex cursor-pointer justify-center items-center bg-red-500 p-1 rounded-md size-7 text-xl'>X</p></div>
            <Followers followinglist={followerlist} userid={userid}/>
          </div>
        </div>
      )}
      {(showsory && story) && (
        <div className='top-0 left-0 z-6 absolute flex justify-center items-center gap-2 backdrop-blur-sm w-full h-full'>
          <div className='py-10 h-full'><p onClick={()=>setShowsory(false)} className='flex justify-center items-center bg-red-500 p-1 rounded-md size-7 text-xl'>X</p></div>
          <StoryViewer routes='/nortoute' stories={story} />
        </div>
      )}
    </>
  )
}

export default ProfileData
