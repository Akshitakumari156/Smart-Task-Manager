const {TeamModel,UserModel}=require("../Models/db");
const express=require("express");
const app=express();
app.use(express.json());
const CreateTeam = async (req, res) => {
  try {
    const { name, members } = req.body;
    const managerId = req.user._id;

    if (!name) {
      return res.status(400).json({ message: "Team name is required" });
    }

    const formattedMembers = members.map(userId => ({
      user: userId,
      status: "accepted"
    }));

    const newTeam = await TeamModel.create({
      name,
      manager: managerId,
      members: formattedMembers
    });

    res.status(201).json({
      success: true,
      team: newTeam
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const GetAllTeams=async(req,res)=>{
    try{
       const teams = await TeamModel.find({ manager: req.params.managerId });
        res.json(teams);
    }catch(error){
       res.status(500).json({ error: "Server Error" });
    }
}

const AddMember = async (req, res) => {
  try {
    const { email } = req.body;
    const { teamId } = req.params;

    const team = await TeamModel.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyMember = team.members.some(
      m => m.user?.toString() === user._id.toString()
    );
    if (alreadyMember) {
      return res.status(400).json({ message: "User already in team" });
    }

    team.members.push({
      user: user._id,
      email: user.email,
      name: user.name,
      status: "accepted"
    });

    await team.save();

    res.status(201).json({ success: true, team });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


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