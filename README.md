# AnimeNexus 🎌

A modern full-stack MERN anime tracking platform with AI-powered recommendations, built for anime enthusiasts to track, discover, and connect.

![AnimeNexus](https://img.shields.io/badge/Status-Production%20Ready-success)
![License](https://img.shields.io/badge/License-MIT-blue)
![Node](https://img.shields.io/badge/Node-v18+-green)
![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green)

---

## ✨ Features

### Core Functionality
- 📺 **Anime Tracking** - Track your watchlist with 5 status categories (watching, completed, plan-to-watch, on-hold, dropped)
- 🔍 **Advanced Search** - Browse 10,000+ anime with genre filtering and sorting
- ⭐ **Rating System** - Rate anime and see community statistics
- 📊 **Personal Dashboard** - View your stats, completion rate, and favorite genres
- 🎯 **Progress Tracking** - Track episodes watched for each anime

### AI-Powered Features
- 🤖 **AI Recommendations** - Get personalized anime suggestions based on your preferences
- ✨ **AI Summaries** - Generate spoiler-free summaries for any anime
- 🔮 **Similar Anime Finder** - Discover anime similar to your favorites with AI analysis
- 💬 **AI Chat Assistant** - Chat with AI for anime recommendations and questions

### User Experience
- 🎨 **Modern UI** - Dark theme with smooth animations and responsive design
- ⚡ **Smart Caching** - Lightning-fast responses with intelligent caching system
- 🔐 **Secure Authentication** - JWT-based auth with password encryption
- 📱 **Mobile Responsive** - Works seamlessly on all devices
- 🚀 **Performance Optimized** - Lazy loading, debouncing, and efficient API calls

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client
- **React Hot Toast** - Beautiful notifications
- **Vite** - Fast build tool

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Rate Limit** - API rate limiting

### AI Integration
- **OpenRouter API** - AI service provider
- **Mistral 7B** - Language model for recommendations

### External APIs
- **Jikan API** - MyAnimeList data (10,000+ anime)

---

## 📦 Installation

### Prerequisites
- Node.js v18 or higher
- MongoDB v6 or higher
- OpenRouter API key ([Get one here](https://openrouter.ai/keys))

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd anime-nexus/backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Configure environment variables:**
Edit `.env` and add your values:
```env
PORT=8000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/animenexus
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your_strong_random_secret_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

5. **Start MongoDB:**
```bash
# macOS (using Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

6. **Start development server:**
```bash
npm run dev
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd anime-nexus/frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create environment file:**
```bash
cp .env.example .env
```

4. **Configure environment variables:**
Edit `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

5. **Start development server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

---

## 🚀 Usage

1. **Register an account** at `/register`
2. **Browse anime** at `/Browse`
3. **Add anime to your library** by clicking on any anime card
4. **Track your progress** in `/MyLibrary`
5. **Get AI recommendations** by clicking "Find Similar Anime" on any anime detail page
6. **Chat with AI** using the floating chat button
7. **View your stats** at `/Profile`

---

## 📡 API Endpoints

### Authentication
```
POST   /api/auth/register          Register new user
POST   /api/auth/login             Login user
GET    /api/auth/me                Get current user
POST   /api/auth/logout            Logout user
PUT    /api/auth/profile           Update profile
PUT    /api/auth/password          Change password
```

### Anime
```
GET    /api/anime/search           Search anime (with filters)
GET    /api/anime/genres           Get all genres
GET    /api/anime/:id/details      Get anime details with stats
```

### User Anime Library
```
GET    /api/user-anime             Get user's library
POST   /api/user-anime             Add anime to library
PUT    /api/user-anime/:id         Update anime status/rating
DELETE /api/user-anime/:id         Remove from library
```

### AI Features
```
POST   /api/ai/recommend           Chat with AI assistant
POST   /api/ai/summary             Generate anime summary
POST   /api/ai/similar             Find similar anime
```

### Admin
```
GET    /api/admin/cache-stats      View cache statistics
POST   /api/admin/cache-clear      Clear cache
```

---

## 🎨 Features in Detail

### Smart Caching System
- In-memory LRU cache with TTL
- 24-hour cache for AI responses
- Automatic cleanup of expired entries
- Cache hit rate monitoring
- Reduces API costs by 90%+

### AI Integration
- **Summaries**: Spoiler-free 2-3 sentence summaries
- **Similar Anime**: AI analyzes plot, themes, and genres
- **Recommendations**: Personalized based on your preferences
- **Chat**: Natural language anime recommendations

### Rate Limiting
- AI endpoints: 10 requests/minute
- Similar anime: 5 requests/minute
- Auth routes: 5 requests/15 minutes
- Public endpoints: 200 requests/minute

---

## 📁 Project Structure

```
anime-nexus/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route controllers
│   │   ├── middleware/      # Auth, error handling, rate limiting
│   │   ├── models/          # Mongoose models
│   │   ├── routes/          # API routes
│   │   ├── services/        # AI, Jikan, cache services
│   │   └── utils/           # Helper functions
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── api/             # Axios configuration
│   │   ├── components/      # React components
│   │   ├── context/         # Auth context
│   │   ├── pages/           # Page components
│   │   └── utils/           # Helper functions
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── DEPLOYMENT.md
```

---

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcryptjs
- HTTP-only cookies
- CORS protection
- Rate limiting on all endpoints
- Input validation and sanitization
- Environment variable protection

---

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Render (Recommended)
- Vercel + Railway
- AWS / DigitalOcean

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- [Jikan API](https://jikan.moe/) - MyAnimeList unofficial API
- [OpenRouter](https://openrouter.ai/) - AI API service
- [Mistral AI](https://mistral.ai/) - Language model
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [React](https://react.dev/) - UI library

---

## 📊 Stats

- 10,000+ anime in database
- 5 tracking statuses
- AI-powered recommendations
- Smart caching system
- Mobile responsive
- Production ready

---

## 🐛 Known Issues

None at the moment! Report issues on GitHub.

---

## 🔮 Future Enhancements

- [ ] Social features (follow users, activity feed)
- [ ] Anime reviews and comments
- [ ] Watchlist sharing
- [ ] Email notifications
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Seasonal anime tracking
- [ ] Manga tracking support

---

**Built with ❤️ for anime fans worldwide**
