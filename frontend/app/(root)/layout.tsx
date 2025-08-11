import MobileNav from "@/components/navigation/MobileNav"
import Sidebar from "@/components/navigation/Sidebar"

const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <main className='flex h-screen'>
      <div className='hidden sm:flex'><Sidebar/></div>
      <section className='flex flex-col flex-1'>
        <div className='flex-1 px-3 lg:px-10 py-2 sm:py-10 w-full max-w-[750px] overflow-hidden'>{children}</div>
        <div className='sm:hidden z-10 flex h-[60px]'><MobileNav/></div>
      </section>
    </main>
  )
}

export default layout
