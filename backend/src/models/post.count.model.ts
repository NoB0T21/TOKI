import mongoose, { Schema, Types } from "mongoose";

interface Following{
    owner: Types.ObjectId,
    postcount: number
}

const postcountSchema:Schema<Following> = new mongoose.Schema({
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'user',
        unique: true
    },
    postcount: {
        type: Number,
        default: 0,
        min:0
    },
})

const PostCount = mongoose.models.PostCount || mongoose.model("PostCount", postcountSchema);
export default PostCount;
