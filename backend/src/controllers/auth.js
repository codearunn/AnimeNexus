const User = require("../models/User");
const generateToken= require("../utils/generateToken");
const ErrorResponse = require("../utils/errorResponse");

async function handelUserRegistration(req, res, next) {
  try {
    const {userName, email , password} = req.body;

    if(!userName || !email || !password){
      throw new ErrorResponse("All fields are required", 400);
    }
    if(userName.length<3 || userName.length>20){
      throw new ErrorResponse("Username must be between 3-20 characters", 400);
    }
    if(password.length<6){
      throw new ErrorResponse("Password must be at least 6 characters long", 400);
    }
    const existingUserName = await User.findOne({userName});
    if(existingUserName){
      throw new ErrorResponse("Username is already taken", 409);
    }
    const existingUserEmail = await User.findOne({email});
    if(existingUserEmail){
      throw new ErrorResponse("Email is already registered", 409);
    }
    const emailRegEx = /^\S+@\S+\.\S+$/;
    if(!emailRegEx.test(email)){
      throw new ErrorResponse("Invalid email format", 400);
    }

    const user = await User.create({
      userName,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false // ✅ Must be false for localhost
    });
    return res.status(201).json({
      status:true,
      message:"User registered successfully",
      user:{
        id: user._id,
        userName: user.userName,
        email: user.email,
      }
    })
  } catch (error) {
    next(error);
  }
};

// 404 => resource not found and 401=> Auth failure
async function handelUserLogin(req, res, next) {
  try {
    const {email, password} = req.body;
    if(!email || !password){
      throw new ErrorResponse("Please provide email and password", 400);
    }
    const user = await User.findOne({email});
    if(!user){
      throw new ErrorResponse("Invalid credentials", 401);
    }

    const validUser= await user.comparePassword(password);

    if(!validUser){
      throw new ErrorResponse("Invalid credentials", 401);
    }

    const token = generateToken(user._id);


    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false
    });
    return res.status(200).json({
      status:true,
      message:"User LoggedIn successfully",
      user:{
        id: user._id,
        userName: user.userName,
        email: user.email,
      }
    })
  } catch (error) {
    next(error);
  }
};

async function handelUserGetMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      throw new ErrorResponse("User not found", 404);
    }

    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports ={
  handelUserRegistration,
  handelUserLogin,
  handelUserGetMe,
}