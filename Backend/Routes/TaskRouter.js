const { createTask, getUserTasks, updateTask, deleteTask } = require("../Controllers/TaskControllers");
const { ensureAuthenticated } = require("../Middlewares/Auth");
const { taskValidation } = require("../Middlewares/TaskValidation");

const router=require("express").Router();

router.post("/create",ensureAuthenticated,taskValidation,createTask);

router.get("/getTasks",ensureAuthenticated,getUserTasks);

router.put("/updateTask/:taskId",ensureAuthenticated,updateTask);

router.delete("/delete/:taskId",ensureAuthenticated,deleteTask);

module.exports=router;