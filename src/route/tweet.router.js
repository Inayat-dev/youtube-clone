import { Router } from "express"
import {
    createTweet,
    getUserTweets
} from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createTweet)
router.route("/search").get(getUserTweets)

export default router