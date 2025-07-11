import mongoose, { Schema, Types } from "mongoose";

interface Post{
    creator: string,
    title: string,
    message: string,
    tags:string[],
    pictureURL:string,
    originalname: string,
    path: string,
    createdAt:string,
    owner:Types.ObjectId
}

const postSchema:Schema<Post> = new mongoose.Schema({
    creator:{
        type:String
    },
    title:{
        type:String
    },
    message:{
        type:String
    },
    tags:[{
        type:String
    }],
    pictureURL:{
        type:String
    },
    originalname:{
        type:String
    },
    path:{
        type:String
    },
    createdAt:{
        type:String,
        default: () => {
        const now = new Date();
        // Convert UTC to IST (UTC + 5:30)
        const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in milliseconds
        const istTime = new Date(now.getTime() + istOffset);
        return istTime.toISOString();
    }},
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user'
    }
})

const post = mongoose.model<Post>('Posts',postSchema)
export default post