const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema= new mongoose.Schema({
  userName:{
    type:String,
    required:true,
    unique:true,
    minlength:3,
    maxlength:20,
    trim:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
    trim:true,
    lowercase:true,
    match:[/^\S+@\S+\.\S+$/, "Please use a valid email"], //RegEx. => match: [ REGEX , ERROR_MESSAGE ]
  },
  password:{
    type:String,
    required:true,
    minlength:6,
  },
  profile:{
    displayName: String,
    bio:{
      type:String,
      maxlength:500,
    },
    avatar:{
      type:String,
    },
  },
}, {timestamps:true});

//To optimize query performance and enforce uniqueness on frequently searched fields like email and username.
// userSchema.index({userName: 1});
// userSchema.index({email: 1});

// Hash password before save
userSchema.pre("save", async function(){
  let user= this;

  if(!user.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(user.password, salt);

  user.password= hashedPassword;
});

// Compare password method. => Every User object should have a function called comparePassword.
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
}

const User = mongoose.model("User", userSchema);

module.exports= User;