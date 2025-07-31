import Image from 'next/image'
import LogoutBtn from './LogoutBtn'

export const DashboardHeader = () => {
  return (
    <div className='flex justify-between sm:justify-end items-center w-full h-12'>
      <div className='sm:hidden flex items-center gap-[6px] sm:gap-[10px]'>
        <Image className='size-8' src={'/images/Logo.png'} alt='Logo' width={300} height={300}/>
        <p className='font-semibold font-stretch-140% text-xl'>Toki</p>
      </div>
      <LogoutBtn/>
    </div>
  )
}

export const ExploreHeader = () => {
  return (
    <div className='flex justify-end items-center w-full h-12'>
      Search
    </div>
  )
}


export const ProfileHeader = ({name}:{name:string}) => {
  return (
    <div className='flex justify-between items-center backdrop-blur-2xl mb-3 w-full h-12'>
      <h2 className='font-semibold sm:text-xl'>{name}</h2>
      <LogoutBtn/>
    </div>
  )
}
