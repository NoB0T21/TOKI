import mongoose, { Schema} from "mongoose";

interface Song{
    title: String,
    artist: String,
    previewUrl: String,
    duration: Number  
}

const songSchema:Schema<Song> = new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    artist:{
        type:String,
        required: true
    },
    previewUrl:{
        type:String,
        required: true
    },
    duration:{
        type:Number,
    }
})

const songs = mongoose.model<Song>('songs',songSchema)
export default songs