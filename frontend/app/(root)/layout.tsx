import MobileNav from "@/components/navigation/MobileNav"
import Sidebar from "@/components/navigation/Sidebar"

const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <main className='w-screen h-screen flex items-center justify-center scroll-smooth'>
      <div className='w-full flex max-w-300 h-full sm:px-4 overflow-x-hidden shadow-[#2ef6ff] shadow-2xl/50 rounded-xl'>
        <div className='hidden sm:flex'><Sidebar/></div>
        <section className='flex flex-col flex-1'>
          <div className='flex-1 px-3 w-full h-full overflow-hidden'>{children}</div>
          <div className='sm:hidden flex h-[60px] w-full'><MobileNav/></div>
        </section>
      </div>
    </main>
  )
}

export default layout
