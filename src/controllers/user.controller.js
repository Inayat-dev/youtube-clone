import asyncHandler from "../utils/asyncHandler.js"
import ApiError from "../utils/ApiError.js"
import { uploadFileOnCloudinary } from "../utils/cloudinary.js"
import ApiResponse from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import jwt, { decode } from "jsonwebtoken"
import { subscribe } from "diagnostics_channel"
import mongoose from "mongoose"

const registerUser = asyncHandler(async function (req, res) {
    const { email, username, password, fullName } = req.body

    // validation
    if ([email, username, password, fullName].some((field) => !field?.trim())) {
        throw new ApiError(400, "all fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{ email }, { username }],
    })

    if (existedUser) {
        throw new ApiError(409, "user already exists")
    }

    const localAvatarPath = req.files?.avatar?.[0]?.path
    const localCoverImagePath = req.files?.coverImage?.[0]?.path

    if (!localAvatarPath) {
        throw new ApiError(400, "avatar image is required")
    }

    const avatarImg = await uploadFileOnCloudinary(localAvatarPath)
    const coverImg = localCoverImagePath
        ? await uploadFileOnCloudinary(localCoverImagePath)
        : null

    if (!avatarImg) {
        throw new ApiError(500, "avatar upload failed, please try again")
    } 

    const createdUser = await User.create({
        email,
        username,
        password,
        fullName,
        avatar: avatarImg.url,
        coverImage: coverImg?.url || "",
    })

    const safeUser = await User.findById(createdUser._id).select(
        "-password -refreshToken"
    )

    if (!safeUser) {
        throw new ApiError(500, "something went wrong while registering user")
    }

    return res
        .status(201)
        .json(new ApiResponse(201, safeUser, "user registered successfully"))
})

async function generateAccessAndRefreshToken(ID){

    const userData = await User.findById(ID);
    const accessToken = userData.generateAccessTokens();
    const refreshToken = userData.generateRefreshTokens();
    //save Refresh Token in database
    userData.refreshToken = refreshToken
    userData.save({validateBeforeSave: false})

    return {accessToken, refreshToken}

}

const loginUser = asyncHandler(async function (req,res){

    const { email,username,password } = req.body;

    //validation
    if(!username && !email){
        throw new ApiError(500,"Required all fields");
    }

    const user = await User.findOne({ $or: [{username},{email}]});

    if(!user){
        throw new ApiError(404,"User does not exist")
    }

    const isPassCorrect = await user.isPasswordCorrect(password);

    if(!isPassCorrect){
        throw new ApiError(404,"Password is not currect")
    }

    //generate Access Token and Refresh token
    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)



    const LoggedinUser =  await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //save in cookie
    res
    .status(200)
    .cookie("accessToken",accessToken)
    .cookie("refreshToken",refreshToken)
    .json(new ApiResponse(201,LoggedinUser,"User Loggedin Successfully"))
})

const logoutUser = asyncHandler(async function(req,res){
    const user = req.user

    await User.findByIdAndUpdate(
        user._id,
        {
            refreshToken : undefined
        },
        {
            new: true
        }
    )

    res.status(200).clearCookie("accessToken").json(new ApiResponse(200,{logout: true},"user logout successfully"))

})

const AccessRefreshToken = asyncHandler(async function(req,res){
    const token = req.cookies.refreshToken || req.body.refreshToken

    if(!token){
        throw new ApiError(404,"Refresh Token not found")
    }

    const decodedRefreshToken = jwt.verify(token,process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedRefreshToken._id)

    if(user._id != decodedRefreshToken._id){
        console.log(user._id,decodedRefreshToken._id)
        throw new ApiError(404, "Invalid Refresh Token")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

    return res
            .cookie("accessToken",accessToken)
            .cookie("refreshToken",refreshToken)
            .json(new ApiResponse(200,{accessToken, refreshToken}))
})

const updatePassword = asyncHandler(async (req,res)=>{
    const {oldPassword, newPassword} = req.body;
    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!oldPassword && !newPassword){
        throw new ApiError(404,"Required Old and New Password")
    }

    if(!isPasswordCorrect){
        throw new ApiError(404,"old Password is incorrect")
    }

    user.password = newPassword
    user.save({validateBeforeSave: false})


    return res
            .status(200)
            .json(new ApiResponse(200,{},"password updated successfully"))

})

