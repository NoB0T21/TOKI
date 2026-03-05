import mongoose, { Types } from "mongoose";
import postModel from '../models/posts.models'
import likeModel from '../models/like.model'
import PostCount from '../models/post.count.model'
import following from '../models/user.following.model'
import follower from "../models/user.followers.model";

interface files{
    creator:string,
    title:string,
    message:string,
    tags: string[],
    owner: string,
    path: string,
    originalname: string,
    pictureURL: string,
    SongId?: string,
    start?: number,
    end?: number,
}

export const  createfile = async ({creator,title,message,tags,owner,path,originalname,pictureURL,SongId,start,end }:files) => {
  if(!creator || !path || !originalname || !pictureURL || !owner) return
  let file
  if(SongId){
    file = await postModel.create({
      creator,
      title,
      message,
      tags,
      owner: new Types.ObjectId(owner),
      path,
      originalname,
      SongId,
      start,
      end,
      pictureURL,
  });
  }else{
    file = await postModel.create({
        creator,
        title,
        message,
        tags,
        owner: new Types.ObjectId(owner),
        path,
        originalname,
        pictureURL,
    });
  }
  
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

export const  getcreatorFollower = async ({creatorId}:{creatorId:any}) => {
  if(!creatorId) return
  const file = await follower.findOne({
    userID: creatorId
  });
 return file
}

export const  getcreatorFollowing = async ({creatorId}:{creatorId:any}) => {
  if(!creatorId) return
  const file = await following.findOne({
    userID: creatorId
  });
 return file
}

export const  incfollowerCount = async ({creatorId}:{creatorId:any}) => {
  if(!creatorId) return
  const updatedPostCount = await follower.findOneAndUpdate(
    { userID: creatorId },           // Find by owner ID
    { $inc: { followerCount: 1 } },  // increment by 1
    { new: true }                 // Return the updated document
  );
 return
}

export const  decfollowerCount = async ({creatorId}:{creatorId:any}) => {
  if(!creatorId) return
  const updatedPostCount = await follower.findOneAndUpdate(
    { userID: creatorId },           // Find by owner ID
    { $inc: { followerCount: -1 } },  // Decrement by 1
    { new: true }                 // Return the updated document
  );
 return
}

export const  incfollowingCount = async ({creatorId}:{creatorId:any}) => {
  if(!creatorId) return
  const updatedPostCount = await following.findOneAndUpdate(
    { userID: creatorId },           // Find by owner ID
    { $inc: { folloingCount: 1 } },  // increment by 1
    { new: true }                 // Return the updated document
  );
 return
}

export const  decfollowingCount = async ({creatorId}:{creatorId:any}) => {
  if(!creatorId) return
  const updatedPostCount = await following.findOneAndUpdate(
    { userID: creatorId },           // Find by owner ID
    { $inc: { folloingCount: -1 } },  // Decrement by 1
    { new: true }                 // Return the updated document
  );
 return
}

export const  getExplorePostExcludeingUser = async (userId:string, page:number = 1) => {
  if(!userId) return
  const limit = 16;
  const skip = (page - 1) * limit;
  const result = await postModel.aggregate([
    {
      $match: {
        owner: { $ne: userId }
      }
    },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "songs",
        localField: "SongId",
        foreignField: "_id",
        as: "song"
      }
    },
    {
      $unwind: {
        path: "$song",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "likes",
        let: { userID: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$userID", "$$userID"] }
            }
          }
        ],
        as: "likes"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $lookup:{
        from: "followers",
        let: { uid: "$owner" },
        pipeline: [
          { $match: { $expr: { $eq: ["$userID", "$$uid"] } } },
          {
            $group: {
              _id: "$_id",
              followerCount: {$sum: "$followerCount"},
              count: { $first: "$count" }
            }
          }
        ],
        as: "followers"
      },
    },
    {
      $project: {
        id: "$_id",
        pictureURL: 1,
        owner: 1,
        creator: 1,
        message: 1,
        tags: 1,
        title: 1,
        start: 1,
        end: 1,
        song: {
          title: "$song.title",
          artist: "$song.artist",
          previewUrl: "$song.previewUrl"
        },
        follower: { $arrayElemAt: ["$followers", 0] },
        user: {
          id: "$user._id",
          name: "$user.name",
          picture: "$user.picture"
        },
        like:{
          like: "$likes.like",
          likeCount: "$likes.likeCount"
        }
      }
    }
  ]);
  return result;
}

