'use client'
import { api } from "./api";
import Cookies from "js-cookie"

export const removeusers = async ({CreatorId}:{CreatorId:string}) => {
    const token = Cookies.get('token');
    const Id = await api.get(`/post/follow/remove/${CreatorId}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
    return Id
}

export const followusers = async ({CreatorId}:{CreatorId:string}) => {
    const token = Cookies.get('token');
    const data = await api.get(`/post/follow/${CreatorId}`,{
        headers: {
        Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
    });
    return data
}

export const likePosts = async ({id}:{id:string}) => {
    const token = Cookies.get('token');
    const data = await api.get(`/post/like/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    return data
}

export const AuthFormapi = async ({path,form}:{path:string,form:any}) => {
    const data = await api.post(path,
        form,{
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
        })
    return data
}

export const postFormapi = async ({form}:{form:any}) => {
    const token = Cookies.get('token');
    const data = await api.post('/post/create',form,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true
    })
    return data
}

export const poststoryapi = async ({form}:{form:any}) => {
    const token = Cookies.get('token');
    const data = await api.post('/story/create',form,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true
    })
    return data
}

export const DeleteStory= async ({id}:{id:string}) => {
    const token = Cookies.get('token')
    const Ids = await api.get(`/story/delete/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true
    })
    return Ids.data.creatorIds
}

export const addviewStory= async ({id}:{id:string}) => {
    const token = Cookies.get('token')
    const Ids = await api.get(`/story/view/${id}`,{
        headers: {
            Authorization: `Bearer ${token}`,
        },
        withCredentials: true
    })
    return Ids.data
}