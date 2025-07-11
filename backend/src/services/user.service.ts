import follower from '../models/user.followers.model'
import following from '../models/user.following.model'
import User  from '../models/user.model'

interface EmailParam {
    name:string,
    email:string,
    picture:string,
    password:string
}

export const findUser =  async ({email}:{email:string|undefined}) => {
  const user = await User.findOne({email})
  if(!user)return null
  return user
}

export const registerUser = async ({ name, email,picture, password }: EmailParam) => {
  const data = await User.create({
    name,
    email,
    picture,
    password,
  });
  return data;
};

export const registerUserfollowings = async ({ userID }: {userID:any}) => {
  const data = await following.create({
    userID
  });
  return data;
};

export const registerUserfollowers= async ({ userID }: {userID:any}) => {
  const data = await follower.create({
    userID
  });
  return data;
};