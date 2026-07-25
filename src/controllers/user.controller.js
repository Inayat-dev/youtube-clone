import asyncHandler from "../utils/asyncHandler.js"

const registerUser = asyncHandler(async function(req,res){
    res.json({
        data:[1,2,3,4,5],
        message:"OK"
    })
})

export {registerUser}