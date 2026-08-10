import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";
import {upload} from "../middleware/multer.middleware.js"

const router = Router()

router.route("/register").post(upload.fields([
    {name:"avatar"},
    {name:"coverImage"}

]),registerUser)

router.route("/login").post(loginUser)

export default router