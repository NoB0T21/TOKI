import Userprofile from '@/components/Userprofile';
import { ApolloWrapper } from '@/context/ApolloClientProvider';
import { getUser } from '@/utils/apolloclient';
import { cookies } from 'next/headers';


const page = async () => {
  const userId = (await cookies()).get('user')?.value || ''
  const getUsers = await getUser({userId})

  return (
    <div className="w-full h-full overflow-hidden">
      <ApolloWrapper>
          <Userprofile userId={userId} user={getUsers.user}/>
      </ApolloWrapper>
    </div>
  )
}

export default page