const getUser = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.user._id).select("-password -refreshToken")


    return res
            .status(200)
            .json(new ApiResponse(200,user,"User Detail"))
})

const updateDetails = asyncHandler(async (req,res)=>{
    const { email, fullName } = req.body;
    const user = await User.findById(req.user._id)

    if(!fullName && !email){
        throw new ApiError(404, "field are required")
    }

    if(fullName){
        user.fullName = fullName
    }
    if(email){
        user.email = email
    }

    user.save({ validateBeforeSave: false })

    return res
            .status(200)
            .json(new ApiResponse(200,{updated: true},"Detail Chnaged Successfully"))


})

const updateAvatar = asyncHandler(async (req,res, next)=>{
    try {
        if(!req.files.avatar[0]){
            throw new ApiError(200,"file not found")
        }
    
        const uploadFile = await uploadFileOnCloudinary(req.files.avatar[0].path)
    
        const user = await User.findById(req.user._id)

        user.avatarImg = uploadFile.url;
        user.save({validateBeforeSave: false})

        return res
                .status(200)
                .json(new ApiResponse(200,{url:uploadFile.url},"successfully uploaded"))
        
    } catch (error) {
        throw new ApiError(500, error.message)
    }
})

const updateBanner = asyncHandler(async (req,res, next)=>{
    try {
        if(!req.files.banner[0]){
            throw new ApiError(200,"file not found")
        }
    
        const uploadFile = await uploadFileOnCloudinary(req.files.banner[0].path)
    
        const user = await User.findById(req.user._id)

        user.banner = uploadFile.url;
        user.save({validateBeforeSave: false})

        return res
                .status(200)
                .json(new ApiResponse(200,{url:uploadFile.url},"successfully uploaded"))
        
    } catch (error) {
        throw new ApiError(500, error.message)
    }
})

const getChannel = asyncHandler(async (req,res)=>{
    const {username} = req.params;

    if(!username){
        throw new ApiError(404,"required channel Name")
    }

    const data = await User.aggregate([
        {
            $match:{
                username
            }
        },

        {
            $lookup:{
                from: "subscription",
                localField:"_id",
                foreignField: "channel",
                as:"subscribers"
            }
        },

        {
            $lookup:{
                from: "subscription",
                localField:"_id",
                foreignField: "subscribers",
                as:"subscribed"
            }
        },

        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                channelsSubscribedToCount: { $size: "$subscribed" },
                isSubscribed: {
                    $cond: {
                        if: { $in: [req.user._id, "$subscribers.subscriber"] },
                        then: true,
                        else: false
                    }
                }
            }
        },

        {
            $project:{
                _id:1,
                username: 1,
                email:1,
                fullName:1,
                avatar: 1,
                coverImage:1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1
            }
        }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200,data,"success"))
})

const getWatchHistory = asyncHandler(async (req,res)=>{
    const data = await User.aggregate([
        {
            $match: {
                _id :new mongoose.Types.ObjectId(req.user._id)
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"watchHistory",
                foreignField:"_id",
                as:"watchHistory",
                pipeline:[
                    {
                        $lookup:{
                            from:"users",
                            localField:"owner",
                            foreignField:"_id",
                            as:"owner"
                        }
                    }
                ]
            }
        },

        {
            $project:{
                _id:1,
                watchHistory:1
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200,data,"watch history"))
})

export { 
    registerUser, 
    loginUser, 
    logoutUser, 
    AccessRefreshToken,
    updatePassword,
    updateDetails,
    getUser,
    updateAvatar,
    updateBanner,
    getChannel,
    getWatchHistory,
}