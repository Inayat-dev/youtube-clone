import { Router } from "express"
import { 
    toggleVideoLike,
    toggleCommentLike,
    toggleTweetLike,
    getVideoLikeById
} from "../controllers/like.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/toggle/v/:videoId").get(toggleVideoLike)
router.route("/toggle/c/:commentId").get(toggleCommentLike)
router.route("/toggle/t/:tweetId").get(toggleTweetLike)
router.route("/:videoId").get(getVideoLikeById)

 export default router