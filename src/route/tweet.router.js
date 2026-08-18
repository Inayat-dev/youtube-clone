import { Router } from "express"
import {
    createTweet,
    getUserTweets,
    updateTweet,
    deletTweet
} from "../controllers/tweet.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/").post(verifyJWT, createTweet)
router.route("/search").get(getUserTweets)
router.route("/update").post(verifyJWT, updateTweet)
router.route("/delete").post(verifyJWT, deletTweet)


export default router