import LogoutBtn from './LogoutBtn'

export const DashboardHeader = () => {
  return (
    <div className='flex justify-between items-center w-full h-12'>
      Home
      <LogoutBtn/>
    </div>
  )
}


export const ProfileHeader = ({name}:{name:string}) => {
  return (
    <div className='top-0 z-3 sticky flex justify-between items-center backdrop-blur-2xl mb-3 w-full h-12'>
      <h2 className='font-semibold text-xl'>{name}</h2>
      <LogoutBtn/>
    </div>
  )
}
