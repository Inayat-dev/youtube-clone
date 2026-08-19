import { Router } from "express"
import { 
    addVideo,
    getVideo,
    togglePublishVideo
 } from "../controllers/video.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"
import {upload} from "../middleware/multer.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/upload")
    .post(upload.fields([
        {name:"video"},
        {name:"thumbnail"}
    ]),addVideo)
router.route("/:videoId").get(getVideo)
router.route("/toggle/publish/:videoId").patch(togglePublishVideo)

export default router