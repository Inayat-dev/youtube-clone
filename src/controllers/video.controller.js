import {Video} from "../models/video.model.js"
import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import ApiResponse from "../utils/ApiResponse.js"
import {uploadFileOnCloudinary} from "../utils/cloudinary.js"
import mongoose from "mongoose"

const addVideo = asyncHandler(async (req,res)=>{
    // get info like video , thumbnail , video title, description, isPublished
    // verify that details
    // upload thumbnail and video to cloudinary
    // check upload status
    // get urls and video duration
    // upload all data to database

    const {videoTitle, description} = req.body
    const isPublished = req.body?.isPublished ? JSON.parse(req.body.isPublished) : true    
    const video = req.files?.video?.[0]?.path
    const thumbnail = req.files?.thumbnail?.[0]?.path

    if(!videoTitle || !video || ! thumbnail){
        throw new ApiError(404,"please fill required fields")
    }

    const cloudiVideo = await uploadFileOnCloudinary(video)
    const cloudiThumbnail = await uploadFileOnCloudinary(thumbnail)


    if(!cloudiVideo || !cloudiThumbnail){
        throw new ApiError(500,"file did not upload on server")
    }

    const data = await Video.create({
        videoFile:cloudiVideo.secure_url,
        thumbnail:cloudiThumbnail.secure_url,
        owner:req.user._id,
        title:videoTitle,
        description,
        duration:cloudiVideo.duration,
        views:0,
        isPublished
    })

    if(!data){
        throw new ApiError(500,"video did not uploaded")
    }

    return res
        .status(200)
        .json(new ApiResponse(200,data,"video uploaded successfully"))

})

const getVideo = asyncHandler(async (req,res)=>{
    const {videoId} = req.params

    const videoData = await Video.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(videoId)
            }
        }
    ])

    if(!videoData[0].isPublished && videoData[0].owner.toString() !== req.user._id){
        return res
            .status(200)
            .json(new ApiResponse(200,{data:"video unavailable"},"success"))
    }

    return res
        .status(200)
        .json(new ApiResponse(200,videoData,"success"))
})


const togglePublishVideo = asyncHandler(async (req,res)=>{
    const {videoId} = req.params
    
    if(!videoId){
        throw new ApiError(404,"required video Id")
    }

    const video =  await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"video not found")
    }

    if(video.owner.toString() !== req.user._id){
        throw new ApiError(404,"you are not auther")
    }

    const toggledVideo = await Video.findByIdAndUpdate(videoId,{
        isPublished:!video.isPublished
    },{returnDocument: 'after'})

    if(!toggledVideo){
        throw new ApiError(500,"not toggled your video visiblity")
    }

    return res  
        .status(200)
        .json(new ApiResponse(200,toggledVideo,"success"))
})

const deletehVideo = asyncHandler(async (req,res)=>{
    const {videoId} = req.params
    
    if(!videoId){
        throw new ApiError(404,"required video Id")
    }

    const video =  await Video.findById(videoId)

    if(!video){
        throw new ApiError(404,"video not found")
    }

    if(video.owner.toString() !== req.user._id){
        throw new ApiError(404,"you are not auther")
    }

    const deletedVideo = await Video.findByIdAndDelete(videoId)

    if(!deletedVideo){
        throw new ApiError(500,"video not deleted")
    }

    return res  
        .status(200)
        .json(new ApiResponse(200,deletedVideo,"success"))
})

const updateVideo = asyncHandler(async (req,res)=>{
    const { videoId } = req.body
    if(!videoId){
        throw new ApiError(404,"required video ID")
    }

    const video = await Video.findById(videoId)

    if(!video){
        throw new ApiError(404, "video not found")
    }

    const updateVideo = await Video.findByIdAndUpdate(video._id,{
        title:req.body.videoTitle || video.title,
        description:req.body.description || video.description,
        isPublished:req.body.isPublished || video.isPublished
    },
    {returnDocument: 'after'})

    if(!updateVideo){
        throw new ApiError(500,"video not updated")
    }

    return res
        .status(200)
        .json(new ApiResponse(200,updateVideo,"success"))
})

export {
    addVideo,
    getVideo,
    togglePublishVideo,
    deletehVideo,
    updateVideo,
}