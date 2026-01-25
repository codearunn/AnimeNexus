# AnimeNexus Backend API

Express.js REST API for AnimeNexus anime tracking platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev
```

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   └── db.js        # MongoDB connection
│   ├── models/          # Mongoose schemas
│   │   ├── User.js
│   │   ├── Anime.js
│   │   └── Review.js
│   ├── routes/          # API routes
│   │   ├── auth.js
│   │   ├── anime.js
│   │   └── users.js
│   ├── controllers/     # Route handlers
│   │   ├── authController.js
│   │   └── animeController.js
│   ├── middleware/      # Custom middleware
│   │   ├── auth.js      # JWT verification
│   │   └── errorHandler.js
│   └── utils/           # Helper functions
│       └── passwordUtils.js
├── server.js            # Entry point
├── .env                 # Environment variables
└── package.json
```

## 🔧 Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/anime-nexus
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Anime
- `GET /api/anime` - Get all anime
- `GET /api/anime/:id` - Get single anime
- `GET /api/anime/search` - Search anime
- `POST /api/anime` - Create anime (admin)

### User Anime
- `GET /api/user-anime` - Get user's anime list
- `POST /api/user-anime` - Add anime to list
- `PUT /api/user-anime/:id` - Update anime progress
- `DELETE /api/user-anime/:id` - Remove from list

### Reviews
- `GET /api/reviews/anime/:animeId` - Get anime reviews
- `POST /api/reviews` - Create review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review

## 🛠️ Development

```bash
# Start with nodemon (auto-restart)
npm run dev

# Start production
npm start

# Run tests (when implemented)
npm test
```

## 📦 Dependencies

- **express** - Web framework
- **mongoose** - MongoDB ODM
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - CORS middleware
- **dotenv** - Environment variables
- **nodemon** - Development auto-restart

## 🔐 Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens for authentication
- CORS configured for frontend origin
- Input validation on all routes
- MongoDB injection prevention

## 📝 Notes

- All routes return JSON responses
- Error responses follow consistent format
- Authentication required for protected routes
- Rate limiting implemented on auth routes
