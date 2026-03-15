export const dynamic = 'force-dynamic'
import { DashboardHeader } from '@/components/navigation/Header'
import Home from '@/components/card/Home'
import { getuserfollowing } from '@/utils/serverActions'


const page = async () => {
  const usersFollowing = await getuserfollowing()
  return (
    <div className='w-full h-full'>
      <DashboardHeader/>
      <Home ids={usersFollowing}/>
        
    </div>
  )
}

export default page

