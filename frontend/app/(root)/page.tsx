import { DashboardHeader } from '@/components/navigation/Header'
import { ApolloWrapper } from '@/context/ApolloClientProvider'
import Home from '@/components/card/Home'
import React from 'react'
import StoryBar from '@/components/story/StoryBar'
import { getuserfollowing } from '@/utils/serverActions'
import { getuserstorys } from '@/utils/apolloclient'

const page = async () => {
  const usersFollowing = await getuserfollowing()
  const getUsers = await getuserstorys({ids:usersFollowing})
  console.log(getUsers)

  return (
    <div>
      <DashboardHeader/>
      <StoryBar stories={getUsers.userstories}/>
      <ApolloWrapper>
          <Home ids={usersFollowing}/>
      </ApolloWrapper>
    </div>
  )
}

export default page
