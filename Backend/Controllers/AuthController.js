const { UserModel } = require("../Models/db");
const bcrypt=require("bcrypt")
const express=require("express");
const app=express();
const jwt=require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET;

app.use(express.json());
const signup=async (req,res)=>{
    try{
    const email=req.body.email;
    const password=req.body.password;
    const name=req.body.name;
    const role=req.body.role;
    const user=await UserModel.findOne({
       email:email,role:role
    })
    if(user){
        return res.status(409).json({
            message:"You already have a account.You can login",success:false
        })
    }
    const userModelCreated=new UserModel({email,password,name,role});
    userModelCreated.password=await bcrypt.hash(password,10);
    await userModelCreated.save();
    res.status(201).json({
        message:"SignedUp successfull",success:true
    })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message:"Internal Server error",
            success:false
        })
    }
}
const login=async (req,res)=>{
    try{
    const email=req.body.email;
    const password=req.body.password;
    const role=req.body.role;
    const user=await UserModel.findOne({
       email:email,role:role
    })
    const errorMessage="Auth failed Email or password is wrong";
    if(!user){
        return res.status(403).json({
            message:errorMessage,success:false
        })
    }
    const isPassEqual=await bcrypt.compare(password,user.password);
    if(!isPassEqual){
        return res.status(403).json({
            message:errorMessage,success:false
        })
    }
    console.log(user);
    const token=jwt.sign({
        email:user.email,
        _id:user._id,
    },JWT_SECRET,{ expiresIn: '24h' });
    res.status(200).json({
        message:"Login successfull",success:true,token,email,name:user.name,role
    })
    }catch(err){
        res.status(500).json({
            message:"Internal Server error",
            success:false
        })
    }
}
module.exports={
    signup,
    login
};