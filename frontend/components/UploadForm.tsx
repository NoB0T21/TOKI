'use client'

import { convertFileToUrl } from "@/utils/utils";
import { useState } from "react";
import { PulseLoader } from "react-spinners";
import { z } from "zod";
import { api } from "@/utils/api";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Toasts from "./toasts/Toasts";
import Cookies from 'js-cookie'
import { postFormapi } from "@/utils/clientAction";

const formSchema = z.object({
    creator: z.string().min(1, "creator required"),
    owner: z.string().min(1,"owner required"),
    files: z.instanceof(File, { message: 'A valid file is required' }),
})

const UploadForm = () => {
    const router = useRouter()
    const user = JSON.parse(localStorage.getItem('user') || '')
    const [formData, setFormData] = useState<{
        creator: string;
        title?: string;
        message?: string;
        tags?: string[];
        owner:string;
    }>({
        creator:user?.name, 
        title:'',
        message:'',
        tags:[],
        owner:user?._id,
    })
    const [error, setError] = useState<{
        creator?: string;
        owner?: string;
        files?: string;
    }>({})
    const [files, setFiles] = useState<File>();
    const [loading,setLoading] = useState(false)
    const [inputValue, setInputValue] = useState('');
    const [showToast,setShowToast] = useState(false)
    const [responseMsg,setResponseMsg] = useState('')
    const [tostType,setTostType] = useState('warningMsg')

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {setInputValue(e.target.value);};

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',' && inputValue.trim() !== '') {
        const newTags = inputValue
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag.length > 0)
            .map(tag => (tag.startsWith('#') ? tag : `#${tag}`))
            .filter(tag => !(formData.tags|| []).includes(tag));
        if (newTags.length > 0) {
            setFormData(prev => ({
            ...prev,
            tags: [...(prev.tags|| []), ...newTags],
            }));
        }

        setInputValue('');
      }
    };

    const removeTag = (indexToRemove: number) => {
        setFormData((prev) => ({
            ...prev,
            tags: (prev.tags|| []).filter((_, index) => index !== indexToRemove),
        }));
    };

     const clear = () => {
        setError({files:''});
        setLoading(false);
        setFormData({
            creator:user?.name, 
            title:'',
            message:'',
            tags:[],
            owner:user?._id
        })
    }

     const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setShowToast(false)
        setLoading(true)

        const parserResult = formSchema.safeParse({
            creator:formData.creator,
            owner: formData.owner,
            files: files,
        })
        if(!parserResult.success){
            const errorMessages = parserResult.error.flatten().fieldErrors
            setError({
                creator: errorMessages.creator?.[0],
                owner: errorMessages.owner?.[0],
                files: errorMessages.files?.[0],
            })
            setLoading(false)
            return
        }

        setError({
            creator: '',
            owner: '',
            files: ''
        })

        const form = new FormData();
            form.append('creator', formData.creator || '');
            form.append('title', formData.title || '');
            form.append('message', formData.message || '');
            form.append('tags', JSON.stringify(formData.tags || []));
            form.append('owner', formData.owner || '');
            if (files) {
                form.append('file', files);
            }

        const response = await postFormapi({form})
        if(response.status !== 200){
            setResponseMsg(response.data.message)
            if(response.status === 202)setTostType('successMsg');
                setLoading(false)
                setShowToast(true)
                setTimeout(() => {
                    setShowToast(false)
            }, 3000);
            return
        }

        setLoading(false)
        setFormData({
            creator:user?.name, 
            title:'',
            message:'',
            tags:[],
            owner:user?._id
        })
        setResponseMsg(response.data.message)
        if(response.status === 200){
            setTostType('successMsg');
        }

        setLoading(false)
        setShowToast(true)
        setTimeout(() => {
            setShowToast(false)
        }, 3000);
        router.refresh()
        return
    }

  return (
    <div className='flex sm:flex-row flex-col justify-center mt-5 w-full h-full'>
        <div className="flex flex-col items-center w-full h-full">
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 p-1 rounded-md w-full md:w-2/3 lg:w-1/2">
                <div className="relative w-2/3 lg:w-1/2">
                    <input name='text' type="text" value={formData.title} onChange={(e) => {setFormData({...formData, title: e.target.value})}}required 
                        className="peer bg-zinc-800 p-2 border border-zinc-700 focus:border-indigo-500 rounded-md outline-none w-full h-10 text-white transition-all duration-200"
                    />
                    <label className="left-2 absolute bg-[#212121] px-1 rounded-sm text-gray-400 peer-focus:text-[#2196f3] peer-valid:text-[#2196f3] text-xs text-clip scale-100 peer-focus:scale-75 peer-valid:scale-75 transition-all translate-y-3 peer-focus:-translate-y-2 peer-valid:-translate-y-2 duration-200 pointer-events-none transform">
                        <span>name</span>
                    </label>
                </div>
                <div className="relative w-2/3 lg:w-1/2">
                    <textarea name='text' value={formData.message} onChange={(e) => {setFormData({...formData, message: e.target.value})}}required 
                        className="peer bg-zinc-800 p-2 border border-zinc-700 focus:border-indigo-500 rounded-md outline-none w-full h-20 text-white transition-all duration-200"
                    />
                    <label className="left-2 absolute bg-[#212121] px-1 rounded-sm text-gray-400 peer-focus:text-[#2196f3] peer-valid:text-[#2196f3] text-xs text-clip scale-100 peer-focus:scale-75 peer-valid:scale-75 transition-all translate-y-3 peer-focus:-translate-y-2 peer-valid:-translate-y-2 duration-200 pointer-events-none transform">
                        <span>message</span>
                    </label>
                </div>
                <div className="relative w-2/3 lg:w-1/2">
                    <input 
                        onKeyDown={handleInputKeyDown} 
                        onChange={(e) => {handleInputChange(e)}} 
                        value={inputValue} required
                        className="peer bg-zinc-800 p-2 border border-zinc-800 focus:border-indigo-500 rounded-md outline-none w-[97%] h-10 text-white transition-all duration-200" 
                        type="text"
                    />
                    {formData.tags&& 
                        <>
                            <div className="flex flex-wrap gap-2 mt-2 w-full h-20 overflow-auto">
                            {formData.tags.map((tag, index) => (
                                <span key={index} className="flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-full h-8 text-white text-sm">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(index)}
                                    className="flex justify-center items-center bg-zinc-700 rounded-full w-4 h-4"
                                >
                                    <span>x</span>
                                </button>
                                </span>
                            ))}
                            </div>
                        </>
                    }
                    <label className="top-0 left-4 absolute bg-zinc-800 px-1 border border-zinc-800 peer-focus:border-indigo-500 rounded-sm text-gray-400 text-md peer-focus:text-[#fff] peer-valid:text-[#fff] scale-100 peer-focus:scale-75 peer-valid:scale-75 transition-all translate-y-2 peer-focus:-translate-y-2 peer-valid:-translate-y-2 duration-200 pointer-events-none transform">
                    <span>Tags</span>
                    </label>
                </div>
                <div className="flex gap-3 w-2/3 lg:w-1/2">
                    {error.files && <p className="mb-1 text-red-500 text-xs">{error.files}</p>}
                    <div className="relative bg-purple-700 p-2 px-3 w-auto h-10">
                        Upload Profile pic
                        <input 
                            className='left-0 absolute opacity-0 w-full' 
                            type='file' 
                            onChange={(e)=>{
                                const file = e.target.files?.[0];
                                if (file) {
                                    setFiles(file);
                                }}} 
                            name='file' 
                            accept="image/*" 
                            required 
                            placeholder='Upload'/>
                    </div>
                    
                </div>
                <div className="w-2/3 lg:w-1/2">
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 p-2 rounded-md w-full font-semibold text-md">{loading? <PulseLoader color="#fff"/>:'Post'}</button>
                </div>
            </form>
            <button onClick={clear} className="bg-red-500 before:bg-red-400 p-2 rounded-md w-2/3 lg:w-1/3 font-semibold text-md" type="submit" value="Upload"><h1 className='font-semibold text-[1.2rem]'>Clear</h1></button>
        </div>
        {files && 
            <div className="flex justify-center">
                <Image width={100} height={100} className="w-full sm:w-85 h-2/3 object-contain" src={convertFileToUrl(files)} alt="Profile" />
            </div>
        }
        {showToast && <Toasts type={tostType==='warningMsg'?'warningMsg':'infoMsg'} msg={responseMsg}/>}
    </div>
  )
}

export default UploadForm
