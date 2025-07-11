
import createApolloClient from '@/apollo-client';
import Userprofile from '@/components/Userprofile';
import { ApolloWrapper } from '@/context/ApolloClientProvider';
import { getpost } from '@/queries/Queries';
import { cookies } from 'next/headers';


const page = async () => {
  const userId = (await cookies()).get('user')?.value || ''
  const client = await createApolloClient();
  
  const {data} = await client.query({
    query: getpost,
    variables: {
      id: userId,
      owner: userId
    },
  });
  return (
    <div className="w-full h-full overflow-hidden">
      <ApolloWrapper>
          <Userprofile userId={userId} user={data.user}/>
      </ApolloWrapper>
    </div>
  )
}

export default page
