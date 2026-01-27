const mongoose = require("mongoose");

const animeSchema = new mongoose.Schema({
  title:{
    english:{
      type:String,
      required:[true,"English title is required" ], // Custom error messages
      trim:true,
      minlength:[1, "Title must be at least 1 character"],
      maxlength:[200, "Title cannot exceed 200 characters"]
    },
    japanese:{
      type:String,
      trim:true,
    },
  },
  synopsis:{
    type:String,
    required: [true, "Synopsis is required"],
    trim:true,
    minlength: [10, "Synopsis must be at lest 10 character"],
    maxlength: [2000, "Synopsis cannot exceed 2000 characters"],
  },
  episodes:{
    type:Number,
    required: [true, "Episode Number is required"],
    min: [1, "Episode must have at least 1 episode"],
    max: [10000, "Episode can't exceed 10000"],
  },
  duration:{
    type:Number, // in minutes
    default: 24,
    min: [1, "Duration must be at least 1 minute"],
  },
  status:{
    type:String,
    enum:{
      values:["airing", "completed", "upcoming"],
      message: "Status must be airing, completed or upcoming",
    },
    default:"completed",
  },
  genres:{
    type: [String], // Array of string,
    required: [true, "At least one genre is required"],
    validate:{
      validator: function (arr) {
        return arr.length>0 && arr.length<=10 // return boolean ==> Why limit array size (performance)
      },
      message: "Anime must have 1-10 genres",
    }
  },
  images:{
    poster:{
      type:String,
      required: [true, "Poster is required"],
      validate:{
        validator: function(url){
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(url);
        },
        message:"Invalid image URL format",
      }
    },
    banner:{
      type:String,
      validate:{
        validator: function(url){
          if(!url) return true;
          return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(url); // https://cdn.site.com/anime.jpg
        },
        message: "Invalid image URL format",
      }
    },
  },
  rating:{
    average:{
      type:Number,
      default:0,
      min:0,
      max:10,
    },
    count:{
      type: Number,
      default: 0,
      min: 0
    }
  },
  year:{
    type:Number,
    min: [1960, "Year must be 1960 or later"],
    max: [new Date().getFullYear()+1, "Year cannot be in the future"],
  },
  studio: {
    type: String,
    trim: true
  },
  source: {
    type: String,
    enum: ["manga", "novel", "original", "game", "other"],
    default: "manga"
  },
}, {timestamps:true});

// Indexes for faster queries
animeSchema.index({ "title.english": 1 });
animeSchema.index({ genres: 1 });
animeSchema.index({ status: 1 });
animeSchema.index({ year: -1 });
animeSchema.index({ "rating.average": -1 });


const Anime = mongoose.model("Anime", animeSchema);

module.exports= Anime;
