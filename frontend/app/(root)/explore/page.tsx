export const dynamic = 'force-dynamic'
import Explore from "@/components/card/Explore"
import { ExploreHeader } from "@/components/navigation/Header"


const page = async () => {
  return (
    <>
      <ExploreHeader/>
      <Explore/>
    </>
  )
}

export default page

