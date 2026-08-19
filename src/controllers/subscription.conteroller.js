import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import {User} from "../models/user.model.js"
import {Subscription} from "../models/subscription.model.js"

const toggleSubscription = asyncHandler(async (req,res)=>{
    //get user id and channel id
    //check info is exist and correct or not
    //get user and channel from database
    //add sunscription in database

    const {channelId} = req.params;
    
    if(!channelId){
        throw new ApiError(404,"required Channel ID")
    }
    
    const user = await User.findById(req.user._id)
    const channel = await User.findById(channelId)

    if(!channel){
        throw new ApiError(404,"Channel not Found")
    }

    const isSubscibed = await Subscription.findOne({
        channel: channel._id,
        subscriber: user._id
    })

    if(isSubscibed){
        const unsubscribe = await Subscription.findByIdAndDelete(isSubscibed._id)
        return res  
            .status(200)
            .json(new ApiResponse(200,unsubscribe,"cahnnel unsubscribed"))
    }

    const subscribe = await Subscription.create({
        subscriber :  user._id,
        channel : channel._id
    })

    if(!subscribe){
        throw new ApiError(500,"error in subscribing channel")
    }

    return res  
        .status(200)
        .json(new ApiResponse(200,subscribe,"cahnnel subscribed"))

})

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params

    const subscribers = await Subscription.aggregate([
        {
            $match: {
                "channel":new mongoose.Types.ObjectId(channelId)
            }
        },
        {
            $project:{
                subscriber:1,
                _id:0
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"user",
                pipeline:[
                    {
                        $project:{
                            _id:0,
                            username:1,
                            avatar:1
                        }
                    }
                ]

            }          

        },
        {
            $addFields:{
                "user": {$first:"$user"},
                
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200,{subscribers, totalSubscribers: subscribers.length},"success"))

})

const getSubscribedChannels  = asyncHandler(async (req, res) => {
    const {subscriberId} = req.params
    const channels = await Subscription.aggregate([
        {
            $match: {
                "subscriber":new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
            $project:{
                channel:1,
                _id:0
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"channel",
                foreignField:"_id",
                as:"user",
                pipeline:[
                    {
                        $project:{
                            _id:0,
                            username:1,
                            avatar:1
                        }
                    }
                ]

            }          

        },
        {
            $addFields:{
                "channel": {$first:"$user"},
                
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200,{channels, totalChannel: channels.length},"success"))
})

export {toggleSubscription, getUserChannelSubscribers, getSubscribedChannels} 