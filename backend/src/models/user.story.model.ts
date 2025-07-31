import mongoose, { Schema, Types } from "mongoose";

interface Story{
    userID: Types.ObjectId,
    imageUrl: string,
    path: string,
    originalname: string,
    createdAt:Date,
    expiresAt:Date
}

const storySchema:Schema<Story> = new mongoose.Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    },
    imageUrl: { type: String, required: true },
    path: { type: String, required: true },
    originalname: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 86400000) }, // 24 hours
})

const story = mongoose.model<Story>('stories',storySchema)
export default story