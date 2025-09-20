const { CreateTeam, GetAllTeams, AddMember, DeleteMemeber } = require("../Controllers/TeamController");
const { ensureAuthenticated } = require("../Middlewares/Auth");

const router=require("express").Router();
router.post("/create",ensureAuthenticated,CreateTeam);
router.get("/:managerId",ensureAuthenticated,GetAllTeams);
router.post("/:teamId/add-member",ensureAuthenticated,AddMember);
router.delete("/:teamId/remove-member/:memberId",ensureAuthenticated,DeleteMemeber)

module.exports=router;