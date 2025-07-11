import mongoose, { Schema, Types } from "mongoose";

interface Following{
    userID: Types.ObjectId,
    count: Types.ObjectId[],
    folloingCount:number
}

const followingSchema:Schema<Following> = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    count:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    folloingCount:{
        type: Number,
        default:0
    }
})

const following = mongoose.model<Following>('followings',followingSchema)
export default following