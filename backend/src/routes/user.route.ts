import { getfollowings, getUserProfile, getUserProfileFollowing, googleLogin, login, register, valid } from "../controllers/users.controller";
import express from "express";
import multer from "multer";
import middleware from "../middleware/middleware";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

router.post('/signup',upload.single('file'),register)
router.post('/signin',upload.none(),login)
router.post('/googlelogin',upload.none(),googleLogin)
router.get('/valid',valid)
router.get('/following',middleware,getfollowings)
router.get('/profile/:id',middleware,getUserProfile)
router.post('/profile/followings',upload.none(),middleware,getUserProfileFollowing)

export default router;