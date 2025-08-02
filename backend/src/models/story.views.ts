import mongoose, { Schema, Types } from "mongoose";

interface StoryViews{
    storyID: Types.ObjectId,
    count: Types.ObjectId[],
    storyviewsCount:number
}

const storyviewSchema:Schema<StoryViews> = new mongoose.Schema({
    storyID:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    count:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    storyviewsCount:{
        type: Number,
        default:0,
        min:0
    }
})

const storyview = mongoose.model<StoryViews>('storyviews',storyviewSchema)
export default storyview