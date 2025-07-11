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
        <Link href={`${pathname}`} className={`${path===pathname?'bg-purple-900':'hover:bg-zinc-800'}  flex justify-center lg:justify-start h-13 sm:h-full gap-2 rounded-xl lg:rounded-3xl items-center px-2 lg:px-6 w-13 sm:w-full transition-all duration-200 ease-in-out`}>
          <div className="flex justify-center items-center w-18 lg:w-12 h-18 transition-(w) duration-200 ease-in-out">
            {name==='Dashboard' && (path==='/'?<HomeFill/>:<Home/>)}
            {name==='Explore' && (path===pathname?<GlobeFill/>:<Globe/>)}
            {name==='Profile' && (<Image className="rounded-full size-9" src={user.picture} width={100} height={100} alt="profile"/>)}
          </div>
          {name==='Create' ?"":<div className="hidden lg:flex">{name}</div>}
        </Link>
      }

      {name==='Create' ?
        <>
          <div onClick={()=>setShow(!show)} className="flex justify-center lg:justify-start items-center gap-2 px-2 lg:px-6 rounded-xl lg:rounded-3xl w-13 sm:w-full h-13 sm:h-full">
            <div className="flex justify-center items-center w-18 lg:w-12 h-18 transition-(w) duration-200 ease-in-out">
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
