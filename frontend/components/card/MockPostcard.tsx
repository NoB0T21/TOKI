'use client'
import { Track, User3 } from '@/Types/types';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { LikeFill, Music, NoPosts } from '../Icons';
import Readmore from '../Readmore';

const MockPostcard = ({tags,message, name, pictureURL,song}:{tags?:string[],message?:string, name?:string, pictureURL?:string,song?:Track}) => {
    const [user,setUser] = useState<User3>();
    const audioRef = useRef<HTMLAudioElement>(null);
    useEffect(()=>{
        const user = localStorage.getItem('user')
        if(user){
            setUser(JSON.parse(user));
        }
    },[])
    return (
        <div className='relative bg-black my-1 sm:my-3 py-1 rounded-md w-full snap-start'>
            <div className="flex justify-between items-center w-full">
                <div className="flex w-2/3 items-center sm:my-3 px-2">
                    <Image
                        src={user?.picture || ''}
                        alt="Post"
                        width={500}
                        height={500}
                        className="rounded-full size-[30px] sm:size-10 xl:size-12 object-cover"
                    />
                        <div className="flex flex-col text-sm md:text-md justify-center px-2">
                        <div className="truncate px-2">{user?.name}</div>
                        {song &&
                        <>
                            {song.previewUrl&&<audio autoPlay ref={audioRef} src={`${song.previewUrl}`}/>}
                            <div className='flex gap-1 text-xs md:text-sm items-center'>
                                <p className='flex size-5 sm:size-6 animate-spin'><Music/></p>
                                <p>{song.title} - {song.artist}</p>
                            </div>
                        </>
                        }
                    </div>
                </div>

                <div className="flex cursor-pointer text-sm justify-between items-center p-5 h-full">
                    <div className="right-5 absolute animated-gradient hover:animate-wiggle flex items-center px-2 border-1 rounded-md"
                    >Follow</div>
                </div>
            </div>

            {pictureURL ? <Image
                    src={pictureURL || ''}
                    alt="Post"
                    width={3840}
                    height={2160}
                    className="rounded-md max-w-screen w-full mt-1 aspect-video object-cover"
                /> :
                <div className="rounded-md text-zinc-400 w-full mt-1 flex aspect-video flex-col justify-center items-center">
                    <div className='size-5 md:size-8'><NoPosts/></div>
                    add image to see Preview posts
                </div>
            }
            <div className="px-1 py-2 w-full ">
                <div className="flex gap-3 w-7">
                    <div className="flex gap-1">
                        <div className={`size-6`}><LikeFill/></div>
                        <p className='text-[#b0bec5]'>20</p></div>
                </div>
                <div className='space-x-1 mx-1 mt-1 p-1 truncate'>
                    {tags && tags.map((tag, index) => (
                    <span key={index} className="text-blue-500 hover:text-blue-600 text-sm hover:underline hover:underline-offset-1 cursor-pointer">
                        {tag}
                    </span>
                    ))}
                </div>
                <div className='text-lg'>{name}</div>
                {message && <Readmore text={message} maxLength={20} />}
            </div>
        </div>
    )
}

export default MockPostcard
