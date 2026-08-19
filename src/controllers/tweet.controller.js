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

const updateTweet = asyncHandler(async (req,res)=>{
    //get user and new content
    //get tweet id
    //check user and tweet exist
    //update tweet 
    //send new tweet

    const {content, tweetId} = req.body

    if(!content || !tweetId){
        throw new ApiError(404,"required id and content")
    }

    const user = await User.findById(req.user._id)
    const tweet = await Tweet.findById(tweetId)
    console.log(tweet.owner,user._id)

    if(user._id.toString() !== tweet.owner.toString()){
        throw new ApiError(404,"ID not match")
    }

    const newTweet = await Tweet.findByIdAndUpdate(tweetId,{content},{returnDocument: 'after'})

    if(!newTweet){
        throw new ApiError(500,"tweet not updated")
    }

    return res
        .status(200)
        .json(new ApiResponse(200,newTweet,"success"))
})

const deletTweet = asyncHandler(async (req,res)=>{
    const { tweetId } = req.body

    if(!tweetId){
        throw new ApiError(404,"invalid tweet id")
    }

    const tweet = await Tweet.findById(tweetId)

    if(!tweet){
        throw new ApiError(404,"tweet does not exist")

    }

    if(tweet.owner.toString() !== req.user._id.toString()){
        throw new ApiError(404,"invalid tweet id")
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)

    return res
        .status(200)
        .json(new ApiResponse(200,tweet,"successfully deleted tweet"))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deletTweet,
}