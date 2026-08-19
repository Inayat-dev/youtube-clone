import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"


const addComment = asyncHandler(async (req, res) => {
    //get comment content, video id
    //verify info is exist
    //verify video id is correct or not
    //add into database
    //send response

    const {content, videoId} = req.body

    if(!content || !videoId){
        throw new ApiError(404,"please fill requirments")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"video not found")
    }

    const comment = await Comment.create({
        content,
        owner:req.user._id,
        video:video._id
    })

    if(!comment){
        throw new ApiError(500,"comment didn't posted")
    }

    return res
        .status(200)
        .json(200,comment,"comment successfully posted")

})

export {addComment}