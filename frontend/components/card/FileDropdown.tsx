import { actionDropdown } from "@/utils/utils"
import Items from "./Items"

interface Props{
  title:string,
  url:string,
  filename:string
}

const FileDropdown = ({title,url,filename}:Props) => {
  return (
    <div className='flex justify-center items-center backdrop-blur-xs w-full h-full'>
      <div className="bg-zinc-800 p-4 rounded-xl w-85 md:w-120">
        <div className="flex justify-between gap-2">
            <div className='mb-3 font-semibold text-[1.2rem] truncate'>{title}</div>
        </div>
        {actionDropdown.map((items)=>(
          <div key={items.lable} className="flex flex-col gap-3"><Items lable={items.lable} filename={filename} url={url}/></div>
        ))}
      </div>
    </div>
  )
}

export default FileDropdown
