import { string } from "zod/v4";

export interface Auth {
  name?: string;
  email?: string;
  picture?: string;
  password?: string;
  confirm?: string;
  file?: File
}

export interface Posts {
  id: string
  pictureURL: string
  message:string,
  title:string,
  tags: string[],
  song:{
        title: String,
        artist: String,
        previewUrl: String,
      }
  start:number;
  end:number
  like:{
    like: string[]
    likeCount: number
  }, 
  following:{
    count:string[]
  },
  follower:{
    count:string[]
  },
  user:{
    id: string,
    picture: string,
    name:string
  }
}

export interface Post{
    id:string,
    creator: string,
    title: string,
    message: string,
    tags:string[],
    pictureURL:string,
    createdAt:string,
    song:{
        title: String,
        artist: String,
        previewUrl: String,
      }
    start:number;
    end:number
}

export interface User {
  id: string,
  name: string,
  picture: string
  following:{
    count: string[]
  }
}

export interface Posts2 {
  id:string,
  pictureURL: string,
  creator:string
  message:string,
  title:string,
  owner:string,
  song:{
        title: String,
        artist: String,
        previewUrl: String,
      }
  start:number;
  end:number
  tags: [],
  originalname:string,
  like:{
    like:string[]
    likeCount:number
  }
  following:{
    count:string[]
  },
  follower:{
    count:string[]
  },
  user:{
    id: string,
    picture: string,
    name:string
  }
}

export interface User2 {
  follower: {
    count: string[]
    followerCount:number
  },
  following:{ 
    count: string[]
    folloingCount:number
  },
  id: string,
  name: string,
  picture: string,
  postcount:{
    postcount: number|undefined
  }
}

export type StoryElement = {
  id: string
  type: 'text' | 'image' | 'sticker'
  content: string
  bgColor?: string
  textColor?: string
  fontSize?: number
  x?: number
  y?: number
  width?: number
  height?: number
  z?:number
}

export interface Story {
  id:string,
  name:string
    picture:string
    follower: {
      count:string[]
    }
    stories:[{
      id:string
      userID:string
      imageUrl:string
      createdAt:string
      SongId: string,
      start: number,
      end: number
      views:{
        count:string[]
        storyviewsCount:number
      }
      song:{
        title: String,
        artist: String,
        previewUrl: String,
      }
    }]
}

export interface User3 {
  id: string,
  name: string,
  picture: string
}

export interface Track {
  _id: string;
  title: string;
  artist: string;
  previewUrl: string;
  duration: number;
  start: number; // user-selected start second
  end: number;   // user-selected end second
}

export enum PostUploadPage {
  page1 = 1,
  page2 = 2,
  page3 = 3,
}