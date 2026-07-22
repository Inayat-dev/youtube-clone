import mongoose, {Schema} from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username:{
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    email:{
        type: String,
        unique: true,
        trim: true,
        required: true
    },
    fullName:{
        type: String,
        trim: true,
        required: true
    },
    avatar:{
        type: String,
        required: true
    },
    coverImage:{
        type: String,
        required: true
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type: String,
        required: true
    },
    refreshToken:{
        type: String
    },    
},{
    timestamps:true
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessTokens = function(){
    return jwt.sign({
        _id: this._id,
        username : this.username,
        fullName: this.fullName,
        email: this.email
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn: process.env.ACCESS_TOKEN_EXP})
}

userSchema.methods.generateRefreshTokens = function(){
    return jwt.sign({
        _id: this._id
    },process.env.REFRESH_TOKEN_SECRET,{expiresIn: process.env.REFRESH_TOKEN_EXP})
}



export const User = mongoose.model("User",userSchema)