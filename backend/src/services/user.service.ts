import { lookup } from 'node:dns'
import follower from '../models/user.followers.model'
import following from '../models/user.following.model'
import user from '../models/user.model'
import User  from '../models/user.model'
import mongoose from "mongoose";

interface EmailParam {
    name:string,
    email:string,
    picture:string,
    password:string,
    provider:string,
    subId:string
}

export const findUser =  async ({email}:{email:string|undefined}) => {
  const user = await User.findOne({email})
  if(!user)return null
  return user
}

export const findUserByEmailANdUpdate =  async ({email,provider, subId}:{email:string, provider:string, subId:string}) => {
  const user = await User.findOneAndUpdate(
    {email},
    {provider, subId},
    {new: true}
  )
  if(!user)return null
  return user
}

export const registerUser = async ({ name, email,picture, password, provider='local', subId=''}: EmailParam) => {
  const data = await User.create({
    name,
    email,
    picture,
    password,
    provider: provider,
    subId: subId
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

export const getUserFollowings = async (userId:string) => {
  const id = new mongoose.Types.ObjectId(userId);
  const result = await user.aggregate([
    {
      $match:{
        _id: id
      }
    },
    {
      $facet:{
        user:[
          {
            $lookup:{
              from: "followers",
              let: { uid: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$userID", "$$uid"] } } },
                {
                  $group: {
                    _id: null,
                    followerCount: {$sum: "$followerCount"},
                    count: { $push: "$count" }
                  }
                }
              ],
              as: "followers"
            },
          },
          {
            $lookup: {
              from: "followings",
              let: { uid: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$userID", "$$uid"] } } },
                {
                  $group: {
                    _id: null,
                    folloingCount: { $sum: "$folloingCount" },
                    count: { $push: "$count" }
                  }
                }
              ],
              as: "following"
            }
          },
          {
            $lookup: {
              from: "postcounts",
              let: { uid: "$_id" },
              pipeline: [
                { $match: { $expr: { $eq: ["$owner", "$$uid"] } } },
                { 
                  $group: {
                    _id: null,
                    postcount: {$sum: "$postcount"}
                  }
                }
              ],
              as: "postcount"
            }
          },
          {
            $project: {
              name: 1,
              picture: 1,
              follower: { $arrayElemAt: ["$followers", 0] },
              postcount: { $arrayElemAt: ["$postcount", 0] },
              following: { $arrayElemAt: ["$following", 0] }
            }
          }
        ],
        posts:[
          {
            $lookup: {
              from: "posts",
              let: {uid: "$_id"},
              pipeline: [
                { $match: { $expr: { $eq: ["$owner", "$$uid"] } } },
                { $sort: { _id: -1 } },
                { $limit: 16 },
                {
                  $lookup: {
                    from: "songs",
                    localField: "SongId",
                    foreignField: "_id",
                    as: "song"
                  },
                },
                {$unwind: {
                  path: "$song",
                  preserveNullAndEmptyArrays: true
                },},
                {
                  $lookup:{
                    from: "followers",
                    let: { uid: "$owner" },
                    pipeline: [
                      { $match: { $expr: { $eq: ["$userID", "$$uid"] } } },
                      {
                        $group: {
                          _id: null,
                          followerCount: {$sum: "$followerCount"},
                          count: { $first: "$count" }
                        }
                      }
                    ],
                    as: "followers"
                  },
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
                  $project: {
                    id: "$_id",
                    pictureURL: 1,
                    owner: 1,
                    creator: 1,
                    message: 1,
                    tags: 1,
                    createdAt: 1,
                    title: 1,
                    start: 1,
                    end: 1,
                    follower: { $arrayElemAt: ["$followers", 0] },
                    user: {
                      id: "$user._id",
                      name: "$user.name",
                      picture: "$user.picture"
                    },
                    song: {
                      title: "$song.title",
                      artist: "$song.artist",
                      previewUrl: "$song.previewUrl"
                    },
                    like:{
                      like: "$likes.like",
                      likeCount: "$likes.likeCount"
                    }
                  }
                }
              ],
              as: "posts"
            }
          }
        ]
      },
    },
    {
      $project: {
        user: { $arrayElemAt: ["$user", 0] },
        posts: { $arrayElemAt: ["$posts.posts", 0] }
      }
    }
  ]);
  return result[0];
};

export const getUserFollowingsData = async (userId:string[]) => {
  const id = userId.map( item => new mongoose.Types.ObjectId(item))
  const result = await user.aggregate([
    {
      $match:{
        _id: { $in: id }
      }
    },
    {
      $lookup:{
        from: "followers",
        localField: "_id",
        foreignField: "userID",
        pipeline: [
          { $sort: { _id: -1 } },
          {
            $group: {
              _id: "$userID",
              count: { $push: "$count" },
              userID: { $first: "$userID" }
            }
          }
        ],
        as: "followers"
      },
    },
    {
      $lookup: {
        from: "followings",
        localField: "_id",
        foreignField: "userID",
        pipeline: [
          {
            $group: {
              _id: "$userID",
              count: { $push: "$count" },
              userID: { $first: "$userID" }
            }
          }
        ],
        as: "following"
      }
    },
    {
      $project: {
        _id: 1,
        name: 1,
        picture: 1,
        follower: { $arrayElemAt: ["$followers", 0] },
        following: { $arrayElemAt: ["$following", 0] }
      }
    }
  ]);
  return result;
};

export const getuserbyids = async (userId:string[]) => {
  const id = userId.map( item => new mongoose.Types.ObjectId(item))
  const result = await user.find({
    _id: { $in: id }
  }).select('_id name picture');
  return result;
};