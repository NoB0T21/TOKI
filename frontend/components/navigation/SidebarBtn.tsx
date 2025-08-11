'use client'

import { usePathname } from "next/navigation"
import { CreatePost, Globe, GlobeFill, Home, HomeFill } from "../Icons"
import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

const SidebarBtn = ({pathname,name}:{pathname: string, name: string}) => {
   const path = usePathname()
   const [user,SetUser] = useState<any>()
   useEffect(()=>{SetUser(JSON.parse(localStorage.getItem('user') || ''))},[])

  return (
    <>
        <Link href={`${pathname}`} className={`${(path===pathname)?'text-[#2EF6FF] lg:border-r-8 lg:bg-zinc-700':'hover:bg-zinc-700 text-[#b0bec5]'}  flex justify-center transition-all duration-300 ease-in-out lg:justify-start items-center gap-2 lg:px-6 p-1 rounded-md`}>
          <div className=" block content-center size-9 xl:size-11 p-1 transition-(w) duration-200 ease-in-out">
            {name==='Dashboard' && (path==='/'?<HomeFill/>:<Home/>)}
            {name==='Explore' && (path===pathname?<GlobeFill/>:<Globe/>)}
            {name==='Create' && <CreatePost/>}
            {name==='Profile' && (
              <div className={`${path===pathname?'bg-gradient-to-r from-[#2EF6FF] to-[#aafcff]':'hover:bg-zinc-700 opacity-75'} p-0.5 rounded-full `}>
                <Image className="bg-[#1a1e23] rounded-full" src={user?.picture? user.picture:'https://yxbboqcacbihxherpisb.supabase.co/storage/v1/object/public/toki//ecbfe5f8-d510-4f77-80da-a568ec9a9d8c-profile.png'} width={100} height={100} alt="profile"/>
              </div>
            )}
          </div>
          <div className={`hidden lg:flex xl:text-xl ${path===pathname?'':'text-[#b0bec5]'} items-center`}>{name}</div>
        </Link>
    </>
  )
}

export default SidebarBtn
