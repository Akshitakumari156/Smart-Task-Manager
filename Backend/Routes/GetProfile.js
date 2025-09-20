const { ensureAuthenticated } = require("../Middlewares/Auth");
const { UserModel } = require("../Models/db");

const router=require("express").Router();

router.get("/getProfile",ensureAuthenticated,async(req,res)=>{
    try{
       const Person=await UserModel.findOne({ email: req.user.email });
       if(!Person){
        return res.status(404).json({ success: false, message: "Person not found" });
       }
       res.status(200).json({ success: true, data: Person });
    }catch(error){
        res.status(500).json({ success: false, message: error.message });
    }
})
module.exports=router;
