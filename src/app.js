import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser";


const app = express()

app.use(cors({
    origin:process.env.ORIGIN,
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

//routes
app.use("/users",userRoute)
app.use("/healthcheck",healthRoute)
app.use("/tweet",tweetRouter)
app.use("/subscription",subscriptionRouter)

export default app