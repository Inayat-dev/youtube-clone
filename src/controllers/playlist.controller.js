import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { Video } from "../models/video.model.js";
import { Playlist } from "../models/playlist.model.js";
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
    const {playlistId} = req.params;

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

    const deleted = await Playlist.findByIdAndDelete(playlistId)

    if(!deleted){
        throw new ApiError(500,"not deleted from ")
    }

    return res  
        .status(200)
        .json(new ApiResponse(200,{},"successflully deleted"))

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { newName, newDescription } = req.body;

    if (!playlistId || !mongoose.isValidObjectId(playlistId)) {
        throw new ApiError(400, "invalid playlist id");
    }

    if (newName === undefined && newDescription === undefined) {
        throw new ApiError(400, "nothing to update");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "playlist not found");
    }

    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "you are not authorized");
    }

    if (newName !== undefined) playlist.name = newName;
    if (newDescription !== undefined) playlist.description = newDescription;

    await playlist.save();

    return res
        .status(200)
        .json(new ApiResponse(200, { playlist }, "successfully updated"));
});

const getPlaylistByUserId = asyncHandler(async (req,res)=>{
    const {userId} = req.params
    if(!userId){
        throw new ApiError(404,"user not found")
    }
    const playlists = await Playlist.aggregate([
        {
            $match:{
                owner: new mongoose.Types.ObjectId(userId)
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
    const playlist = await Playlist.aggregate([
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
    const {videoId, playlistId} = req.params

    if(!videoId || !playlistId){
        throw new ApiError(404,"please fill requirement")
    }

    const video = await Video.findById(videoId)
    
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    const playlist = await Playlist.findById(playlistId)

    const newPlaylist = await Playlist.findByIdAndUpdate(playlistId,{
        $push:{
            videos:videoId
        }
    },{returnDocument: 'after'})

    return res
        .status(200)
        .json(new ApiResponse(200,newPlaylist,"success"))

})

const deleteVideoToPlaylist = asyncHandler(async (req,res)=>{
    const {videoId, playlistId} = req.params

    if(!videoId || !playlistId){
        throw new ApiError(404,"please fill requirement")
    }

    const video = await Video.findById(videoId)
    
    if(!video){
        throw new ApiError(404, "Video not found")
    }

    const playlist = await Playlist.findById(playlistId)

    const newPlaylist = await Playlist.findByIdAndUpdate(playlistId,{
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