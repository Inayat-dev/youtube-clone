import {v2 as cloudinary} from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET_KEY,
})

async function uploadFileOnCloudinary(localURL){
    if(!localURL) return null
    try{
        const response = await cloudinary.uploader.upload(localURL,{
            resource_type: "auto"
        })
        return response
    }catch(err){
        fs.unlinkSync(localURL)
    }
} 

export {uploadFileOnCloudinary}