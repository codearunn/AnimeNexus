const express= require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const { authLimiter } = require("../middleware/rateLimiters");

const {handleUserRegistration,
       handleUserLogin,
       handleUserGetMe,
       handleUserLogout,
       updateProfile,
       changePassword,
       deleteAccount
       } = require("../controllers/auth");

router.post("/register",authLimiter, handleUserRegistration);
router.post("/login",authLimiter, handleUserLogin);
router.post("/logout", handleUserLogout)

router.get("/me", protect, handleUserGetMe);

router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);
router.delete("/account", protect, deleteAccount);



module.exports= router;