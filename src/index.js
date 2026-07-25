import express from "express";
import dotenv from "dotenv";
import connectDB from "./db/index.js"
import app from "./app.js";

dotenv.config({ path: "./.env" });

connectDB()

app.get("/",(req,res)=>{
    res.json({data:"api is running"})

})

app.listen(4500,()=>{
    console.log("server running or 4500 port")
})