'use client'
import Userprofile from '@/components/Userprofile'
import { useParams } from "next/navigation";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const page = () => {
  const [queryClient] = useState(() => new QueryClient())
  const params = useParams();
  const userId = params.type?.toString() || '';

  return (
    <main className='w-full h-full'>
      <div className='bg-[#1a1e23] p-3 rounded-lg'>
        <QueryClientProvider client={queryClient}>
          <Userprofile userid={userId}/>
        </QueryClientProvider>
      </div>
    </main>
  )
}

export default page
