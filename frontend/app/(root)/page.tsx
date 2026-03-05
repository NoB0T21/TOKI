import { DashboardHeader } from '@/components/navigation/Header'
import Home from '@/components/card/Home'
import { getuserfollowing } from '@/utils/serverActions'
import Providers from '@/utils/provider'

const page = async () => {
  const usersFollowing = await getuserfollowing()
  return (
    <div className='w-full h-full'>
      <DashboardHeader/>
      <Providers>
        <Home ids={usersFollowing}/>
      </Providers>
    </div>
  )
}

export default page
