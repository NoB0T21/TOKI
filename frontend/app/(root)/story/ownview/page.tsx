'use client'
export const dynamic = 'force-dynamic'
import StoryViewer from '@/components/story/StoryViewer'
import { Story, User } from '@/Types/types'
import { getstory } from '@/utils/clientAction'
import { useRouter } from "next/navigation"
import { useEffect, useState } from 'react'


const Page = () => {
  const route = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [stories, setStories] = useState<Story[]>()
  useEffect(()=>{
    const raw:any = localStorage.getItem('user')
    if (raw) setUser(JSON.parse(raw))
    if (raw && !raw._id) {
      route.push('/sign-in')
    }
    const fetch = async () => {
      const data = await getstory([raw._id])
      setStories(data)
      if (data.length === 0) {
        route.push('/story')
      }
    }
    fetch()
  },[])

  return (
    <>
      {stories && stories.length > 0 ? 
      <StoryViewer
        routes="/story"
        stories={stories}
      /> : <div>no stories</div>
      }
    </>
    
  )
}

export default Page
