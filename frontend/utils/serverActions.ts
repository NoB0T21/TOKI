import { cookies } from "next/headers"
import { api } from "./api"

export const getuserfollowing = async () => {
    const token = (await cookies()).get('token')?.value

    const Ids = await api.get('/user/following',{
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true
    })
    return Ids.data.creatorIds
}

export const getstory = async ( form:string[]) => {
    const token = (await cookies()).get('token')?.value
    const data = await api.put(`/story/story/view`,
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