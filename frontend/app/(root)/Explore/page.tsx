import Explore from "@/components/card/Explore"
import { ExploreHeader } from "@/components/navigation/Header"
import { ApolloWrapper } from "@/context/ApolloClientProvider"

const page = async () => {
  return (
    <>
      <ExploreHeader/>
      <div className='sm:bg-[#1a1e23] p-5 sm:rounded-2xl w-full h-[95%] overflow-auto'>
        <ApolloWrapper>
            <Explore/>
        </ApolloWrapper>
      </div>
    </>
  )
}

export default page
