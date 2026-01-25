# AnimeNexus Frontend

React + Vite frontend for AnimeNexus anime tracking platform.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit: `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── AnimeCard.jsx
│   │   └── ...
│   ├── pages/           # Full page components
│   │   ├── Home.jsx
│   │   ├── Browse.jsx
│   │   ├── Library.jsx
│   │   └── Profile.jsx
│   ├── utils/           # Helper functions
│   │   ├── api.js       # API calls
│   │   └── auth.js      # Auth helpers
│   ├── assets/          # Images, fonts, etc.
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static files
│   └── images/
│       └── logo.png
└── index.html           # HTML template
```

## 🎨 Tech Stack

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **React Router** - Routing
- **Axios** - HTTP client

## 🎨 Theme

Red & Black color scheme:
- Primary: Black (`#000000`)
- Accent: Red (`#DC2626`, `#EF4444`)
- Text: White on dark backgrounds

## 🛠️ Development

```bash
# Start dev server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📦 Key Dependencies

- `react` & `react-dom` - Core React
- `react-router-dom` - Client-side routing
- `axios` - HTTP requests
- `framer-motion` - Animations
- `tailwindcss` - Utility-first CSS

## 🎯 Features

- Responsive design (mobile-first)
- Dark theme with red accents
- Smooth animations
- Fast page loads with Vite
- Component-based architecture

## 📝 Component Guidelines

### Components vs Pages
- **Components**: Reusable UI pieces (Header, Button, Card)
- **Pages**: Full page views (Home, Browse, Profile)

### Naming Conventions
- PascalCase for components: `AnimeCard.jsx`
- camelCase for utilities: `apiClient.js`
- kebab-case for CSS classes

### Styling
- Use Tailwind utility classes
- Keep components self-contained
- Follow mobile-first approach
- Use consistent spacing scale

## 🔗 API Integration

API base URL: `http://localhost:5000/api`

Configure in `src/utils/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
```

## 🚀 Deployment

```bash
# Build for production
npm run build

# Deploy dist/ folder to:
# - Netlify
# - Vercel
# - GitHub Pages
```

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
