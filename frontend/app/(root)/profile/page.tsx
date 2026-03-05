import Userprofile from '@/components/Userprofile';
import Providers from '@/context/tankstack';


const page = async () => {

  return (
    <Providers>
      <Userprofile/>
    </Providers>
  )
}

export default page
