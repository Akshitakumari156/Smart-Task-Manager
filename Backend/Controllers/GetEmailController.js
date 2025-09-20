const express=require("express");
const app=express();
const jwt=require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET;

const getEmail=(req,res)=>{
   try{
     const token=req.headers.token;
     if(!token){
        return res.status(401).json({ message: "Token missing", success: false });
     }
     const decoded=jwt.verify(token,JWT_SECRET);
     return res.status(200).json({
      success: true,
      email: decoded.email,
      id: decoded._id,
    });
   }catch(error){
     return res.status(401).json({ message: "Invalid Token", success: false });
   }
}

module.exports={getEmail};