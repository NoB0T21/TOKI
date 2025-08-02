import { Response, Request } from "express"
import uuid4 from "uuid4";
import supabase from "../Db/supabase";
import story from "../models/user.story.model";
import storyviews from "../models/story.views";
import { incstoryviewCount } from "../services/story.service";
import storyview from "../models/story.views";

export const AddStory = async (req:Request,res:Response) => {
    const { file } = req
    const {userID} = req.body
    if (!file || !userID) {
        res.status(400).json({
            message: "Require all fields",
            success: false,
        });
        return
    }

    try {
        const files = file.originalname.split(" ").join("");
        const uniqueFilename = `${uuid4()}-${files}`;
        
        const { data, error } = await supabase.storage
            .from("toki")
            .upload(uniqueFilename, file.buffer, {
                contentType: file.mimetype,
                cacheControl: "3600",
                upsert: false,
            });
        if (error) {
            res.status(500).json({
                message: "Server error",
                success: false,
            });
            return
        }
        
        const publicUrlData = await supabase.storage
            .from("toki")
            .getPublicUrl(`${uniqueFilename}`);
        
            
            const newFile = await story.create({
                userID,
                path: uniqueFilename,
                originalname: file?.originalname || "",
                imageUrl: publicUrlData.data.publicUrl || ""
            });

            const newsto = await storyview.create({
                storyID:newFile.id,
            });

        res.status(200).json({
            message: "File Uploaded successfully",
            newFile,
            success: true,
        });

        return
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
        return
    }
}

export const DeleteStory = async (req:Request,res:Response) => {
    const id = req.params.id
    if (!id) {
        res.status(400).json({
            message: "Require all fields",
            success: false,
        });
        return
    }

    try {
        const file = await story.findById(id)
        
         if(file){const { data, error } = await supabase.storage
             .from(process.env.BUCKET || 'toki')
             .remove([file.path]);

             if (error) {
                 res.status(500).json({
                     message: "Server error",
                     success: false,
                 });
             return
         }}
            
         const newFile = await story.findOneAndDelete({_id:id});

        res.status(200).json({
            message: "File Uploaded successfully",
            success: true,
        });

        return
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
        return
    }
}

export const AddviewStory = async (req:Request,res:Response) => {
    const id = req.params.id
    const userid = req.user._id
    if (!id) {
        res.status(400).json({
            message: "Require all fields",
            success: false,
        });
        return
    }

    try {
        const file = await storyviews.findOne({storyID:id})
        
        if(!file){
            return res.status(204).json({message:'Post Not Found'})
        }

        const index = file.count.indexOf(userid);
        if (index === -1) {
            file.count.push(userid); // addview
            const postlikecount = await incstoryviewCount({storyID:id});
        }
        
        await file.save();
        return res.status(200).json({
            message: "you Liked this post",
            success:true
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            success: false,
        });
        return
    }
}