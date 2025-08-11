import React from 'react'
import { getstorys } from '@/utils/apolloclient'
import StoryViewer from '@/components/story/StoryViewer'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const page = async () => {
  const userId = (await cookies()).get('user')?.value
    let usersFollowing:string[] = []
    usersFollowing.push(userId||'')
    const getUsers = await getstorys({ids:usersFollowing})
    if(getUsers.userstories.length===0)redirect('/story')
  return (
    <StoryViewer routes='/story/ownview' stories={getUsers.userstories} />
  )
}

export default page
