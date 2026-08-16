import mongoose, {Schema} from "mongoose"

const likeSchema = new Schema({
    comment:{
        type:Schema.Types.ObjectId,
        ref:"Comment"
    },
    video:{
        type:Schema.Types.ObjectId,
        ref:"Video"
    },
    tweet:{
        type:Schema.Types.ObjectId,
        ref:"tweet"
    },
    likeBy:{
        type:Schema.Types.ObjectId,
        ref:"User"
    },
    
},{timestamps:true})