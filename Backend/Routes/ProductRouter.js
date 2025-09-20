const { ensureAuthenticated } = require("../Middlewares/Auth");

const router=require("express").Router();

router.get("/",ensureAuthenticated,(req,res)=>{
    console.log(req.user);
    res.status(200).json([
        {
            name:"Mobile",
            price:132663
        },{
            name:"TV",
            price:483848
        }
    ])
})

module.exports=router;