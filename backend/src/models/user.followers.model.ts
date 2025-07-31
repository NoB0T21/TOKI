import mongoose, { Schema, Types } from "mongoose";

interface Following{
    userID: Types.ObjectId,
    count: Types.ObjectId[],
    followerCount:number
}

const followerSchema:Schema<Following> = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    count:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    followerCount:{
        type: Number,
        default:0,
        min:0
    }
})

const follower =mongoose.models.Follower || mongoose.model("Follower", followerSchema);
export default follower