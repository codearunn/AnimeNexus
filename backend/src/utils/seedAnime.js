// A script to populate your database with sample anime
// A standalone Node.js file that inserts sample data into your database.

require('dotenv').config();
const mongoose = require("mongoose");
const Anime = require("../models/Anime");
const connectDB = require("../config/db");

const animeData = [
  {
    title: {
      english: "Naruto",
      japanese: "ナルト"
    },
    synopsis: "Naruto Uzumaki, a young ninja who seeks recognition from his peers and dreams of becoming the Hokage, the leader of his village.",
    episodes: 220,
    duration: 23,
    status: "completed",
    genres: ["Action", "Adventure", "Fantasy", "Martial Arts"],
    images: {
      poster: "https://cdn.myanimelist.net/images/anime/13/17405.jpg"
    },
    rating: {
      average: 8.3,
      count: 150000
    },
    year: 2002,
    studio: "Studio Pierrot",
    source: "manga"
  },
  {
    title: {
      english: "Attack on Titan",
      japanese: "進撃の巨人"
    },
    synopsis: "Humans are nearly exterminated by giant creatures called Titans. Titans are typically several stories tall, seem to have no intelligence, devour human beings and, worst of all, seem to do it for the pleasure rather than as a food source.",
    episodes: 75,
    duration: 24,
    status: "completed",
    genres: ["Action", "Drama", "Fantasy", "Mystery"],
    images: {
      poster: "https://cdn.myanimelist.net/images/anime/10/47347.jpg"
    },
    rating: {
      average: 9.0,
      count: 200000
    },
    year: 2013,
    studio: "Wit Studio",
    source: "manga"
  },
  {
    title: {
      english: "Death Note",
      japanese: "デスノート"
    },
    synopsis: "A high school student discovers a supernatural notebook that allows him to kill anyone by writing their name in it, leading to a dangerous battle of wits.",
    episodes: 37,
    duration: 24,
    status: "completed",
    genres: ["Mystery", "Thriller", "Psychological", "Supernatural"],
    images: {
      poster: "https://cdn.myanimelist.net/images/anime/9/9453.jpg"
    },
    rating: {
      average: 8.9,
      count: 460000
    },
    year: 2006,
    studio: "Madhouse",
    source: "manga"
  },

  {
    title: {
      english: "One Piece",
      japanese: "ワンピース"
    },
    synopsis: "Monkey D. Luffy sails with his pirate crew in search of the legendary treasure One Piece to become the Pirate King.",
    episodes: 1000,
    duration: 24,
    status: "airing",
    genres: ["Action", "Adventure", "Comedy", "Fantasy"],
    images: {
      poster: "https://cdn.myanimelist.net/images/anime/6/73245.jpg"
    },
    rating: {
      average: 9.0,
      count: 350000
    },
    year: 1999,
    studio: "Toei Animation",
    source: "manga"
  },

  {
    title: {
      english: "My Hero Academia",
      japanese: "僕のヒーローアカデミア"
    },
    synopsis: "In a world where most people have superpowers, a powerless boy enrolls in a hero academy to become the greatest hero.",
    episodes: 138,
    duration: 24,
    status: "airing",
    genres: ["Action", "Superhero", "School", "Fantasy"],
    images: {
      poster: "https://cdn.myanimelist.net/images/anime/10/78745.jpg"
    },
    rating: {
      average: 8.2,
      count: 220000
    },
    year: 2016,
    studio: "Bones",
    source: "manga"
  },

  {
    title: {
      english: "Demon Slayer",
      japanese: "鬼滅の刃"
    },
    synopsis: "After his family is slaughtered by demons, a boy becomes a demon slayer to save his sister and avenge his family.",
    episodes: 44,
    duration: 24,
    status: "completed",
    genres: ["Action", "Adventure", "Fantasy", "Supernatural"],
    images: {
      poster: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg"
    },
    rating: {
      average: 8.7,
      count: 350000
    },
    year: 2019,
    studio: "Ufotable",
    source: "manga"
  },

  {
    title: {
      english: "Fullmetal Alchemist: Brotherhood",
      japanese: "鋼の錬金術師 FULLMETAL ALCHEMIST"
    },
    synopsis: "Two brothers search for the Philosopher’s Stone after a failed alchemy experiment leaves them physically damaged.",
    episodes: 64,
    duration: 24,
    status: "completed",
    genres: ["Action", "Adventure", "Fantasy", "Drama"],
    images: {
      poster: "https://cdn.myanimelist.net/images/anime/1223/96541.jpg"
    },
    rating: {
      average: 9.1,
      count: 240000
    },
    year: 2009,
    studio: "Bones",
    source: "manga"
  },

  {
    title: {
      english: "Tokyo Ghoul",
      japanese: "東京喰種"
    },
    synopsis: "A college student becomes half-ghoul after a deadly encounter and must survive in a dark world hidden from humans.",
    episodes: 48,
    duration: 24,
    status: "completed",
    genres: ["Horror", "Dark Fantasy", "Action", "Psychological"],
    images: {
      poster: "https://cdn.myanimelist.net/images/anime/5/64435.jpg"
    },
    rating: {
      average: 7.8,
      count: 220000
    },
    year: 2014,
    studio: "Pierrot",
    source: "manga"
  },

  {
    title: {
      english: "One Punch Man",
      japanese: "ワンパンマン"
    },
    synopsis: "A hero who can defeat any enemy with a single punch struggles with boredom and seeks worthy opponents.",
    episodes: 24,
    duration: 24,
    status: "completed",
    genres: ["Action", "Comedy", "Superhero"],
    images: {
      poster: "https://cdn.myanimelist.net/images/anime/12/76049.jpg"
    },
    rating: {
      average: 8.5,
      count: 270000
    },
    year: 2015,
    studio: "Madhouse",
    source: "manga"
  },

  {
    title: {
      english: "Jujutsu Kaisen",
      japanese: "呪術廻戦"
    },
    synopsis: "A student joins a secret school of sorcerers to battle deadly curses threatening humanity.",
    episodes: 36,
    duration: 24,
    status: "airing",
    genres: ["Action", "Supernatural", "Fantasy"],
    images: {
      poster: "https://cdn.myanimelist.net/images/anime/1171/1172405.jpg"
    },
    rating: {
      average: 8.8,
      count: 230000
    },
    year: 2020,
    studio: "MAPPA",
    source: "manga"
  }
];


const seedAnime = async () => {
  try {
    // Connect to database
    await connectDB(process.env.MONGODB_URI);

    // Clear existing anime
    await Anime.deleteMany({});
    console.log("Cleared existing anime data");

    // Insert new anime
    await Anime.insertMany(animeData);
    console.log("Anime data seeded successfully!");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding anime:", error);
    process.exit(1);
  }
};

seedAnime();
