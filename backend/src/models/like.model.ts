import mongoose, { Schema, Types } from "mongoose";

interface Like{
    userID: Types.ObjectId,
    like: Types.ObjectId[],
    likeCount:number
}

const followingSchema:Schema<Like> = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'posts'
    },
    like:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    likeCount:{
        type: Number,
        default:0,
        min:0
    }
})

const like = mongoose.model<Like>('Like',followingSchema)
export default like