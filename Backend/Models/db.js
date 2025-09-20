const { required } = require("joi");
const moongose=require("mongoose");
const { mainConnection, taskConnection, teamsConnection ,connectionRequest} = require("../Config/db");

const Schema=moongose.Schema;

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
      type:String,
      required:true
    },
    profileImage: {
    type: String,
    default: "", // Cloudinary URL will be stored here
    },
    description:{
      type:String,
      default:"",
    },
    managerId: {
     type: moongose.Schema.Types.ObjectId, ref: "User" 
    },
})

const TaskSchema=new Schema({
    title: { type: String, required: true },
    description: { type: String },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Low" },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Completed"],
      default: "To Do",
    },
    dueDate: { type: Date },
    subtasks: [
      {
        title: String,
        completed: { type: Boolean, default: false },
      },
    ],
    assignedTo: [{ type: moongose.Schema.Types.ObjectId, ref: "User" ,required:true}],
    createdBy: { type: moongose.Schema.Types.ObjectId, ref: "User", required: true },
},{timestamps:true})

const teamSchema = new moongose.Schema({
  name: { type: String, required: true },
  manager: { type: moongose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [
    {
      user: { type: moongose.Schema.Types.ObjectId, ref: "User" }, // ObjectId reference
      email: { type: String, required: true },
      name: { type: String, default: "Pending User" },
      status: { type: String, enum: ["pending", "accepted"], default: "pending" }
    }
  ]
}, { timestamps: true });

const connectionRequestSchema = new moongose.Schema({
  manager: { type: moongose.Schema.Types.ObjectId, ref: "User", required: true },
  employee: { type: moongose.Schema.Types.ObjectId, ref: "User", required: true },
  status: { 
    type: String, 
    enum: ["pending", "accepted", "rejected"], 
    default: "pending" 
  },
  createdAt: { type: Date, default: Date.now }
});

const ConnectionRequest = connectionRequest.model("ConnectionRequest", connectionRequestSchema);
const UserModel=mainConnection.model("User",userSchema);
const TaskModel=taskConnection.model("Task",TaskSchema);
const TeamModel=teamsConnection.model("Teams",teamSchema);
module.exports={
    UserModel:UserModel,
    TaskModel:TaskModel,
    TeamModel:TeamModel
}