'use client'
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { getProfiledata, getProfileFollowingdata } from "./clientAction"

const user = JSON.parse(localStorage.getItem('user') || '{}')

const fetchUserdata = async (userid: string) => {
  const res = await getProfiledata({id: userid || user._id});
  const yo = {
    userId:user._id,
    res
  }
  return yo
}

export const useUserdata = (userid: string) => {
  return useQuery({
    queryKey: ["userData", user._id],
    queryFn: () => fetchUserdata(userid),
    enabled: !!userid||!!user._id,   // important 🔥
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false
  })
}
