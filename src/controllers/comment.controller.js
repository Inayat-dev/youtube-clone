import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {Comment} from "../models/comment.model.js"


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
        .json(new ApiResponse(200,comment,"comment successfully posted"))

})

const updateComment = asyncHandler(async (req,res)=>{
    const {commentId,content} = req.body

    if(!commentId || !content){
        throw new ApiError(404,"required all fields")
    }

    const comment = await Comment.findById(commentId)

    if(comment.owner.toString() !== req.user._id){
        throw new ApiError(400,"you have not authority to modify this comment")
    }

    comment.content = content;
    comment.save();

    return res
        .status(200)
        .json(new ApiResponse(200,comment,"success"))

})

const deleteComment = asyncHandler(async (req,res)=>{
    const {commentId} = req.body

    const comment = await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(400,"comment does not exist")
    }
    const video = await Video.findById(comment.video.toString())

    if(comment.owner.toString() != req.user._id  && video.owner.toString() != req.user._id){
        throw new ApiError(400,"you have not authority to modify this comment")
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId)

    return res
        .status(200)
        .json(new ApiResponse(200,deletedComment,"success"))

})

const getComment = asyncHandler(async (req,res)=>{
    const {limit=10, skip=0, sortBy="createdAt",sortType=1} = req.body;

    const comments = await Comment.aggregate([
        {
            $sort:{
                [sortBy]:Number(sortType)

            }
        },
        {
            $skip:Number(skip)
        },
        {
            $limit:Number(limit)
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200,comments,"success"))

})

export {addComment, updateComment, deleteComment, getComment}