# 🎌 AnimeNexus

A full-stack anime tracking and community platform combining MyAnimeList-style tracking, Letterboxd-style reviews, and Discord-lite community features.

## 🚀 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations
- **React Router** - Client-side routing
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
anime-nexus/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Full page components
│   │   ├── utils/         # Helper functions
│   │   └── assets/        # Static assets
│   └── public/            # Public static files
│
└── backend/           # Express backend API
    ├── src/
    │   ├── config/        # Configuration files
    │   ├── models/        # MongoDB schemas
    │   ├── routes/        # API endpoints
    │   ├── controllers/   # Business logic
    │   ├── middleware/    # Custom middleware
    │   └── utils/         # Helper functions
    └── server.js          # Entry point
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- npm or yarn

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Backend Setup
```bash
cd backend
npm install

# Create .env file with:
# PORT=5000
# MONGODB_URI=your_mongodb_connection_string
# JWT_SECRET=your_secret_key

npm run dev
```
Backend runs on: `http://localhost:5000`

## 🎯 Features

- 📺 **Anime Tracking** - Track watching, completed, and plan-to-watch lists
- 🔍 **Discovery** - Search and browse anime database
- ⭐ **Reviews & Ratings** - Write reviews and rate anime
- 👥 **Community** - Discussion threads and social features
- 🔔 **Notifications** - Real-time updates
- 🎨 **Themes** - Red & black themed UI

## 📝 Development

- Frontend: `npm run dev` (with hot reload)
- Backend: `npm run dev` (with nodemon)
- Build: `npm run build`

## 🤝 Contributing

This is a learning project. Feel free to explore and learn!

## 📄 License

MIT License - feel free to use for learning purposes.

---

Built with ❤️ for anime fans
