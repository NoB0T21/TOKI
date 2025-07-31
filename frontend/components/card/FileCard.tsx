import { Post } from "@/Types/types"
import Image from "next/image"
import Link from "next/link"

interface Props{
  post: Post,
  owner:string
}

const FileCard = ({post,owner}:Props) => {
  return (
    <Link href={`/User/${owner}`} className="bg-[rgba(84,84,84,0.6)] md:bg-[rgba(84,84,84,0.4)] backdrop-blur-xl rounded-md w-full h-70 overflow-hidden">
      <div className="w-full h-full">
        <Image
          src={post.pictureURL}
          alt="Post"
          width={1920}
          height={1080}
          className="bg-black rounded-md w-full h-full object-contain md:object-cover"
        />
      </div>
    </Link>
  )
}

export default FileCard
