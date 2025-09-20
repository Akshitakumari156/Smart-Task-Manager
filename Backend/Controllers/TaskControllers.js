const { TaskModel, UserModel } = require("../Models/db");
const express=require("express");
const app=express();
app.use(express.json());
const createTask=async (req,res)=>{
    try{
        const{title,description,priority,status,dueDate,assignedTo,createdBy}=req.body;
        if(!title || !createdBy){
            return resizeBy.status(400).json({success:false,message:"Title and CreatedBy are required"});
        }
        console.log("this is req.user",req.user);
        const newTask=new TaskModel({
            title,
            description,
            priority,status,dueDate,assignedTo,createdBy
        });
        await newTask.save();
        res.status(201).json({
        message:"Task created successfull",success:true
    })
    }catch(error){
        console.log("Create Task Error",error);
        res.status(500).json({
            success:false,message:"Internal server error"
        })
    }
}

const getUserTasks=async (req,res)=>{
    try{
     const userId=req.user._id;
     const tasks=await TaskModel.find({
        $or:[{createdBy:userId},{assignedTo:userId}]
     })
     .populate({
        path: "createdBy",
        model: UserModel, // Explicitly telling mongoose to use this model
        select: "name email",
      })
      .populate({
        path: "assignedTo",
        model: UserModel,
        select: "name email",
      });
     res.status(200).json({success:true,tasks});
    }catch(error){
    console.error("Fetch Tasks Error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}

const updateTask=async (req,res)=>{
    try{
     const {taskId}=req.params;
     const updates=req.body;
     const updatedTask=await TaskModel.findByIdAndUpdate(taskId,updates,{
        new:true,
     });
     if(!updatedTask){
        return res.status(404).json({success:false,message:"Task Not Found"})
     }
      res.status(200).json({success:true,message:"Task is Updated Successfully",tasks:updatedTask});
    }catch(error){
        console.log("Update Task Error:",error);
        res.status(500).json({
            success:false,message:"Internal Server Error"
        })
    }
}

const deleteTask=async (req,res)=>{
    try{
       const {taskId}=req.params;
       const deletedTask=await TaskModel.findByIdAndDelete(taskId);
       if(!deleteTask){
        return res.status(404).json({
            success:false,
            message:"Task Not found"
        })
       }
       res.status(200).json({success:true,message:"Task Deleted Successfully"});
    }catch(error){
       console.log("Delete Task error",error);
        res.status(500).json({
            success:false,message:"Internal Server Error"
        });
    }
}

module.exports={
    createTask,
    getUserTasks,
    updateTask,
    deleteTask
}