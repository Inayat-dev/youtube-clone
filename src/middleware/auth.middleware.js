import ApiError from "../utils/ApiError.js"
import asyncHandler from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken"

const verifyJWT = asyncHandler(async (req,res,next)=>{
    try {

        const accessToken = req.cookies.accessToken || undefined

        if(!accessToken){
            throw new ApiError(404,"Access Token not found")
        }

        const decodedData = await jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET)
        req.user = decodedData
        next()

    } catch (error) {
        throw new ApiError(500,error)
    }
})

export {verifyJWT}