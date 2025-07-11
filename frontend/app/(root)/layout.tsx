import MobileNav from "@/components/navigation/MobileNav"
import Sidebar from "@/components/navigation/Sidebar"

const layout = ({children}:{children: React.ReactNode}) => {
  return (
    <main className='flex h-screen'>
        <div className='hidden sm:flex'><Sidebar/></div>
        <section className='flex flex-col flex-1'>
          <div className='flex-1 bg-zinc-900 sm:mr-7 md:mb-7 px-5 md:px-9 py-7 md:py-10 sm:rounded-2xl w-full h-full overflow-auto remove-scrollbar'>{children}</div>
          <div className='sm:hidden flex'><MobileNav/></div>
        </section>
    </main>
  )
}

export default layout
