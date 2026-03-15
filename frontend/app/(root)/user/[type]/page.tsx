'use client'
export const dynamic = 'force-dynamic'
import Userprofile from '@/components/Userprofile'
import { useParams } from "next/navigation";

const page = () => {
  const params = useParams();
  const userId = params.type?.toString() || '';

  return (
    <main className='w-full h-full'>
      <div className='bg-[#1a1e23] p-3 rounded-lg'>
          <Userprofile userid={userId}/>
      </div>
    </main>
  )
}

export default page
