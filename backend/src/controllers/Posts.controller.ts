import { Request, Response } from "express";
import uuid from "uuid4";
import supabase from "../Db/supabase";
import { createfile,decfollowerCount,decfollowingCount,declikeCount, getcreatorFollower, getcreatorFollowing, getLikePost,incfollowerCount,incfollowingCount,inclikeCount, LikePost } from "../services/post.service";

export const uploadFile = async (request: Request, response: Response) => {
    const { file } = request;
    const {creator, title, message, tags, owner, SongId,start,end } = request.body;
    if (!file || !owner || !creator) {
        response.status(400).json({
            message: "Require all fields",
            success: false,
        });
        return
    }
    
    try {
        const files = file.originalname.split(" ").join("");
        const uniqueFilename = `${uuid()}-${files}`;
        
        const { data, error } = await supabase.storage
            .from("toki")
            .upload(uniqueFilename, file.buffer, {
                contentType: file.mimetype,
                cacheControl: "3600",
                upsert: false,
            });
        if (error) {
            response.status(500).json({
                message: "Server error",
                success: false,
            });
            return
        }
        
        const publicUrlData = await supabase.storage
            .from("toki")
            .getPublicUrl(`${uniqueFilename}`);
        
        const parsedTags = JSON.parse(tags);

        if(SongId){
             const newFile = await createfile({
            creator:creator,
            title:title,
            message:message,
            tags: parsedTags,
            owner: owner,
            path: uniqueFilename,
            originalname: file?.originalname || "",
            pictureURL: publicUrlData.data.publicUrl || "",
            SongId,
            start,
            end
        });
        
        const Postlike = await LikePost({
            userID: newFile?._id 
        })

        response.status(200).json({
            message: "File Uploaded successfully",
            newFile,
            success: true,
        });

        return
        }else{
             const newFile = await createfile({
            creator:creator,
            title:title,
            message:message,
            tags: parsedTags,
            owner: owner,
            path: uniqueFilename,
            originalname: file?.originalname || "",
            pictureURL: publicUrlData.data.publicUrl || ""
        });
        
        const Postlike = await LikePost({
            userID: newFile?._id 
        })

        response.status(200).json({
            message: "File Uploaded successfully",
            newFile,
            success: true,
        });

        return
        }
    } catch (error) {
        response.status(500).json({
            message: "Internal server error",
            success: false,
        });
        return
    }
};

export const likeFile = async (request: Request, response: any) => {
    const PostId = request.params.id
    const id = request.user._id
    if (!PostId) {
        response.status(400).json({
            message: "Require all fields",
            success: false,
        });
        return
    }
    
    try {
        const post = await getLikePost({PostId});
        if(!post){
            return response.status(204).json({message:'Post Not Found'})
        }

        const index = post.like.indexOf(id);
        if (index === -1) {
            post.like.push(id); // Like
            const postlikecount = await inclikeCount({PostId});
        } else {
            post.like.splice(index, 1); // Unlike
            const postlikecount = await declikeCount({PostId});
        }
        
        await post.save();
        return response.status(200).json({
            message: "you Liked this post",
            success:true
        })
    } catch (error) {
        response.status(500).json({
            message: "Internal server error",
            success: false,
        });
        return
    }
};

export const followuser = async (request: Request, response: Response) => {
    const creatorId:any =(request.params.id);
    const userId = request.user._id; // assuming req.user._id is available
    try {
        if (!creatorId || !userId) {
            return response.status(400).json({
                message: "Missing fields",
                success: false,
            });
        }

        const follower = await getcreatorFollower({ creatorId });
        const following = await getcreatorFollowing({ creatorId: userId });

        if (!follower || !following) {
            return response.status(404).json({ message: "User not found" });
        }

        const index = follower.count.findIndex((id:any) => id.toString() === userId.toString());
        const index2 = following.count.findIndex((id:any) => id.toString() === creatorId.toString());

        if (index === -1 && index2 === -1) {
            follower.count.push(userId);
            following.count.push(creatorId);
            await incfollowerCount({ creatorId });
            await incfollowingCount({ creatorId:userId });
        } else {
            follower.count.splice(index, 1);
            following.count.splice(index2, 1);
            await decfollowerCount({ creatorId });
            await decfollowingCount({ creatorId:userId });
        }

        await follower.save();
        await following.save();

        return response.status(200).json({
            message: index === -1 ? "Followed successfully" : "Unfollowed successfully",
            success: true,
        });
    } catch (error) {
        console.error("Error in followuser:", error);
        return response.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};

export const removeuser = async (request: Request, response: any) => {
    const creatorId:any = (request.params.id);
    const userId = request.user._id
    if (!creatorId||!userId) {
        response.status(400).json({
            message: "Require all fields",
            success: false,
        });
        return
    }
    
    try {
        const follower = await getcreatorFollower({ creatorId:userId });
        const following = await getcreatorFollowing({creatorId});
        if(!following || !follower){
            return response.status(204).json({message:'Post Not Found'})
        }

        const index = following.count.indexOf(userId);
        const index2 = follower.count.findIndex((id:any) => id.toString() === creatorId.toString());
        if (index === -1) {
            return response.status(200).json({
            message: "you Liked this post",
            success:true
        })
        } else {
            following.count.splice(index, 1); // Unfollow
            follower.count.splice(index2, 1);
            const postlikecount = await decfollowingCount({creatorId});
            const postlikecounts = await decfollowerCount({creatorId:userId});
        }
        
        await following.save();
        await follower.save();
        return response.status(200).json({
            message: "you Liked this post",
            success:true
        })
    } catch (error) {
        response.status(500).json({
            message: "Internal server error",
            success: false,
        });
        return
    }
};