export const dynamic = 'force-dynamic'
import StoryViewer from '@/components/story/StoryViewer'
import { getstory, getuserfollowing } from '@/utils/serverActions'

const page = async () => {
  const usersFollowing = await getuserfollowing()
  const getUsers = await getstory(usersFollowing)
  return (
    <StoryViewer routes='/' stories={getUsers||[]} />
  )
}

export default page

