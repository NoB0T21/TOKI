
import { useGoogleLogin } from "@react-oauth/google"
import { useState } from "react"
import { Google } from "./Icons";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import axios from "axios"
import Toasts from "./toasts/Toasts";
import Cookies from "js-cookie";

const GoogleForm = () => {
  const router=useRouter()
  const [showToast,setShowToast] = useState(false)
  const [responseMsg,setResponseMsg] = useState('')
  const [tostType,setTostType] = useState('warningMsg')

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async(res) => {
      setShowToast(false)
      
      try {
        const responses = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo',{
          headers:{
            Authorization: `Bearer ${res.access_token}`,
          }
        })
        if(responses.status === 200){
          localStorage.setItem('token',res.access_token)
          Cookies.set("token", res.access_token, {
            expires: 1, // days
            sameSite: "strict",
            secure: true
          });
        }

        const form = new FormData();
          form.append('name', responses.data.name || '');
          form.append('email', responses.data.email || '');
          form.append('password',responses.data.sub || '');
          form.append('picture', responses.data.picture || '');

        const response = await api.post(`/user/signup`,form,{withCredentials: true})
        if(response.status !== 201 || 202){
          setResponseMsg(response.data.message)
          setShowToast(true)
          setTimeout(() => {
            setShowToast(false)
        }, 6000);
          
        const raw = response.data.user;
          const user = {
            _id: raw._id,
            name: raw.name,
            email: raw.email,
            picture: raw.picture
          }
          localStorage.setItem('user', JSON.stringify(user));
          Cookies.set('user',user._id, { expires: 1 });
          router.push('/')
          return
        }
      } catch (error) {
          setResponseMsg('Login Fail')
          setTostType('warningMsg');
          setShowToast(true)
          setTimeout(() => {
          setShowToast(false)
        }, 6000);
        return
      }
    },

    onError: () => {
      setResponseMsg('Login Failed')
      setTostType('warningMsg');
      setShowToast(true)
      setTimeout(() => {
        setShowToast(false)
      }, 6000);
      return
    }
  })

  return (
    <>
      <div className=" max-w-[350px] w-2/3 lg:w-1/2">
        <button onClick={()=>handleGoogleLogin()} className="bg-[#29d1da] hover:bg-[#2EF6FF] hover:scale-103 p-1 rounded-md w-full transition-(scale) duration-300 ease-in-out font-semibold text-md">
          <div className="flex justify-center items-center gap-1 "><Google/>Google</div>
        </button>
      </div>
      {showToast && <Toasts type={tostType==='warningMsg'?'warningMsg':'infoMsg'} msg={responseMsg}/>}
    </>
  )
}

export default GoogleForm