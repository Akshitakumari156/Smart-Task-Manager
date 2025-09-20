const express=require("express");
const moongose=require("mongoose");
const app=express();
const cors=require("cors");
const AuthRouter=require("./Routes/AuthRouter");
const ProductRouter=require("./Routes/ProductRouter");
const TaskRouter=require("./Routes/TaskRouter");
const GetEmailRouter=require("./Routes/GetEmailRouter");
const GetProfileRouter=require("./Routes/GetProfile");
const TeamRouter=require("./Routes/TeamRoutes");
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json());
const PORT=process.env.PORT;
app.use(cors());
const uploadRoute=require("./Routes/UploadRoute");
app.use('/auth',AuthRouter);
app.use("/product",ProductRouter);
app.use("/api/tasks",TaskRouter);
app.use("/api",GetEmailRouter);
app.use("/api/user",uploadRoute);
app.use("/api/user",GetProfileRouter);
app.use("/api/manager",TeamRouter);
app.get("/ping",(req,res)=>{
    res.send("PONG")
})
app.listen(PORT,()=>{
    console.log(`Server is running on ${PORT}`);
})
