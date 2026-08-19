import mongoose, {Schema} from "mongoose"

const subscriptionSchema = Schema({
    subscriber:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    },
    channel:{
        type: mongoose.Types.ObjectId,
        ref:"User"
    }
},{timestamps: true})

export const Subscription = mongoose.model("Subscription",subscriptionSchema)