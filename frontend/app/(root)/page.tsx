import { DashboardHeader } from '@/components/navigation/Header'
import { ApolloWrapper } from '@/context/ApolloClientProvider'
import Home from '@/components/card/Home'
import React from 'react'
import StoryBar from '@/components/story/StoryBar'
import { getuserfollowing } from '@/utils/serverActions'

const page = async () => {
  const usersFollowing = await getuserfollowing()

  return (
    <div className='w-full h-full'>
      <DashboardHeader/>
      <StoryBar ids={usersFollowing}/>
      <ApolloWrapper>
          <Home ids={usersFollowing}/>
      </ApolloWrapper>
    </div>
  )
}

export default page