export const  getProfilePostByIds = async (userId:string[], page:number = 1) => {
  const ids = userId.map( item => new mongoose.Types.ObjectId(item))
  if(!userId) return
  const limit = 16;
  const skip = (page - 1) * limit;
  const result = await postModel.aggregate([
    {
      $match: {
        owner: { $in: ids }
      }
    },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "songs",
        localField: "SongId",
        foreignField: "_id",
        as: "song"
      }
    },
    {
      $unwind: {
        path: "$song",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "likes",
        let: { userID: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$userID", "$$userID"] }
            }
          }
        ],
        as: "likes"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $lookup:{
        from: "followers",
        let: { uid: "$owner" },
        pipeline: [
          { $match: { $expr: { $eq: ["$userID", "$$uid"] } } },
          {
            $group: {
              _id: "$_id",
              followerCount: {$sum: "$followerCount"},
              count: { $first: "$count" }
            }
          }
        ],
        as: "followers"
      },
    },
    {
      $project: {
        id: "$_id",
        pictureURL: 1,
        owner: 1,
        creator: 1,
        message: 1,
        tags: 1,
        title: 1,
        start: 1,
        end: 1,
        createdAt: 1,
        song: {
          title: "$song.title",
          artist: "$song.artist",
          previewUrl: "$song.previewUrl"
        },
        follower: { $arrayElemAt: ["$followers", 0] },
        user: {
          id: "$user._id",
          name: "$user.name",
          picture: "$user.picture"
        },
        like:{
          like: "$likes.like",
          likeCount: "$likes.likeCount"
        }
      }
    }
  ]);
  return result;
}

export const  getProfilePosts = async (userId:string, page:number = 1) => {
  const ids = new mongoose.Types.ObjectId(userId)
  if(!userId) return
  const limit = 16;
  const skip = (page - 1) * limit;
  const result = await postModel.aggregate([
    {
      $match: {
        owner: ids
      }
    },
    { $skip: skip },
    { $limit: limit },
    {
      $lookup: {
        from: "songs",
        localField: "SongId",
        foreignField: "_id",
        as: "song"
      }
    },
    {
      $unwind: {
        path: "$song",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $lookup: {
        from: "likes",
        let: { userID: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$userID", "$$userID"] }
            }
          }
        ],
        as: "likes"
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
    {
      $lookup:{
        from: "followers",
        let: { uid: "$owner" },
        pipeline: [
          { $match: { $expr: { $eq: ["$userID", "$$uid"] } } },
          {
            $group: {
              _id: "$_id",
              followerCount: {$sum: "$followerCount"},
              count: { $first: "$count" }
            }
          }
        ],
        as: "followers"
      },
    },
    {
      $project: {
        id: "$_id",
        pictureURL: 1,
        owner: 1,
        creator: 1,
        message: 1,
        tags: 1,
        title: 1,
        start: 1,
        end: 1,
        createdAt: 1,
        song: {
          title: "$song.title",
          artist: "$song.artist",
          previewUrl: "$song.previewUrl"
        },
        follower: { $arrayElemAt: ["$followers", 0] },
        user: {
          id: "$user._id",
          name: "$user.name",
          picture: "$user.picture"
        },
        like:{
          like: "$likes.like",
          likeCount: "$likes.likeCount"
        }
      }
    }
  ]);
  return result;
}