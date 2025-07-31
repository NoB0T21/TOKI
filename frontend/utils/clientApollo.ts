
export const getUserPosts = async ({userId,skip,getuserPost}:{userId:string,skip:number,getuserPost:any}) =>{
    const { data } = await getuserPost({
      variables: {
        offset: skip*10,
        limit: 10,
        excludeOwner: userId
      },
    })
    return data.exploreposts
}

export const getUserPosts2 = async ({userId,skip,getuserPost}:{userId:string,skip:number,getuserPost:any}) =>{
    const { data } = await getuserPost({
      variables: {
        offset: skip*10,
        limit: 10,
        owner: userId
      },
    })
    return data.posts
}

export const getFollowingList = async ({followinglist,skip,getuserList}:{followinglist:string[],skip:number,getuserList:any}) => {
    const { data } = await getuserList({
        variables: {
        userIds: followinglist,
        offset: skip*10,
        limit: 10,
        },
    })
    return data.followinguser
}

export const getFollowingPosts= async ({ids,skip,getfollowingPost}:{ids:string[],skip:number,getfollowingPost:any}) => {
    const { data } = await getfollowingPost({
        variables: {
          offset: skip*10,
          limit: 10,
          homeOwner: ids
        },
      })
    return data.homeposts
}