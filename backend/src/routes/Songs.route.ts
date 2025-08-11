import express from "express";
import middleware from "../middleware/middleware";
import multer from "multer";
import { addSongs, getSongs } from "../controllers/songs.controller";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

router.post('/create',addSongs)
router.get('/search',middleware,getSongs)

export default router;