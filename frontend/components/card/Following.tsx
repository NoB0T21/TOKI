'use client'

import { getfollowinguser } from "@/queries/Queries"
import { useLazyQuery } from "@apollo/client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Following{
    followinglist:string[],
}
interface User {
  id: string,
  name: string,
  picture: string
}
const Following = ({followinglist}:Following) => {
    const router = useRouter();
    const [getuserList] = useLazyQuery(getfollowinguser)
    const [hasMore, setHasMore] = useState(true);
    const [users,setUsers] = useState<User[]>([]);
    const [skip, setSkip] = useState(0);

    const fetchMore = async () => {
    if (!hasMore) return;
    const { data } = await getuserList({
      variables: {
        userIds: followinglist,
        offset: skip*10,
        limit: 10,
      },
    })
    const newPosts = data?.followinguser || [];
    if (newPosts.length < 10 ) {
      setHasMore(false); // No more posts to fetch
    }
    if (newPosts.length) {
      setUsers((prev) => {
        const merged = [...prev, ...data.followinguser]; // Merge old and new posts
        const unique = Array.from(
          new Map(merged.map((p) => [p.id, p])).values() // Deduplicate by post.id
        );
        return unique; // Set state with only unique posts
      });
    }
    router.refresh();
  }

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      if (scrollTop + clientHeight >= scrollHeight - 100 && hasMore) {
        setSkip(prev => prev + 1);
      }
    };
    
    useEffect(() => {
      fetchMore();
    }, [skip]);
  return (
    <div className="py-10 lg:w-150 h-full">
      <div className="flex flex-col items-center bg-zinc-700 p-3 rounded-2xl w-full h-full">
        <h1 className="font-semibold text-2xl">Following</h1>
        <div onScroll={handleScroll} className="w-full h-full">
            {users.map((user: User)=>(
                <div key={user.id} className="bg-zinc-900 px-5 rounded-md w-full h-15 overflow-hidden">
                    <div className="flex justify-between items-center w-full h-full">
                        <div className="flex items-center gap-4 h-full">
                            <Image
                                src={user.picture}
                                alt="Post"
                                width={700}
                                height={700}
                                className="bg-black rounded-full size-12 object-contain md:object-cover"
                            />
                            {user.name}
                        </div>
                        <div>helo</div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default Following
