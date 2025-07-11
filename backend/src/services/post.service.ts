import { Types } from "mongoose";
import postModel from '../models/posts.models'
import likeModel from '../models/like.model'
import PostCount from '../models/post.count.model'
import following from '../models/user.following.model'

interface files{
    creator:string,
    title:string,
    message:string,
    tags: string[],
    owner: string,
    path: string,
    originalname: string,
    pictureURL: string,
}

export const  createfile = async ({creator,title,message,tags,owner,path,originalname,pictureURL}:files) => {
  if(!creator || !path || !originalname || !pictureURL || !owner) return
  const file = await postModel.create({
      creator,
      title,
      message,
      tags,
      owner: new Types.ObjectId(owner),
      path,
      originalname,
      pictureURL,
  });
  
  const updatedPostcount = await PostCount.findOneAndUpdate(
    { owner: owner },
    { $inc: { postcount: 1 } },
    { upsert: true, new: true }
  );
 return file
}

export const  LikePost = async ({userID}:{userID:any}) => {
  if(!userID) return
  const file = await likeModel.create({
    userID
  });
  return file
}

export const  getLikePost = async ({PostId}:{PostId:any}) => {
  if(!PostId) return
  const file = await likeModel.findOne({
    userID: PostId
  });
 return file
}

export const  inclikeCount = async ({PostId}:{PostId:any}) => {
  if(!PostId) return
  const updatedPostCount = await likeModel.findOneAndUpdate(
    { userID: PostId },           // Find by owner ID
    { $inc: { likeCount: 1 } },  // increment by 1
    { new: true }                 // Return the updated document
  );
 return
}

export const  declikeCount = async ({PostId}:{PostId:any}) => {
  if(!PostId) return
  const updatedPostCount = await likeModel.findOneAndUpdate(
    { userID: PostId },           // Find by owner ID
    { $inc: { likeCount: -1 } },  // Decrement by 1
    { new: true }                 // Return the updated document
  );
 return
}

export const  getuserfollowing = async ({userId}:{userId:string}) => {
  if(!userId) return
  const file = await following.findOne({
    userID: userId
  });
 return file
}

export const  incfollowingCount = async ({userId}:{userId:string}) => {
  if(!userId) return
  const updatedPostCount = await following.findOneAndUpdate(
    { userID: userId },           // Find by owner ID
    { $inc: { folloingCount: 1 } },  // increment by 1
    { new: true }                 // Return the updated document
  );
 return
}

export const  decfollowingCount = async ({userId}:{userId:string}) => {
  if(!userId) return
  const updatedPostCount = await following.findOneAndUpdate(
    { userID: userId },           // Find by owner ID
    { $inc: { folloingCount: -1 } },  // Decrement by 1
    { new: true }                 // Return the updated document
  );
 return
}