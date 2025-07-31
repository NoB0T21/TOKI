import { followuser, likeFile,removeuser,uploadFile} from "../controllers/Posts.controller";
import express from "express";
import middleware from "../middleware/middleware";
import multer from "multer";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() })

router.post('/create', middleware,upload.single('file'), uploadFile)
router.get('/like/:id',middleware,likeFile)
router.get('/follow/:id',middleware,followuser)
router.get('/follow/remove/:id',middleware,removeuser)

export default router;