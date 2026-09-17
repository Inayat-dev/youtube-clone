import { Router } from "express"
import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels,
    getChannelState
} from "../controllers/subscription.conteroller.js"
import { verifyJWT } from "../middleware/auth.middleware.js";
 
const router = Router()

router.use(verifyJWT)

router.route("/c/:channelId")
    .post(toggleSubscription)
    .get(getUserChannelSubscribers)

router.route("/channel/:channel")
    .get(getChannelState)

    router.route("/u/:subscriberId").get(getSubscribedChannels);

export default router