import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js";

const createTweet = asyncHandler(async (req,res)=>{

    const { content } = req.body

    if(!content){
        throw new ApiError(404,"content must be filled")
    }

    const user = await User.findById(req.user._id)

    const addTweet = await Tweet.create({
        owner:user._id,
        content
    })

    return res
        .status(200)
        .json(new ApiResponse(200,addTweet))
    
})

const getUserTweets = asyncHandler(async (req,res)=>{
    //get username throw params
    //check username are exits
    //get user from database
    //get tweets
    //send to user

    const {username, limit, skip} = req.query;
    
    
    if(!username){
        throw new ApiError(404,"required Username")
    }

    const user = await User.findOne({username})

    if(!user){
        throw new ApiError(404,"invalid Username ")
    }

    const tweets = await Tweet.aggregate([
        {
            $match:{
                "owner":user._id,
            }
        },
        {
            $limit:parseInt(limit)
        },{            
            $skip:parseInt(skip)
        },
        {
            $project:{
                content:1,
                createdAt:1,
                updatedAt:1
            }
        }
    ])

    return res  
        .status(200)
        .json(new ApiResponse(200,tweets))


})

export {
    createTweet,
    getUserTweets
}