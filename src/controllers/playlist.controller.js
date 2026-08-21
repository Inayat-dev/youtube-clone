import asyncHandler from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import { Video } from "../models/video.model";
import { Playlist } from "../models/playlist.model";
import mongoose from "mongoose";

const createPlaylist = asyncHandler(async (req,res)=>{
    const { name, description } = req.body;

    if(!name || !description){
        throw new ApiError(404,"please fill all requirement")
    }

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    });

    return res
        .status(200)
        .json(new ApiResponse(200,playlist,"success"))
})

const deletePlaylist = asyncHandler(async (req,res)=>{
    const {playlistId} = req.body;

    if(!playlistId){
        throw new ApiError(404,"invalid playlist")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    if(playlist.owner.toString() != req.user._id.toString()){
        throw new ApiError(404,"you are not Authorized")
    }

    await Playlist.findByIdAndDelete(req.user._id)

    return res  
        .statsu(200)
        .json(new ApiResponse(200,{},"successflully deleted"))

})

const updatePlaylist = asyncHandler(async (req,res)=>{
    const {playlistId, newName, newDescription} = req.query;

    if(!playlistId){
        throw new ApiError(404,"invalid playlist")
    }

    const playlist = await Playlist.findById(playlistId)

    if(!playlist){
        throw new ApiError(404,"playlist not found")
    }

    if(playlist.owner.toString() != req.user._id.toString()){
        throw new ApiError(404,"you are not Authorized")
    }

    playlist.name = newName || playlist.name
    playlist.description = newDescription || playlist.description

    playlist.save({ validateBeforeSave: false });

    return res  
        .statsu(200)
        .json(new ApiResponse(200,{playlist},"successflully updated"))

})

const getPlaylistByUserId = asyncHandler(async (req,res)=>{
    const {userId} = req.params
    if(!userId){
        throw new ApiError(404,"user not found")
    }
    const playlists = Playlist.aggregate([
        {
            $match:{
                owner:mongoose.Types.ObjectId(userId)
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200,playlists,"success"))
})

const getPlaylistById = asyncHandler(async(req,res)=>{
    const {playlistId} = req.params

    if(!playlistId){
        throw new ApiError(404,"user not found")
    }
    const playlist = Playlist.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(playlistId)
            }
        }
    ])

    return res
        .status(200)
        .json(new ApiResponse(200,playlist,"success"))

})

const addVideoToPlaylist = asyncHandler(async (req,res)=>{
    const {videoId, playlistId} = req.body

    if(!videoId || !playlistId){
        throw new ApiError(404,"please fill requirement")
    }

    const video = await Video.findById(videoId)
    
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    const playlist = await Playlist.findById(playlistId)

    const newPlaylist = Playlist.findByIdAndUpdate(playlistId,{
        $push:{
            videos:videoId
        }
    },{returnDocument: 'after'})

    return res
        .status(200)
        .json(new ApiResponse(200,newPlaylist,"success"))

})

const deleteVideoToPlaylist = asyncHandler(async (req,res)=>{
    const {videoId, playlistId} = req.body

    if(!videoId || !playlistId){
        throw new ApiError(404,"please fill requirement")
    }

    const video = await Video.findById(videoId)
    
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    const playlist = await Playlist.findById(playlistId)

    const newPlaylist = Playlist.findByIdAndUpdate(playlistId,{
        $pull:{
            videos:videoId
        }
    },{returnDocument: 'after'})

    return res
        .status(200)
        .json(new ApiResponse(200,newPlaylist,"success"))

})

export {
    createPlaylist,
    deletePlaylist,
    updatePlaylist,
    getPlaylistByUserId,
    getPlaylistById,
    addVideoToPlaylist,
    deleteVideoToPlaylist,
}