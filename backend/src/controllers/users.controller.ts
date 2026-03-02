import { NextFunction, Request,Response } from "express"
import {OAuth2Client} from 'google-auth-library'
import { findUser, findUserByEmailANdUpdate, getUserFollowings, getUserFollowingsData, registerUser, registerUserfollowers, registerUserfollowings } from "../services/user.service"
import supabase from "../Db/supabase"
import uuid4 from "uuid4"
import userModel from '../models/user.model'
import jwt from 'jsonwebtoken'
import following from "../models/user.following.model"
import ErrorHandler from "../utils/errorHandler"
import user from "../models/user.model"

const client = new OAuth2Client(process.env.GOOGLE_ID)

interface User {
    _id:string,
    name:string,
    email:string,
    password:string
}

export const register = async (request: Request, response: Response) => {
    const file = request.file as Express.Multer.File;
    const {name, email, password, picture} = request.body
    if(!name||!email||!password){
        return response.status(400).json({
            message: 'Require all fields',
            success: false
        })
    }
    try {
        const existingUsers = await findUser({email})
        if(existingUsers){
            return response.status(202).json({
                message: "User already exists",
                user: existingUsers,
                success: false,
        })}

        const files = file?.originalname.split(" ").join("");
        const uniqueFilename = `${uuid4()}-${files}`;
        let pictureuri
        if(file){
            const { data, error } = await supabase.storage
                .from("toki")
                .upload(uniqueFilename, file?.buffer, {
                    contentType: file?.mimetype,
                    cacheControl: "3600",
                    upsert: false,
                });
            if (error) {
                console.log(error)
                    response.status(500).json({
                    message: "Server error",
                    success: false,
                });
                return
            }

            const publicUrlData = await supabase.storage
            .from("toki")
            .getPublicUrl(`${uniqueFilename}`);

            pictureuri=publicUrlData.data.publicUrl
        }

        const hashPassword = await userModel.hashpassword(password)
        const user = await registerUser({
            name,
            email,
            picture:pictureuri || picture,
            password:hashPassword,
            provider:'local',
            subId:''
        })
        if(!user){
            return response.status(500).json({
                message: "Some Error occure",
                success: false,
        })}

        await registerUserfollowings({
            userID: user._id
        })
        await registerUserfollowers({
            userID: user._id
        })
        
        const token = await user.generateToken()

        return response.status(201).json({
            message: "User created successfully",
            user,
            token,
            success: true,
        });
    } catch (error) {
        console.error("Register Error:", error);
        return response.status(500).json({
            message: "Internal server error",
            success: false,
          });
    }
}

export const login = async (request: Request, response:Response) => {
    const {email, password} = request.body
    if(!email||!password){
        return response.status(400).json({
            message: 'Require all fields',
            success: false
        })
    }

    try {
        const user = await findUser({email})
        if(!user){
            return response.status(202).json({
                message: "password or email is incorrect",
                success: false,
        })}

        const isMatch = await user.comparePassword(password, user.password)
        if(!isMatch){
            return response.status(202).json({
                message: "password or email is incorrect",
                success: false,
        })}

        const token = await user.generateToken()
        return response.status(201).json({
            message: "User login successfully",
            user,
            token,
            success: true,
        });
    } catch (error) {
        return response.status(500).json({
            message: "Internal server error",
            success: false,
          });
    }
}

