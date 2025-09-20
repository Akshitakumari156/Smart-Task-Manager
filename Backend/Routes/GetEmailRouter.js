const { getEmail } = require("../Controllers/GetEmailController");
const { ensureAuthenticated } = require("../Middlewares/Auth");

const router=require("express").Router();

router.get("/getEmail",ensureAuthenticated,getEmail);

module.exports=router;