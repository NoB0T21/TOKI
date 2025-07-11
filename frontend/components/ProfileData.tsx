'use client'
import Image from 'next/image'
import { useState } from 'react'
import Following from './card/Following'

interface User {
    picture:string,
    posts:number|undefined,
    follower:number,
    following:number,
    followinglist:string[],
}

const ProfileData = ({picture,posts,follower,following,followinglist}:User) => {
  const [showFlowwing, setShowFlowwing] = useState(false);
  return (
    <>
      <div className='flex justify-between sm:justify-start items-center sm:gap-6 bg-[rgba(84,84,84,0.4)] backdrop-blur-5xl px-5 rounded-2xl w-full sm:w-90 lg:w-100 h-20'>
          <Image className='rounded-full size-18' src={picture} alt='profile' width={720} height={720}/>
          <div className='flex flex-col justify-center h-18'>
            <h3 className='font-semibold lg:text-xl'>{posts}</h3>
            <p className='lg:text-xl'>posts</p>
          </div>
          <div className='flex flex-col justify-center h-18'>
            <h2 className='font-semibold lg:text-xl'>{follower}</h2>
            <p className='lg:text-xl'>followers</p>
          </div>
          <div onClick={()=>setShowFlowwing(true)} className='flex flex-col justify-center h-18'>
            <h2 className='font-semibold lg:text-xl'>{following}</h2>
            <p className='lg:text-xl'>followings</p>
          </div>
      </div>
      {showFlowwing && (
        <div className='top-0 left-0 z-6 absolute flex justify-center items-center gap-2 backdrop-blur-sm w-full h-full'>
          <div className='py-10 h-full'><p onClick={()=>setShowFlowwing(false)} className='flex justify-center items-center bg-red-500 p-1 rounded-md size-7 text-xl'>X</p></div>
          <Following followinglist={followinglist}/>
        </div>
      )}
    </>
  )
}

export default ProfileData