export const googleLogin = async (request: Request, response:Response, next:NextFunction) => {
    const {name, email, password, picture} = request.body
    if(!email||!password){
        return next(new ErrorHandler("Require all fields", 400));
    }

    try {
        let user = await findUser({email})
        const subid= user?.subId || '';
        if(!user || user.provider!=='google' || user.subId === ''){
            try {
                if(subid === '' ){
                    const hashPassword = await userModel.hashpassword(password)
                    user = await findUserByEmailANdUpdate({email, provider:'google',subId:hashPassword})
                    if(!user){
                        return next(new ErrorHandler("Some Error occure", 500));
                    }
                    const token = await user.generateToken()

                    return response.status(201).json({
                        message: "User created successfully",
                        user,
                        token,
                        success: true,
                    });
                }
                const hashPassword = await userModel.hashpassword(password)
                user = await registerUser({
                    name,
                    email,
                    picture:picture,
                    password:hashPassword,
                    provider:'google',
                    subId:hashPassword
                })
                if(!user){
                    return next(new ErrorHandler("Some Error occure", 500));
                }

                await registerUserfollowings({
                    userID: user._id
                })
                await registerUserfollowers({
                    userID: user._id
                })
                
                const token = await user.generateToken()

                return response.status(201).json({
                    message: "User created successfully",
                    user,
                    token,
                    success: true,
                });
            } catch (error) {
                console.error("Register Error:", error);
                return next(new ErrorHandler("password or email is incorrect", 400));
            }
        }

        const isMatch = await user.comparePassword(password, user.subId)
        if(!isMatch){
            return next(new ErrorHandler("password or email is incorrect", 400));
        }

        const token = await user.generateToken()
        return response.status(201).json({
            message: "User login successfully",
            user,
            token,
            success: true,
        });
    } catch (error) {
        return next(new ErrorHandler("Internal server error", 500));
    }
}

export const valid = async (req: Request, res:Response) => {
    const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Access Token required' });
        return;
      }
    
      const accessToken = authHeader.split(' ')[1];
      try {
        const user = jwt.verify(accessToken, process.env.SECRET_KEY || 'default');
        if(!user){
            return res.status(200).json({
                message: "not verified",
                success: false,
            })
        }

        return res.status(200).json({
            message: "verified",
            success: true,
        })
      } catch (err) {
        try {
            const googleInfo = await client.getTokenInfo(accessToken);
            if(!googleInfo){
                return res.status(200).json({
                    message: "not verified",
                    success: false,
                })
            }
            
            return res.status(200).json({
                message: "verified",
                success: true,
            })
        } catch (err) {
            return res.status(200).json({
                message: "not verified",
                success: false,
            })
        }
    }
}

export const getfollowings = async (req: Request, res:Response) => {
    const userId = req.user._id
    if(!userId){
        res.status(401).json({ message: 'Access Token required' });
        return;
    }

    try {
        const creatorIds = await following.findOne({userID: userId})
        if(!creatorIds){
                return res.status(200).json({
                    message: "not verified",
                    success: false,
                })
            }
            
            return res.status(200).json({
                message: "verified",
                creatorIds:creatorIds.count,
                success: true,
            })
    } catch (error) {
        return res.status(500).json({
            message: "server error",
            success: false,
        })
    }
}

export const getUserProfile = async (req: Request, res:Response) => {
    let userId = req.params.id;
    if(!userId)userId = req.user._id;
    console.log(userId)
    if(!userId){
        res.status(401).json({ message: 'Access Token required' });
        return;
    }

    try {
        const creatorIds = await getUserFollowings(userId)
        if(!creatorIds){
                return res.status(200).json({
                    message: "not verified",
                    success: false,
                })
            }
            
            return res.status(200).json({
                message: "verified",
                data:creatorIds,
                success: true,
            })
    } catch (error) {
        return res.status(500).json({
            message: "server error",
            success: false,
        })
    }
}

export const getUserProfileFollowing = async (req: Request, res:Response) => {
    const {userIds} = req.body
    console.log(userIds)
    if(!userIds){
        res.status(401).json({ message: 'Access Token required' });
        return;
    }
    try {
        const creatorIds = await getUserFollowingsData(userIds)
        if(!creatorIds){
                return res.status(200).json({
                    message: "not verified",
                    success: false,
                })
            }
            
            return res.status(200).json({
                message: "verified",
                data:creatorIds,
                success: true,
            })
    } catch (error) {
        return res.status(500).json({
            message: "server error",
            success: false,
        })
    }
}