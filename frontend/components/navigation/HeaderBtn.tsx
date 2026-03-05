"use client"

import Link from "next/link"

const HeaderBtn = () => {
  return (
    <div className="flex items-center gap-5">
        <Link href="/">
        {/* <Heart className="h-6 w-6 text-foreground hover:text-primary transition-colors cursor-pointer" /> */} hello
        </Link>
        <Link href="/">
        {/* <Send className="h-6 w-6 text-foreground hover:text-primary transition-colors cursor-pointer" /> */} hello
        </Link>
    </div>
  )
}

export default HeaderBtn
