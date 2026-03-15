import MobileNav from "@/components/navigation/MobileNav"

const Layout = ({children}:{children: React.ReactNode}) => {
  return (
    <main className='min-h-screen bg-background max-w-lg mx-auto relative'>
        {children}
      <div className='fixed bottom-0 left-0 right-0 z-50 glass border-t border-border'><MobileNav/></div>
    </main>
    //   <div className='w-full flex max-w-300 h-full sm:px-4 overflow-x-hidden shadow-[#2ef6ff] shadow-2xl/50 rounded-xl'>
    //     <div className='hidden sm:flex'><Sidebar/></div>
    //     <section className='flex flex-col flex-1'>
    //     </section>
    //   </div>
  )
}

export default Layout
