const express= require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {handleUserRegistration,
       handleUserLogin,
       handleUserGetMe,
       handleUserLogout,
       updateProfile,
       changePassword
       } = require("../controllers/auth");

router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);
router.post("/logout", handleUserLogout)

router.get("/me", protect, handleUserGetMe);

router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);



module.exports= router;