import express from "express";
import multer from "multer";
import middleware from "../middleware/middleware";
import { AddStory, AddviewStory, DeleteStory } from "../controllers/story.controller";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

router.post('/create',middleware,upload.single('image'),AddStory)
router.get('/delete/:id',middleware,DeleteStory)
router.get('/view/:id',middleware,AddviewStory)

export default router;