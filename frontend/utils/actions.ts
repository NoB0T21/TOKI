'use client'
import { useQuery } from "@tanstack/react-query"
import Cookies from "js-cookie"
import { getProfiledata, getProfileFollowingdata } from "./clientAction"

const userId = Cookies.get('user') || ''

const fetchUserdata = async (userid: string) => {
  const res = await getProfiledata({id: userid || userId});
  const yo = {
    userId,
    res
  }
  return yo
}

export const useUserdata = (userid: string) => {
  return useQuery({
    queryKey: ["userData", userId],
    queryFn: () => fetchUserdata(userid),
    enabled: !!userid||!!userId,   // important 🔥
    staleTime: 1000 * 60 * 5,
    retry: 2,
    refetchOnWindowFocus: false
  })
}
