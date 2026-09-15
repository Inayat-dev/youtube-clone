import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import ApiError from "./utils/ApiError.js";


const app = express()

app.use(cors({
    origin:['http://localhost:5173', 'https://youtube-clone---frontend.pages.dev'],
    credentials: true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())


//import route
import userRoute from "./route/user.router.js"
import healthRoute from "./route/healthcheck.router.js"
import tweetRouter from "./route/tweet.router.js"
import subscriptionRouter from "./route/subscription.router.js"
import commentRouter from "./route/comment.router.js"
import videoRouter from "./route/video.router.js"
import playlistRouter from "./route/playlist.router.js"
import likeRouter from "./route/like.router.js"
import dashboardRouter from "./route/dashboard.router.js"

//routes
app.use("/users",userRoute)
app.use("/healthcheck",healthRoute)
app.use("/tweet",tweetRouter)
app.use("/like",likeRouter)
app.use("/subscription",subscriptionRouter)
app.use("/comment",commentRouter)
app.use("/video",videoRouter)
app.use("/playlist",playlistRouter)
app.use("/dashboard",dashboardRouter)

app.use((err, req, res, next) => {
    let error = err

    // agar error ApiError instance nahi hai (jaise Mongoose/JWT ka error), to convert karo
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || 500
        const message = error.message || "Something went wrong"
        error = new ApiError(statusCode, message, error?.errors || [], err.stack)
    }

    const response = {
        success: false,
        message: error.message,
        errors: error.errors,
        ...(process.env.NODE_ENV === "development" ? { stack: error.stack } : {})
    }

    return res.status(error.statusCode).json(response)
})

export default app
