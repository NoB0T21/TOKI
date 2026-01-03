import Userprofile from '@/components/Userprofile'
import { ApolloWrapper } from '@/context/ApolloClientProvider'
import { ProfileHeader } from '@/components/navigation/Header'
import { getUser } from '@/utils/apolloclient'

type Props = {
  params: {
    type: string
  }
}

const page = async  ({ params }: Props) => {
  const userId = params.type;
  const getUsers = await getUser({userId})

  return (
    <main className='w-full h-full'>
      <ProfileHeader name={getUsers.user.name}/>
      <div className='bg-[#1a1e23] p-3 rounded-lg'>
        <ApolloWrapper>
          <Userprofile userId={userId} user={getUsers.user}/>
        </ApolloWrapper>
      </div>
    </main>
  )
}

export default page
