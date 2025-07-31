import React from 'react'
import { getstorys } from '@/utils/apolloclient'
import StoryViewer from '@/components/story/StoryViewer'
import { cookies } from 'next/headers'

const page = async () => {
  const userId = (await cookies()).get('user')?.value
    let usersFollowing:string[] = []
    usersFollowing.push(userId||'')
    const getUsers = await getstorys({ids:usersFollowing})
  return (
    <StoryViewer routes='/story/ownview' stories={getUsers.userstories} />
  )
}

export default page
