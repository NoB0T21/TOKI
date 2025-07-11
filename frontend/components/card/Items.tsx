'use client'
import { Downloads, Delete, Edit } from '../Icons'
import Download from '../Download'

const Items = ({lable,url,filename}:{lable: string, url: string, filename: string}) => {
  return (
    <>
      <div className={` ${lable==='Delete' ? 'hover:bg-red-700': `${lable==='Download' ? 'hover:bg-blue-500': 'hover:bg-purple-700 '}`} text-[1.1rem] gap-5 flex justify-start items-center font-light px-3 rounded-2xl h-8`}>
        <div className={`w-5 hover:animate-bounce`}>
          {lable==='Edit' && <Edit/>}
          {lable==='Download' && <Downloads/>}
          {lable==='Delete' && <Delete/>}
        </div>
        <div >{lable==='Download' ? <Download url={`${url}`} name={filename}/> : <p>{lable}</p>}</div>
      </div>
    </>
  )
}

export default Items