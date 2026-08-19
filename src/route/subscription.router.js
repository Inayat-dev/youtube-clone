import { Router } from "express"
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.conteroller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
 
const router = Router()

router.use(verifyJWT)

router.route("/c/:channelId")
    .post(toggleSubscription)
    .get(getUserChannelSubscribers)

    router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router