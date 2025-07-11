'use client'

import { usePathname } from "next/navigation"
import { Grid, GridFill, Reel, ReelFill } from "../Icons"
import Link from "next/link"

const ProfileNav = () => {
    const path = usePathname().split('/')[1]
    const path2 = usePathname().split('/')[2]

    return (
        <div className='relative flex justify-between items-center sm:gap-6 bg-[rgba(84,84,84,0.4)] backdrop-blur-5xl mt-4 px-5 rounded-md w-full sm:w-90 lg:w-100 h-10'>
            <Link href={`${path==='Profile'?'/Profile':`/User/${path2}`}`}>
                <div className="flex justify-center items-center w-7 h-7 transition-(w) duration-200 ease-in-out">
                    {path==='Profile'||path==='User'?<GridFill/>:<Grid/>}
                </div>
            </Link>
            <Link href={`/Profile/Reel`} >
                <div className="flex justify-center items-center w-7 h-7 transition-(w) duration-200 ease-in-out">
                    {path==='Profile/Reel'?<ReelFill/>:<Reel/>}
                </div>
            </Link>
            <Link href={`/Profile/hh`} >
                <div className="flex justify-center items-center w-7 h-7 transition-(w) duration-200 ease-in-out">
                    {path==='/Profile'?<GridFill/>:<Grid/>}
                </div>
            </Link>
            <div className={`${(path==='Profile'||path==='User') && 'bottom-0 left-0'} ${path==='/Profile/Reel'&& 'bottom-0 sm:left-36 lg:left-41'} absolute hidden sm:flex bg-white w-18 h-0.5 transition-all duration-300 ease-in-out`}></div>
        </div>
    )
}

export default ProfileNav
