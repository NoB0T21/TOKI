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
