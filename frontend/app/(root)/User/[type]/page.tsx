import { getpost} from '@/queries/Queries'
import { ApolloWrapper } from '@/context/ApolloClientProvider'
import createApolloClient from '@/apollo-client'
import Userprofile from '@/components/Userprofile'

type Props = {
  params: {
    type: string
  }
}

const page = async  ({ params }: Props) => {
  const userId = params.type;
  const client = await createApolloClient();
  
  const {data} = await client.query({
    query: getpost,
    variables: {
      id: userId,
      owner: userId
    },
  });

  return (
    <main className='w-full h-full overflow-hidden'>
        <ApolloWrapper>
          <Userprofile userId={userId} user={data.user}/>
        </ApolloWrapper>
    </main>
  )
}

export default page
