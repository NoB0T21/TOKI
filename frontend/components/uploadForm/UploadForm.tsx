'use client'

import { convertFileToUrl, fetchAICompletion, fetchAITegs } from "@/utils/utils";
import { useEffect, useState } from "react";
import { PulseLoader } from "react-spinners";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Toasts from "../toasts/Toasts";
import { postFormapi } from "@/utils/clientAction";
import { Discribtion, Gemini, Tags, Title } from "../Icons";
import MusicSelect from "../story/MusicSelect";
import {PostUploadPage, Track} from '../../Types/types'
import PageButtons from "./PageButtons";
import MockPostcard from "../card/MockPostcard";
import Link from "next/link";

const formSchema = z.object({
    creator: z.string().min(1, "creator required"),
    owner: z.string().min(1,"owner required"),
    files: z.instanceof(File, { message: 'A valid file is required' }),
})

const UploadForm = () => {
    const router = useRouter()
    const [user,SetUser] = useState<any>()
    const [pages,SetPages] = useState<PostUploadPage>(PostUploadPage.page1)
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
    const raw = localStorage.getItem('user')
    const use = raw ? JSON.parse(raw) : null
    if (!use) return
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

        const res = await fetchAICompletion({ prompt, context });
        console.log(res)
        setFormData((prev) => ({ ...prev, message: prompt + res }));

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

            const res = await fetchAITegs({ title, message })
                setInputValue((prev) => 
                prev + res,);
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
            };


        setIsGenerating(false);
        setShowtag(false)
    }

    const handleChange = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target.value;
        setFormData({ ...formData, message: value });

        const lastChar = value.slice(-1);

        if (!value.includes("/")) setShow(false)

        if (value.includes("/")) {
            setShow(true)
        }
    };

    const handleTrackSelect = (track: Track & { start: number, end: number }) => {
        // Save to state or send to backend
        setTrack(track)
    };
    
  return (
    <>
        {/* Header */}
        <div className="sticky top-0 z-50 glass border-b border-border px-4 py-3">
            <div className="flex items-center justify-between">
            <PageButtons pages={pages} SetPages={SetPages}/>
            <h2 className="text-base font-semibold font-display text-foreground">New Post</h2>
            <Link href="/">
                <div className="h-6 w-6 text-foreground text-center">x</div>
            </Link>
            </div>
        </div>
        <div className='flex sm:flex-row flex-col justify-center w-full h-full'>
            <div className="flex flex-col items-center w-full h-full ">
                <form className="flex flex-col gap-3 items-center w-full h-120 overflow-y-scroll">
                    <div className="flex relative justify-start items-start w-full">
                        <MockPostcard 
                            pictureURL={files ? convertFileToUrl(files):''} 
                            message={formData.message}
                            song={Track}
                            tags={formData.tags}
                            name={formData.title}
                        />
                        <input 
                            className='left-0 absolute opacity-0 w-full h-3/4 z-20' 
                            type='file' 
                            onChange={(e)=>{
                                const file = e.target.files?.[0];
                                if (file) {
                                    setFiles(file);
                                }}} 
                            name='file' 
                            accept="image/*" 
                            required 
                            placeholder='Upload'
                        />
                    </div>
                    <div className="flex flex-col gap-4 px-1.5 py-2 rounded-md w-full">
                        {PostUploadPage.page1 === pages &&
                            <MusicSelect reg={60} onSelect={handleTrackSelect}/>
                        }
                        {PostUploadPage.page2 === pages &&
                            <>
                                <div className="relative flex w-full max-w-120 gap-1">
                                    <div className="size-4 flex justify-center items-center text-muted-foreground h-12"><Title/></div>
                                    <input 
                                        name='text' 
                                        type="text" 
                                        value={formData.title} 
                                        onChange={(e) => {setFormData({...formData, title: e.target.value})}}
                                        required
                                        placeholder="title"
                                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground h-12 border-b border-border focus:outline-none"
                                    />
                                </div>
                                {isGenerating && <div className="border-2 border-t-transparent border-blue-400 rounded-full w-5 h-5 animate-spin"></div>}
                                <div className="relative flex items-start w-full gap-1 max-w-120">
                                    <div className="size-4 flex justify-center items-start text-muted-foreground h-12"><Discribtion/></div>
                                    <textarea 
                                        disabled={isGenerating} 
                                        name='text' 
                                        value={formData.message} 
                                        onChange={(e) => {handleChange(e)}}
                                        required 
                                        placeholder="write discribtion"
                                        className="w-full bg-transparent text-sm text-foreground border-b border-border placeholder:text-muted-foreground resize-none h-24 focus:outline-none"
                                    />
                                    {show && 
                                        <div 
                                            onClick={()=>prompttext({lastChar:'\n',value:formData.message||''})} 
                                            className="z-2 absolute flex justify-start items-center gap-3 bg-[#1a1e23] px-2 border-[#3e4a57] border-1 rounded-md h-10 text-[#b0bec5]"
                                        ><div className="size-6"><Gemini/></div>Generate Text or Complete Sentence</div>
                                    }
                                </div>
                                <div className="relative w-full items-start flex gap-1 max-w-120">
                                    <div className="size-4 flex justify-center items-center text-muted-foreground h-12"><Tags/></div>
                                    <input 
                                        onKeyDown={handleInputKeyDown}
                                        disabled={isGenerating} 
                                        onChange={(e) => {handleInputChange(e)}} 
                                        value={inputValue}
                                        placeholder="Tags"
                                        className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground h-12 focus:outline-none" 
                                        type="text"
                                    />
                                </div>
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
                            </>
                        }
                        <div className="relative w-full max-w-120">
                            {PostUploadPage.page2 === pages &&
                                <button onClick={handleSubmit} disabled={isGenerating || formData?.tags.length > 15} type="submit" className="bg-gradient-to-bl hover:bg-gradient-to-tr from-[#1ed1db] to-[#2daaae] p-1 rounded-md w-full font-semibold text-md transition-all duration-300 ease-in-out">{loading? <PulseLoader color="#fff"/>:'Post'}</button>
                            }
                        </div>
                    </div>
                </form>
            </div>
            {showToast && <Toasts type={tostType==='warningMsg'?'warningMsg':'infoMsg'} msg={responseMsg}/>}
        </div>
    </>
  )
}

export default UploadForm
