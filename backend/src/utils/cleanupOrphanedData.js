// Script to clean up orphaned UserAnime entries (where animeId is null or doesn't exist)
require('dotenv').config();
const mongoose = require("mongoose");
const UserAnime = require("../models/UserAnime");
const Anime = require("../models/Anime");
const connectDB = require("../config/db");

const cleanupOrphanedData = async () => {
  try {
    // Connect to database
    await connectDB(process.env.MONGODB_URI);
    console.log("Connected to database");

    // Find all UserAnime entries
    const allUserAnime = await UserAnime.find({});
    console.log(`Found ${allUserAnime.length} UserAnime entries`);

    let orphanedCount = 0;
    const orphanedIds = [];

    // Check each entry
    for (const userAnime of allUserAnime) {
      if (!userAnime.animeId) {
        // animeId is null
        orphanedIds.push(userAnime._id);
        orphanedCount++;
        console.log(`Found orphaned entry (null animeId): ${userAnime._id}`);
      } else {
        // Check if the anime actually exists
        const animeExists = await Anime.findById(userAnime.animeId);
        if (!animeExists) {
          orphanedIds.push(userAnime._id);
          orphanedCount++;
          console.log(`Found orphaned entry (anime doesn't exist): ${userAnime._id} -> ${userAnime.animeId}`);
        }
      }
    }

    if (orphanedCount > 0) {
      console.log(`\nFound ${orphanedCount} orphaned entries`);
      console.log("Deleting orphaned entries...");
      
      const result = await UserAnime.deleteMany({ _id: { $in: orphanedIds } });
      console.log(`✅ Deleted ${result.deletedCount} orphaned entries`);
    } else {
      console.log("✅ No orphaned entries found. Database is clean!");
    }

    process.exit(0);
  } catch (error) {
    console.error("Error cleaning up orphaned data:", error);
    process.exit(1);
  }
};

cleanupOrphanedData();
