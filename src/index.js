import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js"

dotenv.config({ path: "./.env" });

const app = express()
connectDB()

app.get("/",(req,res)=>{
    res.json({data:"api is running"})

})

app.listen(4500,()=>{
    console.log("server running or 4500 port")
})