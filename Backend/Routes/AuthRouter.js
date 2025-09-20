const { signup, login } = require("../Controllers/AuthController");
const { loginValidation, signupValidation } = require("../Middlewares/AuthValidation");

const router=require("express").Router();

router.post("/signup",signupValidation,signup)

router.post("/login",loginValidation,login)

module.exports=router;