# 📁 AnimeNexus Project Structure

Complete folder structure and organization guide.

## 🏗️ Overview

```
anime-nexus/
├── 📄 README.md              # Main project documentation
├── 📄 STRUCTURE.md           # This file
├── 🔒 .gitignore             # Root gitignore
├── 📁 .git/                  # Git repository
│
├── 📁 backend/               # Express API server
│   ├── 📄 README.md          # Backend documentation
│   ├── 📄 .gitignore         # Backend gitignore
│   ├── 📄 .env               # Environment variables (not in git)
│   ├── 📄 package.json       # Backend dependencies
│   ├── 📄 server.js          # Server entry point
│   │
│   ├── 📁 src/               # Source code
│   │   ├── 📁 config/        # Configuration
│   │   │   └── db.js         # MongoDB connection
│   │   │
│   │   ├── 📁 models/        # Mongoose schemas
│   │   │   ├── User.js       # User model
│   │   │   ├── Anime.js      # Anime model
│   │   │   ├── Review.js     # Review model
│   │   │   └── ...
│   │   │
│   │   ├── 📁 routes/        # API endpoints
│   │   │   ├── auth.js       # Auth routes
│   │   │   ├── anime.js      # Anime routes
│   │   │   ├── users.js      # User routes
│   │   │   └── ...
│   │   │
│   │   ├── 📁 controllers/   # Business logic
│   │   │   ├── authController.js
│   │   │   ├── animeController.js
│   │   │   └── ...
│   │   │
│   │   ├── 📁 middleware/    # Custom middleware
│   │   │   ├── auth.js       # JWT verification
│   │   │   ├── errorHandler.js
│   │   │   └── ...
│   │   │
│   │   └── 📁 utils/         # Helper functions
│   │       ├── passwordUtils.js
│   │       └── ...
│   │
│   └── 📁 public/            # Static files (if needed)
│
└── 📁 frontend/              # React application
    ├── 📄 README.md          # Frontend documentation
    ├── 📄 .gitignore         # Frontend gitignore
    ├── 📄 package.json       # Frontend dependencies
    ├── 📄 vite.config.js     # Vite configuration
    ├── 📄 tailwind.config.js # Tailwind configuration
    ├── 📄 postcss.config.js  # PostCSS configuration
    ├── 📄 index.html         # HTML template
    │
    ├── 📁 src/               # Source code
    │   ├── 📄 main.jsx       # Entry point
    │   ├── 📄 App.jsx        # Root component
    │   ├── 📄 index.css      # Global styles
    │   │
    │   ├── 📁 components/    # Reusable UI components
    │   │   ├── Header.jsx    # Navigation header
    │   │   ├── Footer.jsx    # Site footer
    │   │   ├── AnimeCard.jsx # Anime display card
    │   │   ├── Button.jsx    # Reusable button
    │   │   └── ...
    │   │
    │   ├── 📁 pages/         # Full page components
    │   │   ├── Home.jsx      # Landing page
    │   │   ├── Browse.jsx    # Browse anime
    │   │   ├── Library.jsx   # User's library
    │   │   ├── Profile.jsx   # User profile
    │   │   ├── AnimeDetail.jsx
    │   │   └── ...
    │   │
    │   ├── 📁 utils/         # Helper functions
    │   │   ├── api.js        # API client
    │   │   ├── auth.js       # Auth helpers
    │   │   └── ...
    │   │
    │   └── 📁 assets/        # Static assets
    │       ├── images/
    │       ├── fonts/
    │       └── ...
    │
    └── 📁 public/            # Public static files
        └── images/
            └── logo.png      # Site logo
```

## 📋 Folder Purposes

### Backend Structure

| Folder | Purpose | Examples |
|--------|---------|----------|
| `config/` | Configuration files | Database, environment setup |
| `models/` | Database schemas | User, Anime, Review models |
| `routes/` | API endpoint definitions | `/api/auth`, `/api/anime` |
| `controllers/` | Business logic | Handle requests, process data |
| `middleware/` | Request processing | Authentication, error handling |
| `utils/` | Helper functions | Password hashing, validators |

### Frontend Structure

| Folder | Purpose | Examples |
|--------|---------|----------|
| `components/` | Reusable UI pieces | Header, Footer, Button, Card |
| `pages/` | Full page views | Home, Browse, Profile |
| `utils/` | Helper functions | API calls, auth helpers |
| `assets/` | Static resources | Images, fonts, icons |
| `public/` | Public static files | Logo, favicon |

## 🎯 File Naming Conventions

### Backend (Node.js)
- **Models**: PascalCase - `User.js`, `Anime.js`
- **Routes**: camelCase - `auth.js`, `userAnime.js`
- **Controllers**: camelCase + Controller - `authController.js`
- **Utils**: camelCase - `passwordUtils.js`

### Frontend (React)
- **Components**: PascalCase - `Header.jsx`, `AnimeCard.jsx`
- **Pages**: PascalCase - `Home.jsx`, `Browse.jsx`
- **Utils**: camelCase - `api.js`, `auth.js`
- **Styles**: kebab-case - `index.css`

## 🔐 Environment Files

### Backend `.env`
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
NODE_ENV=development
```

### Frontend `.env` (if needed)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📦 Key Files

### Backend
- `server.js` - Server entry point, starts Express
- `src/config/db.js` - MongoDB connection logic
- `package.json` - Dependencies and scripts

### Frontend
- `main.jsx` - React entry point
- `App.jsx` - Root component with routing
- `index.html` - HTML template
- `vite.config.js` - Vite build configuration
- `tailwind.config.js` - Tailwind customization

## 🚀 Development Workflow

1. **Backend**: `cd backend && npm run dev`
2. **Frontend**: `cd frontend && npm run dev`
3. **Both run simultaneously** on different ports

## ✅ Structure Benefits

- ✅ **Separation of Concerns** - Frontend and backend independent
- ✅ **Scalability** - Easy to add new features
- ✅ **Maintainability** - Clear organization
- ✅ **Team Collaboration** - Multiple developers can work simultaneously
- ✅ **Testing** - Easy to test individual components
- ✅ **Deployment** - Can deploy frontend and backend separately

## 📝 Best Practices

1. **Keep components small** - Single responsibility
2. **Reuse code** - DRY principle
3. **Consistent naming** - Follow conventions
4. **Document code** - Add comments for complex logic
5. **Version control** - Commit frequently with clear messages
6. **Environment variables** - Never commit secrets
7. **Error handling** - Graceful error responses
8. **Code formatting** - Use ESLint/Prettier

## 🎓 Learning Path

1. **Week 1**: Backend structure, models, routes
2. **Week 2**: Frontend components, pages, styling
3. **Week 3**: Integration, authentication, API calls
4. **Week 4**: Advanced features, optimization
5. **Week 5**: Testing, deployment, polish

---

This structure is production-ready and follows industry best practices! 🚀
