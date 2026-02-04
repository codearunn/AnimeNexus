import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const emptyStateConfig = {
  watching: {
    emoji: "👀",
    title: "Nothing on your watchlist yet!",
    message: "Start your anime journey today",
    description: "Discover amazing anime and begin tracking your progress",
    buttonText: "Browse Anime",
    gradient: "from-purple-500/20 to-pink-500/20",
    accentColor: "from-purple-500 to-pink-500"
  },
  completed: {
    emoji: "🎉",
    title: "No completed anime yet!",
    message: "Keep watching to fill this space",
    description: "Every great journey starts with a single episode",
    buttonText: "Find Something to Watch",
    gradient: "from-green-500/20 to-emerald-500/20",
    accentColor: "from-green-500 to-emerald-500"
  },
  "plan-to-watch": {
    emoji: "📝",
    title: "Your watchlist is empty!",
    message: "Add anime you want to watch later",
    description: "Build your perfect anime queue",
    buttonText: "Discover Anime",
    gradient: "from-blue-500/20 to-cyan-500/20",
    accentColor: "from-blue-500 to-cyan-500"
  },
  "on-hold": {
    emoji: "⏸️",
    title: "Nothing on hold!",
    message: "Taking a break?",
    description: "It's okay to pause and come back later",
    buttonText: "Browse Collection",
    gradient: "from-yellow-500/20 to-orange-500/20",
    accentColor: "from-yellow-500 to-orange-500"
  },
  dropped: {
    emoji: "💔",
    title: "No dropped anime!",
    message: "Every anime deserves a chance",
    description: "Explore something new",
    buttonText: "Explore Anime",
    gradient: "from-red-500/20 to-pink-500/20",
    accentColor: "from-red-500 to-pink-500"
  }
};

export default function EmptyState({ status }) {
  const navigate = useNavigate();
  const config = emptyStateConfig[status] || emptyStateConfig.watching;

  // ✅ Generate particles ONCE
  const particles = useMemo(() => {
    return Array.from({ length: 6 }).map((_, i) => ({
      left: `${20 + i * 15}%`,
      top: `${30 + Math.random() * 40}%`,
      drift: Math.random() * 20 - 10,
      duration: 3 + Math.random() * 2
    }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center min-h-[500px] px-4 relative"
    >
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br ${config.gradient} rounded-full blur-3xl opacity-30`} />
        <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br ${config.gradient} rounded-full blur-3xl opacity-20`} />
      </div>

      <div className="relative z-10 max-w-xl text-center">

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring" }}
          className="text-8xl mb-6"
        >
          {config.emoji}
        </motion.div>

        <h2 className={`text-4xl font-black mb-3 bg-gradient-to-r ${config.accentColor} text-transparent bg-clip-text`}>
          {config.title}
        </h2>

        <p className="text-xl text-gray-300 mb-2">{config.message}</p>
        <p className="text-gray-500 mb-8">{config.description}</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/browse")}
          className={`px-8 py-4 rounded-xl bg-gradient-to-r ${config.accentColor} text-white font-bold shadow-xl`}
        >
          {config.buttonText} →
        </motion.button>
      </div>

      {/* Floating particles */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          animate={{
            opacity: [0.2, 0.6, 0.2],
            y: [0, -30, 0],
            x: [0, p.drift, 0]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: i * 0.5
          }}
          className={`absolute w-1 h-1 rounded-full bg-gradient-to-r ${config.accentColor}`}
          style={{ left: p.left, top: p.top }}
        />
      ))}
    </motion.div>
  );
}