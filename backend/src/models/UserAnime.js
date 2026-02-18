const mongoose = require("mongoose");

const userAnimeSchema = new mongoose.Schema({
  userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true,
  },
  animeId:{
    type:Number,// Jikan mal_id ==> mal_id = 20,
    required:true,
  },
  animeCache: {
    title: String,
    poster: String,
    episodes: Number,
    updatedAt: Date
  },
  status:{
    type:String,
    enum:["watching", "completed", "plan-to-watch", "on-hold", "dropped"],
    default: "plan-to-watch",
  },
  currentEpisode:{
    type:Number,
    default:0,
    min:0,
  },
  rating:{
    type:Number,
    min:0,
    max:10,
  },
  notes:{
    type:String,
    maxlength:1000,
  }
}, {timestamps:true});

//Compound Index
// Prevent same user from adding same anime twice
// Improve query performance for "find user's anime"
userAnimeSchema.index({userId:1, animeId:1}, {unique:true});
// Creates index on both userId AND animeId together
// unique: true prevents duplicate combinations
// Speeds up queries like "find all anime for user X"


// Calculate if anime is completed based on episodes
// A field that does NOT exist in database,
// but appears when you read data.
userAnimeSchema.virtual("isCompleted").get(function() {
  if(!this.animeCache?.episodes) return false;
  return this.currentEpisode >= this.animeCache.episodes;
});

// Also enable virtuals in JSON: ==> Otherwise frontend won’t see it.
userAnimeSchema.set("toJSON", { virtuals: true });
userAnimeSchema.set("toObject", { virtuals: true });


const UserAnime= mongoose.model("UserAnime", userAnimeSchema);

module.exports= UserAnime;