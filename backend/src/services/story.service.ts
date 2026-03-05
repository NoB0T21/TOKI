import mongoose from "mongoose";
import storyview from "../models/story.views";
import storyModel from "../models/user.story.model";
import { getuserbyids } from "./user.service";
import user from "../models/user.model";

export const  incstoryviewCount = async ({storyID}:{storyID:any}) => {
  if(!storyID) return
  const updatedPostCount = await storyview.findOneAndUpdate(
    { storyID: storyID },           // Find by owner ID
    { $inc: { storyviewsCount: 1 } },  // increment by 1
    { new: true }                 // Return the updated document
  );
 return
}

export const  getuserStoryByids = async (userId:string[]) => {
  if(!userId || userId.length === 0) return
  const id = userId.map( item => new mongoose.Types.ObjectId(item))
  const data = await storyModel.find({
    userID: { $in: id },
    expiresAt: { $gte: new Date(Date.now()) },
  })
  .sort({ createdAt: -1 })
  .select('userID');
  console.log(data)
  if(data) return getuserbyids(data.map(item => item.userID.toString()))
}

export const  getStory = async (userId:string[], date:any = new Date(Date.now())) => {
  const objectIds = userId.map(id => new mongoose.Types.ObjectId(id));

const result = await user.aggregate([
  {
    $match: {
      _id: { $in: objectIds }
    }
  },

  // Followers count
  {
    $lookup: {
      from: "followers",
      localField: "_id",
      foreignField: "userID",
      pipeline: [
        {
          $group: {
            _id: null,
            followerCount: {$sum: "$followerCount"},
            count: { $first: "$count" }
          }
        }
      ],
      as: "followers"
    }
  },

  // Stories with song
  {
    $lookup: {
      from: "stories",
      let: { uid: "$_id" },
      pipeline: [
        {
          $match: {
            $expr: { 
              $and: [
                { $eq: ["$userID", "$$uid"] },
                { $lte: ["$createdAt", date] },
                { $gte: ["$expiresAt", date] }
              ]
          }
        },},
        { $sort: { createdAt: -1 } },

        // 🔥 Lookup song inside stories
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
            from: "storyviews",
            localField: "_id",
            foreignField: "storyID",
            as: "storyview"
          }
        },
        {
          $unwind: {
            path: "$storyview",
            preserveNullAndEmptyArrays: true
          }
        },

        // Clean story output
        {
          $project: {
            _id: 1,
            imageUrl: 1,
            createdAt: 1,
            start: 1,
            end: 1,
            song: {
              title: "$song.title",
              artist: "$song.artist",
              previewUrl: "$song.previewUrl"
            },
            view: {
              count: "$storyview.count",
              storyviewsCount:"$storyview.storyviewsCount"
            }
          }
        }
      ],
      as: "stories"
    }
  },
  {
    $match: {
      stories: { $ne: [] }
    }
  },
  {
    $project: {
      _id: 1,
      name: 1,
      picture: 1,
      followerCount: { $arrayElemAt: ["$followers", 0] },
      stories: 1
    }
  }
]);
  return result
}