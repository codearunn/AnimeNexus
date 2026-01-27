const express= require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {handleUserRegistration,
       handleUserLogin,
       handleUserGetMe,
       handleUserLogout} = require("../controllers/auth");

router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);
router.post("/logout", handleUserLogout)

router.get("/me", protect, handleUserGetMe);



module.exports= router;