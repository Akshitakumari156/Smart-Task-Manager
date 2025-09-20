const {TeamModel,UserModel}=require("../Models/db");
const express=require("express");
const app=express();
app.use(express.json());
const CreateTeam=async(req,res)=>{
    try{
      const {name,managerId}=req.body;
      const newTeam = await TeamModel.create({
      name,
      manager: managerId,
      members: []
      });
      res.status(201).json(newTeam);
    }catch(error){
      res.status(500).json({ error: "Server Error" });
    }
}

const GetAllTeams=async(req,res)=>{
    try{
       const teams = await TeamModel.find({ manager: req.params.managerId });
        res.json(teams);
    }catch(error){
       res.status(500).json({ error: "Server Error" });
    }
}

const AddMember=async(req,res)=>{
    try{
        const { email } = req.body;
        const { teamId } = req.params;
        const team = await TeamModel.findById(teamId);
        if (!team) return res.status(404).json({ message: "Team not found" });
        const user = await UserModel.findOne({ email });
        if (!user) {
        return res.status(404).json({ message: "No user found with this email" });
        }
        const alreadyMember = team.members.find(member => member.email === email);
        if (alreadyMember) {
          return res.status(400).json({ message: "This user is already in the team" });
        }
        await team.save();

        res.status(201).json({
          message: "Member added successfully",
          team
        });
        
    }catch(error){
         console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

const DeleteMemeber=async(req,res)=>{
    try{
       const { teamId, memberId } = req.params;
       const team = await TeamModel.findById(teamId);
       if (!team) return res.status(404).json({ message: "Team not found" });
       const member = team.members.id(memberId);
       if (!member) {
        return res.status(404).json({ message: "Member not found in this team" });
       }
        if (member.user?.toString() === team.manager.toString()) {
          return res.status(400).json({ message: "You cannot remove the manager of the team" });
        }
         member.deleteOne();
        await team.save();
        res.status(200).json({ message: "Member removed successfully", team });
    }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
}

module.exports={
    CreateTeam,
    GetAllTeams,
    AddMember,
    DeleteMemeber
};