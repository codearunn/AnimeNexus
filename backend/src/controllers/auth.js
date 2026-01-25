const User = require("../models/user");
const generateToken= require("../utils/generateToken");

async function handelUserRegistration(req, res) {
  try {
    const {userName, email , password} = req.body;

    if(!userName || !email || !password){
      return res.status(400).json({
        status:false,
        message:"All feilds are required",
      });
    }
    if(userName.length<3 || userName.length>20){
      return res.status(400).json({
          status:false,
          message:"Username must be between 3-20 characters",
        });
    }
    if(password.length<6){
      return res.status(400).json({
          status:false,
          message:"Password must be at least 6 characters long",
        });
    }
    const existingUserName = await User.findOne({userName});
    if(existingUserName){
      return res.status(409).json({
          status:false,
          message:"Username is already taken",
        });
    }
    const existingUserEmail = await User.findOne({email});
    if(existingUserEmail){
      return res.status(409).json({
          //409 = “Conflict” (standard for something like “this resource already exists”).
          status:false,
          message:"Email is already registered",
        });
    }
    const emailRegEx = /^\S+@\S+\.\S+$/;
    if(!emailRegEx.test(email)){
      return res.status(400).json({
        status: false,
        message: "Invalid email format",
      });
    }

    const user = await User.create({
      userName,
      email,
      password,
    });

    const token = generateToken(user._id);

    res.cookie("token", token,{
        httpOnly:true,
        secure: process.env.NODE_ENV=== "production",
        sameSite:"strict",
      }
    );
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
    console.log("Error in handelUserRegistration", error);
    return res.status(500).json({
      status:false,
      message:"Internal Server error",
    })
  }
};


async function handelUserLogin(req, res) {
  try {
    const {email, password} = req.body;
    if(!email || !password){
      return res.status(400).json({
        status:false,
        message:"Please provide email and password",
      });
    }
    const user = await User.findOne({email});
    if(!user){
      return res.status(401).json({ // 404 => resource not found and 401=> Auth failure
        status:false,
        message:"Invalid credentials",
      })
    }

    const validUser= await user.comparePassword(password);

    if(!validUser){
      return res.status(401).json({
        status:false,
        message:"Invalid credentials",
      })
    }

    const token = generateToken(user._id);

    res.cookie("token", token,{
        httpOnly:true,
        secure: process.env.NODE_ENV=== "production",
        sameSite:"strict",
      }
    );
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
    console.log("Error in handelUserLogin", error);
    return res.status(500).json({
      status:false,
      message:"Internal Server error",
    })
  }
};

async function handelUserGetMe(req, res) {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.log("Error in handelUserGetMe", error);
    return res.status(500).json({
      status:false,
      message:"Internal Server error",
    })
  }
}

module.exports ={
  handelUserRegistration,
  handelUserLogin,
  handelUserGetMe,
}