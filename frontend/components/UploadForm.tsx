'use client'

import { convertFileToUrl, fetchAICompletion, fetchAITegs } from "@/utils/utils";
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Toasts from "./toasts/Toasts";
import { postFormapi } from "@/utils/clientAction";
import { Gemini } from "./Icons";
import { tryLoadManifestWithRetries } from "next/dist/server/load-components";
import MusicSelect from "./story/MusicSelect";
import {Track} from '../Types/types'

const formSchema = z.object({
    creator: z.string().min(1, "creator required"),
    owner: z.string().min(1,"owner required"),
    files: z.instanceof(File, { message: 'A valid file is required' }),
})

const UploadForm = () => {
    const router = useRouter()
    const [user,SetUser] = useState<any>()
    const [formData, setFormData] = useState<{
        creator: string;
        title?: string;
        message?: string;
        tags: string[];
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
    const [Track, setTrack] = useState<Track>()
    const [loading,setLoading] = useState(false)
    const [inputValue, setInputValue] = useState('');
    const [showToast,setShowToast] = useState(false)
    const [show,setShow] = useState(false)
    const [showtag,setShowtag] = useState(false)
    const [responseMsg,setResponseMsg] = useState('')
    const [tostType,setTostType] = useState('warningMsg')
    const [isGenerating, setIsGenerating] = useState(false);
    
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let vlue =e.target.value
        setInputValue(e.target.value);
        if (!vlue.includes("/")) setShowtag(false)
            if (vlue.includes("/")) setShowtag(true)
            };
        
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
    
useEffect(() => {
    const use = JSON.parse(localStorage.getItem('user') || '')
    SetUser(use)
    setFormData({
        creator:use?.name, 
        title:'',
        message:'',
        tags:[],
        owner:use?._id,
    })
}, []);

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

        if(formData.tags.length > 15){
            setTostType('infoMsg')
            setShowToast(true)
            setResponseMsg('not more than 15 tags ')
            setTimeout(() => {
                setShowToast(false)
            }, 3000);
            return
        }

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
            console.log(formData)
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
            form.append('SongId', Track?._id || '')
            form.append('start', Track?.start.toString() || '0')
            form.append('end', Track?.end.toString() || '30')
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
        router.push('/profile')
        return
    }

    const prompttext = async ({lastChar,value}:{lastChar:string,value:string}) => {
        // If the last character typed is a space or Enter
        if (lastChar === "\n") {
        const [promptPart, contextPart] = value.split("/").map((s) => s.trim());
        const prompt = promptPart || "";
        const context = contextPart || "";

        setIsGenerating(true);

        // Set only the prompt part before AI continues
        setFormData((prev) => ({ ...prev, message: prompt }));

        await fetchAICompletion({ prompt, context }, (chunk) => {
            const cleanedChunk = chunk.startsWith(prompt)
            ? chunk.slice(prompt.length).trimStart()
            : chunk;

            setFormData((prev) => ({
            ...prev,
            message: prev.message + cleanedChunk,
            }));
        });

        setIsGenerating(false);
        setShow(false)
        }
    }

    const prompttag = async ({lastChar,title,message}:{lastChar:string,title:string,message:string}) => {
        // If the last character typed is a space or Enter
        if (lastChar === "\n") {
            const [promptPart, contextPart] = inputValue.split("/").map((s) => s.trim());
        setInputValue(`${promptPart}, ${contextPart}`)
        setIsGenerating(true);

        const res = await fetchAITegs({ title, message }, (chunk) => {
            const cleanedChunk = chunk;

            setInputValue((prev) => 
            prev + cleanedChunk,);
        });
        if(res==='{"error":"Missing prompt"}'){
            setResponseMsg('Atleast write Message to generate tags')
            setShowToast(true)
            setTimeout(() => {
                setShowToast(false)
            }, 3000);
            setIsGenerating(false);
        setShowtag(false)
        return
        }


        setIsGenerating(false);
        setShowtag(false)
        }
    }

    const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFormData({ ...formData, message: value });

        const lastChar = value.slice(-1);

        if (!value.includes("/")) setShow(false)

        if (value.includes("/")) {
            setShow(true)
            prompttext({lastChar,value})
        }
    };

    const handleTrackSelect = (track: Track & { start: number, end: number }) => {
        // Save to state or send to backend
        setTrack(track)
    };
    

  return (
    <div className='flex sm:flex-row flex-col justify-center mt-5 w-full h-full'>
        <div className="flex flex-col items-center w-full h-full">
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4 p-1 rounded-md w-full">
                <div className="relative w-full md:w-2/3 max-w-120">
                    <input name='text' type="text" value={formData.title} onChange={(e) => {setFormData({...formData, title: e.target.value})}}required 
                        className="peer bg-zinc-800 p-2 border border-zinc-700 focus:border-indigo-500 rounded-md outline-none w-full h-10 text-white transition-all duration-200"
                    />
                    <label className="left-2 absolute bg-[#212121] px-1 rounded-sm text-gray-400 peer-focus:text-[#2196f3] peer-valid:text-[#2196f3] text-xs text-clip scale-100 peer-focus:scale-75 peer-valid:scale-75 transition-all translate-y-3 peer-focus:-translate-y-2 peer-valid:-translate-y-2 duration-200 pointer-events-none transform">
                        <span>name</span>
                    </label>
                </div>
                <div className="relative w-full md:w-2/3 max-w-120">
                    {isGenerating && <div className="border-2 border-t-transparent border-blue-400 rounded-full w-5 h-5 animate-spin"></div>}
                    <textarea disabled={isGenerating} name='text' value={formData.message} onChange={(e) => {handleChange(e)}}required 
                        className="peer bg-zinc-800 p-2 border border-zinc-700 focus:border-indigo-500 rounded-md outline-none w-full h-20 text-white transition-all duration-200"
                    />
                    <label className="left-2 absolute bg-[#212121] px-1 rounded-sm text-gray-400 peer-focus:text-[#2196f3] peer-valid:text-[#2196f3] text-xs text-clip scale-100 peer-focus:scale-75 peer-valid:scale-75 transition-all translate-y-3 peer-focus:-translate-y-2 peer-valid:-translate-y-2 duration-200 pointer-events-none transform">
                        <span>message</span>
                    </label>
                    {show && 
                        <div 
                            onClick={()=>prompttext({lastChar:'\n',value:formData.message||''})} 
                            className="z-2 absolute flex justify-start items-center gap-3 bg-[#1a1e23] px-2 border-[#3e4a57] border-1 rounded-md h-10 text-[#b0bec5]"
                        ><div className="size-6"><Gemini/></div>Generate Text or Complete Sentence</div>
                    }
                </div>
                <div className="relative w-full md:w-2/3 max-w-120">
                    <input 
                        onKeyDown={handleInputKeyDown}
                        disabled={isGenerating} 
                        onChange={(e) => {handleInputChange(e)}} 
                        value={inputValue}
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
                    {showtag && <div 
                        onClick={()=>prompttag({lastChar:'\n',title:formData.title||'',message:formData.message||''})} 
                        className="top-12 z-2 absolute flex justify-start items-center gap-3 bg-[#1a1e23] px-2 border-[#3e4a57] border-1 rounded-md h-10 text-[#b0bec5]"
                    ><div className="size-6"><Gemini/></div>Generate Tags</div>}

                    <label className="top-0 left-4 absolute bg-zinc-800 px-1 border border-zinc-800 peer-focus:border-indigo-500 rounded-sm text-gray-400 text-md peer-focus:text-[#fff] peer-valid:text-[#fff] scale-100 peer-focus:scale-75 peer-valid:scale-75 transition-all translate-y-2 peer-focus:-translate-y-2 peer-valid:-translate-y-2 duration-200 pointer-events-none transform">
                    <span>Tags</span>
                    </label>
                </div>
                <MusicSelect reg={60} onSelect={handleTrackSelect}/>
                <div className="flex gap-3 w-2/3 lg:w-1/2">
                    {error.files && <p className="mb-1 text-red-500 text-xs">{error.files}</p>}
                    <div className="relative bg-zinc-700 p-2 rounded-md w-auto h-10">
                        Upload youe post
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
                <div className="relative w-full md:w-2/3 max-w-80">
                    <button disabled={isGenerating || formData?.tags.length > 15} type="submit" className="bg-gradient-to-bl hover:bg-gradient-to-tr from-[#1ed1db] to-[#2daaae] p-1 rounded-md w-full font-semibold text-md transition-all duration-300 ease-in-out">{loading? <PulseLoader color="#fff"/>:'Post'}</button>
                </div>
            </form>
            <button onClick={clear} className="relative bg-red-500 before:bg-red-400 mt-5 p-1 rounded-md w-full md:w-2/3 max-w-80 font-semibold text-md" type="submit" value="Upload"><h1 >Clear</h1></button>
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
