import {v2 as cloudinary} from "cloudinary"
import fs from "fs"


async function uploadFileOnCloudinary(localURL){
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET_KEY,
    })

    if(!localURL) return null
    try{
        const response = await cloudinary.uploader.upload(localURL,{
            resource_type: "auto"
        })
        return response
    }catch(err){
        console.log("not uploaded on cloudinary : ",err)
        fs.unlinkSync(localURL)
    }
} 

export {uploadFileOnCloudinary}