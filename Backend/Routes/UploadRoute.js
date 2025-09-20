const router=require("express").Router();
const upload = require("../Middlewares/Multer");
const { ensureAuthenticated } = require("../Middlewares/Auth");
const cloudinary=require("../Utils/Cloudinary");
const { UserModel } = require("../Models/db");

router.post("/upload",ensureAuthenticated,upload.single("image"), async (req, res) => {
    console.log("REQ BODY:", req.body);
    console.log("REQ USER",req.user);
  console.log("REQ FILE:", req.file);
  try {
    console.log("Uploaded file:", req.file); // Debugging
    const email=req.user.email;
    if (!email) {
        return res.status(400).json({ success: false, message: "Email not found from token" });
      }
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "TaskManagerImage",
    });
    const updatedManager = await UserModel.findOneAndUpdate(
        { email: email },
        { profileImage: result.secure_url },
        { new: true, upsert: true }
      );
    res.status(200).json({
        success: true,
        message: "Profile picture uploaded successfully!",
        data: updatedManager,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error uploading file",
      error: error.message,
    });
  }
});


module.exports=router;