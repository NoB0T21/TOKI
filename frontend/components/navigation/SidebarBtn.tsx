'use client'

import { usePathname } from "next/navigation"
import { CreatePost, Globe, GlobeFill, Home, HomeFill } from "../Icons"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import UploadForm from "../UploadForm"

const SidebarBtn = ({pathname,name}:{pathname: string, name: string}) => {
   const path = usePathname()
   const user = JSON.parse(localStorage.getItem('user') || '')
   const [show,setShow] = useState(false)

  return (
    <>
      {name==='Create' ? "" :
        <Link href={`${pathname}`} className={`${(path===pathname)?'text-[#2EF6FF] lg:border-r-8 lg:bg-zinc-700':'hover:bg-zinc-700 text-[#b0bec5]'}  flex justify-center lg:justify-start items-center gap-2 lg:px-6 rounded-md`}>
          <div className=" block content-center h-full w-[40px] p-1 transition-(w) duration-200 ease-in-out">
            {name==='Dashboard' && (path==='/'?<HomeFill/>:<Home/>)}
            {name==='Explore' && (path===pathname?<GlobeFill/>:<Globe/>)}
            {name==='Profile' && (
              <div className={`${path===pathname?'bg-gradient-to-r from-[#2EF6FF] to-[#aafcff]':'hover:bg-zinc-700 opacity-75'} p-0.5 rounded-full`}>
                <Image className="bg-[#1a1e23] rounded-full" src={user.picture} width={100} height={100} alt="profile"/>
              </div>
            )}
          </div>
          {name==='Create' ?"":<div className={`hidden lg:flex ${path===pathname?'':'text-[#b0bec5]'}`}>{name}</div>}
        </Link>
      }

      {name==='Create' ?
        <>
          <div onClick={()=>setShow(!show)} className={`flex justify-center lg:justify-start items-center gap-2 lg:px-6 rounded-md ${show?'text-[#2EF6FF] lg:border-r-8 lg:bg-zinc-700':'hover:bg-zinc-700 text-[#b0bec5]'}`}>
            <div className="block content-center h-full w-[40px] p-1 transition-(w) duration-200 ease-in-out">
              <CreatePost/>
            </div>
            <div className="hidden lg:flex">{name}</div>
          </div>
          <div className={`${show?'left-0 flex flex-col':'hidden'} top-0 p-10 backdrop-blur-sm h-full z-5 w-full absolute`}>
            <div className="flex justify-end w-full"><h1 onClick={()=>setShow(!show)} className="font-bold text-xl">X</h1></div>
            <UploadForm/>
          </div>
        </>
      :""}
    </>
  )
}

export default SidebarBtn
