import Userprofile from '@/components/Userprofile';
import Providers from '@/context/tankstack';


const page = async () => {

  return (
    <div className="w-full h-full overflow-hidden">
        <Providers>
          <Userprofile/>
        </Providers>
    </div>
  )
}

export default page
