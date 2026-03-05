'use client'

import { usePathname } from "next/navigation"
import { Grid, GridFill, Reel, ReelFill } from "../Icons"
import Link from "next/link"
import { useState } from "react"

const ProfileNav = () => {
    const path = usePathname().split('/')[1]
    const path2 = usePathname().split('/')[2]
    const tabs = [
        { icon: Grid, id: "posts", link: "/profile"},
        { icon: Reel, id: "reels", link: "/profile/reels"},
        { icon: GridFill, id: "saved", link: "/profile/hh"},
    ];
    return (
        // Tabs
        <div className="flex border-t border-border">
            {tabs.map((tab) => (
            <Link
                key={tab.id}
                href={tab.link}
                className={`flex-1 py-3 flex justify-center transition-colors ${
                path2===tab.link.split('/')[2] ? "text-primary border-t border-primary" : "text-muted-foreground"
                }`}
            >
                <div className="h-5 w-5"><tab.icon/></div>
            </Link>
            ))}
        </div>
    )
}

export default ProfileNav
