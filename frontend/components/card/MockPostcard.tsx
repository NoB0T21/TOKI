'use client'
import { Track, User3 } from '@/Types/types';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react'
import { Comment, LikeFill, Music, NoPosts, Save, Send } from '../Icons';
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
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full gradient-story p-[2px]">
                    <Image
                    src={user?.picture || ''}
                    alt={user?.name || ''}
                    width={500}
                    height={500}
                    className="h-full w-full rounded-full object-cover border-2 border-background"
                    />
                </div>
                <div className="flex flex-col text-sm md:text-md justify-center">
                    <div className="text-sm font-bold">{user?.name}</div>
                        {song &&
                            <>
                                {song.previewUrl&&<audio autoPlay ref={audioRef} src={`${song.previewUrl}`}/>}
                                <div className='flex gap-1 text-xs md:text-sm items-center'>
                                    <p className='flex size-5 animate-spin'><Music/></p>
                                    <p className='text-muted-foreground'>{song.title} - {song.artist}</p>
                                </div>
                            </>
                        }
                    </div>
                </div>

                <div className="flex cursor-pointer text-sm justify-between items-center p-5 h-full">
                    <div className={`right-5 absolute animated-gradient hover:animate-wiggle flex items-center px-2 muted_text muted_story border rounded-md`}
                    >Follow</div>
                </div>
            </div>

            {/* Image */}
            {pictureURL ?
                <div className="relative">
                    <img src={pictureURL} alt="Post" className="w-full aspect-square object-cover" />
                </div>:
                <div className="rounded-md text-zinc-400 w-full mt-1 flex aspect-video flex-col justify-center items-center">
                    <div className='size-5 md:size-8'><NoPosts/></div>
                    add image to see Preview posts
                </div>
            }

            {/* Actions */}
            <div className="flex items-center justify-between px-4 pt-3">
                <div className="flex items-center gap-4">
                <button className="flex items-end gap-1">
                    <div className={`size-6`}><LikeFill/></div>
                </button>
                <div className={`size-6`}><Comment/></div>
                <div className={`size-6`}><Send/></div>
                </div>
                <div className={`size-6`}><Save/></div>
            </div>

            {/* Likes & Caption */}
            <div className="px-4 pt-2">
            <p className="text-sm font-semibold ">{1258} likes</p>
            <p className="text-sm mt-1">
                <span className="font-semibold">{user?.name}</span>{" "}
                <span className="secondary_text">{name}</span>
            </p>
            <div className=" w-full ">
                <Readmore text={message||''} maxLength={0} />
            </div>
            <div className='space-x-1 truncate'>
                {tags && tags.map((tag, index) => (
                <span key={index} className="text-blue-500 hover:text-blue-600 text-sm hover:underline hover:underline-offset-1 cursor-pointer">
                    {tag}
                </span>
                ))}
            </div>
            <p className="text-xs muted_text mt-1 uppercase">5 minutes ago</p>
            </div>
        </div>
    )
}

export default MockPostcard
