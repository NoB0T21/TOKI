import StoryViewer from '@/components/story/StoryViewer'
import { getstory } from '@/utils/serverActions'
import { redirect } from "next/navigation"
import { cookies } from "next/headers"


const Page = async () => {
  const userId = (await cookies()).get('user')?.value
  
  if (!userId) {
    redirect('/sign-in')
  }
  const stories = await getstory([userId])
  if (stories.length === 0) {
    redirect('/story')
  }

  return (
    <StoryViewer
      routes="/story"
      stories={stories}
    />
  )
}

export default Page