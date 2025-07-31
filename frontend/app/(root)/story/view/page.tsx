import React from 'react'
import { getuserfollowing } from '@/utils/serverActions'
import { getstorys } from '@/utils/apolloclient'
import StoryViewer from '@/components/story/StoryViewer'

const page = async () => {
    const usersFollowing = await getuserfollowing()
    const getUsers = await getstorys({ids:usersFollowing})
  return (
    
    <StoryViewer routes='/' stories={getUsers.userstories} />
  )
}

export default page
