import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

export default function healthCheck(req,res){
    return res
        .status(200)
        .json(new ApiResponse(200,{res:"working fine"},"working file"))
}

