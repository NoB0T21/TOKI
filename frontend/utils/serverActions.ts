import { cookies } from "next/headers"
import { api } from "./api"
import axios from "axios"

export const getuserfollowing = async () => {
    const token = (await cookies()).get('token')?.value

    const Ids = await axios.get('https://toki-backend-qw63.onrender.com/user/following',{
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true
    })
    return Ids.data.creatorIds
}

export const getstory = async ( form:string[]) => {
    const token = (await cookies()).get('token')?.value
    const data = await axios.put(`https://toki-backend-qw63.onrender.com/story/story/view`,
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