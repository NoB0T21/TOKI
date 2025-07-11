import Explore from "@/components/card/Explore"
import { ApolloWrapper } from "@/context/ApolloClientProvider"

const page = async () => {
  return (
    <div className='w-full h-full'>
      <ApolloWrapper>
          <Explore/>
      </ApolloWrapper>
    </div>
  )
}

export default page
