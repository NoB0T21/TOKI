import Image from "next/image"
import Link from "next/link"

interface Post{
    id:string,
    creator: string,
    title: string,
    message: string,
    tags:string[],
    pictureURL:string,
    createdAt:string,
}

const FileCard = ({post,owner}:{post : Post,owner:string}) => {
  return (
    <Link href={`/User/${owner}`} className="bg-[rgba(84,84,84,0.6)] md:bg-[rgba(84,84,84,0.4)] backdrop-blur-xl rounded-md w-full h-70 overflow-hidden">
      {/* Post Image */}
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
