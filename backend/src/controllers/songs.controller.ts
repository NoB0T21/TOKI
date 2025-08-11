import { Request,Response } from "express"
import songs from "../models/songs.model";

export const getSongs = async (req:Request,res:Response) => {
     let q = typeof req.query?.q === 'string' ? req.query.q : '';
     if (!q) {
            return res.status(400).json({
                message: "Missing fields",
                success: false,
            });
        }
        try {
            const song = await songs.find({
                $or: [
                    { title: { $regex: q, $options: 'i' } },
                    { artist: { $regex: q, $options: 'i' } },
                ]
            }).limit(6)

            return res.status(200).json({
                message: "Songs",
                songs:song,
                success: true,
            });
            
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                success: false,
            });
        }
}

export const addSongs = async (req:Request,res:Response) => {
     const {title,artist,previewUrl} = req.body
     if (!title||!artist||!previewUrl) {
            return res.status(400).json({
                message: "Missing fields",
                success: false,
            });
        }
        try {
            const song = await songs.create({
                title,
                artist,
                previewUrl
            })

            return res.status(200).json({
                message: "Songs",
                songs:song,
                success: true,
            });
            
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error",
                success: false,
            });
        }
}