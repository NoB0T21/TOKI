import { Response, Request } from "express"
import uuid4 from "uuid4";
import supabase from "../Db/supabase";
import story from "../models/user.story.model";

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