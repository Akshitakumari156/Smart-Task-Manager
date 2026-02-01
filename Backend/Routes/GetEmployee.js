const { ensureAuthenticated } = require("../Middlewares/Auth");
const { UserModel } = require("../Models/db");

const router = require("express").Router();

router.get("/getEmployee", ensureAuthenticated, async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);
    const managerId = req.user._id;

    const employees = await UserModel.find(
      { role: "employee", managerId },
      { password: 0 }
    );

    res.status(200).json({
      success: true,
      employees
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching employees",
      error: error.message
    });
  }
});
module.exports=router;