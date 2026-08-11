import { Router } from "express";
import { registerUser, loginUser, logoutUser, AccessRefreshToken, updatePassword, updateDetails, getUser, updateAvatar, updateBanner } from "../controllers/user.controller.js";
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

router.route("/update-password").post(verifyJWT, updatePassword)

router.route("/update-detail").post(verifyJWT, updateDetails)

router.route("/update-avatar").post(
    verifyJWT, 
    upload.fields([
        {name:"avatar"}
    ]), 
    updateAvatar
)

router.route("/update-banner").post(
    verifyJWT, 
    upload.fields([
        {name:"banner"}
    ]), 
    updateBanner
)


router.route("/profile").post(verifyJWT, getUser)

export default router