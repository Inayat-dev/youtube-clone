import mongoose from "mongoose";
import { database } from "../constants.js";

const connectDB = async ()=>{
    try{
        const coni = mongoose.connect(`${process.env.MONGODB_URI}/${database}`) 
        
        console.log("database connected successfuly : "+coni)
        
    }catch(err){
        console.log("Error in Connecting DataBase :"+err)
        process.exit(1)
    }
}

export default connectDB