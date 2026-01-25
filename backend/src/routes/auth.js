const express= require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {handelUserRegistration, handelUserLogin, handelUserGetMe} = require("../controllers/auth");

router.post("/register", handelUserRegistration);
router.post("/login", handelUserLogin);

router.get("/me", protect, handelUserGetMe);



module.exports= router;