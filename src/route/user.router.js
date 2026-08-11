import { Router } from "express";
import { registerUser, loginUser, logoutUser, AccessRefreshToken } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router()

router.route("/register").post(upload.fields([
    {name:"avatar"},
    {name:"coverImage"}

]),registerUser)

router.route("/login").post(loginUser)

router.route("/logout").post(verifyJWT, logoutUser)

router.route("/refresh-token").post(AccessRefreshToken)

export default router