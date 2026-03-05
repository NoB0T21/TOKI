import StoryViewer from '@/components/story/StoryViewer'
import { getstory, getuserfollowing } from '@/utils/serverActions'

const page = async () => {
  const usersFollowing = await getuserfollowing()
  const getUsers = await getstory(usersFollowing)
  console.log("stories:", getUsers)
  return (
    <StoryViewer routes='/' stories={getUsers||[]} />
  )
}

export default page
