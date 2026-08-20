import {Router} from "express"
import {
    addComment,
    updateComment,
    deleteComment,
    getComment
} from "../controllers/comment.controller.js"
import { verifyJWT } from "../middleware/auth.middleware.js"

const router = Router()

router.use(verifyJWT)

router.route("/").post(addComment).get(getComment)
router.route("/update").patch(updateComment)
router.route("/delete").delete(deleteComment)

export default router