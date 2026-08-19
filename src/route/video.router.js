import { Router } from "express"
import { 
    addVideo,
    getVideo,
    togglePublishVideo,
    deletehVideo,
    updateVideo
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
router.route("/delete/:videoId").delete(deletehVideo)
router.route("/update-video").patch(updateVideo)

export default router