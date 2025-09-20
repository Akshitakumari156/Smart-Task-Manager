const jwt=require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET;
const ensureAuthenticated=(req,res,next)=>{
    const token=req.headers["token"];
    if(!token){
        return res.status(403).json({
            message:"Unauthorized! Jwt token is required"
        })
    }
    try{
        const decoded=jwt.verify(token,JWT_SECRET);
        req.user=decoded;
        next();
    }catch(err){
        return res.status(401).json({
            message:"Unauthorized!Wrong Jwt token or expiry"
        })
    }
}
module.exports={
    ensureAuthenticated
}