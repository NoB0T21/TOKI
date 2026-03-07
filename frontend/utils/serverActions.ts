import { cookies } from "next/headers"
import axios from "axios"
const url = 'https://toki-backend-qw63.onrender.com'
// http://localhost:4000
export const getuserfollowing = async () => {
    const token = (await cookies()).get('token')?.value
    try {
      
      const Ids = await axios.get(`${url}/user/following`,{
          headers: {
              Authorization: `Bearer ${token}`,
          },
          withCredentials: true
      })
      return Ids.data.creatorIds
    } catch (error) {
      console.log('error',error)
    }
}

export const getstory = async ( form:string[]) => {
    const token = (await cookies()).get('token')?.value
    const data = await axios.put(`${url}/story/story/view`,
        {ids: form},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return data.data.data
}