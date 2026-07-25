import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import express from "express";
import connectDB from "./db/index.js"
import app from "./app.js";


connectDB()

app.get("/",(req,res)=>{
    res.json({data:"api is running"})

})

app.listen(4500,()=>{
    console.log("server running or 4500 port")
})