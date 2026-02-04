import { motion } from "framer-motion";

const cards = [
  {
    label: "Anime Watched",
    key: "totalAnime",
    icon: "https://api.iconify.design/lucide:film.svg",
    gradient: "from-purple-500/20 via-pink-500/20 to-red-500/20",
    glowColor: "shadow-purple-500/50",
    accentColor: "text-purple-400"
  },
  {
    label: "Episodes",
    key: "totalEpisodeWatched",
    icon: "https://api.iconify.design/lucide:tv.svg",
    gradient: "from-blue-500/20 via-cyan-500/20 to-teal-500/20",
    glowColor: "shadow-cyan-500/50",
    accentColor: "text-cyan-400"
  },
  {
    label: "Avg Rating",
    key: "avgRating",
    icon: "https://api.iconify.design/lucide:star.svg",
    gradient: "from-yellow-500/20 via-orange-500/20 to-red-500/20",
    glowColor: "shadow-yellow-500/50",
    accentColor: "text-yellow-400"
  },
  {
    label: "Completion",
    key: "completionRate",
    icon: "https://api.iconify.design/lucide:check-circle.svg",
    gradient: "from-green-500/20 via-emerald-500/20 to-teal-500/20",
    glowColor: "shadow-green-500/50",
    accentColor: "text-green-400"
  },
  {
    label: "Top Genre",
    key: "mostWatchedGenre",
    icon: "https://api.iconify.design/lucide:flame.svg",
    gradient: "from-red-500/20 via-orange-500/20 to-pink-500/20",
    glowColor: "shadow-red-500/50",
    accentColor: "text-red-400"
  }
];

export default function StatsDashboard({ stats }) {
  return (
    <div className="mb-12 relative">
      {/* Animated Background Blur */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/20 rounded-full blur-[120px] animate-pulse" />

      {/* Header with Glassmorphism */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="h-1 w-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full" />
          <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 font-black text-2xl tracking-tight">
            Your Anime Era
          </h2>
          <div className="h-1 flex-1 bg-gradient-to-r from-pink-500/50 to-transparent rounded-full" />
        </div>
        <p className="text-gray-500 text-sm ml-16">
          ✨ Track your journey through the anime universe
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              delay: i * 0.1,
              type: "spring",
              stiffness: 100,
              damping: 15
            }}
            whileHover={{
              scale: 1.05,
              y: -8,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
            className="group relative"
          >
            {/* Card Container */}
            <div
              className={`
                relative overflow-hidden rounded-2xl p-6
                bg-gradient-to-br ${card.gradient}
                backdrop-blur-xl
                border border-white/10
                shadow-2xl shadow-black/50
                hover:${card.glowColor}
                hover:border-white/20
                transition-all duration-300
                cursor-pointer
              `}
            >
              {/* Animated Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              {/* Icon with Glow */}
              <div className="relative mb-4">
                <div className={`absolute inset-0 blur-xl ${card.accentColor} opacity-0 group-hover:opacity-50 transition-opacity`} />
                <img
                  src={card.icon}
                  className={`w-10 h-10 relative z-10 brightness-0 invert ${card.accentColor} group-hover:scale-110 transition-transform duration-300`}
                  alt={card.label}
                />
              </div>

              {/* Label */}
              <p className="text-gray-400 text-[10px] uppercase tracking-[0.15em] font-semibold mb-2 group-hover:text-gray-300 transition-colors">
                {card.label}
              </p>

              {/* Value */}
              <div className="flex items-baseline gap-1">
                <p className={`text-white text-4xl font-black tracking-tight ${card.accentColor} group-hover:scale-105 transition-transform origin-left`}>
                  {card.key === "completionRate"
                    ? `${stats[card.key] || 0}`
                    : stats[card.key] || "0"}
                </p>
                {card.key === "completionRate" && (
                  <span className="text-gray-500 text-xl font-bold">%</span>
                )}
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Bottom Accent Line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity`} />
            </div>

            {/* Floating Particles Effect (Optional) */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-white/30 rounded-full animate-ping" style={{ animationDelay: `${i * 0.2}s` }} />
              <div className="absolute bottom-1/3 right-1/3 w-1 h-1 bg-white/20 rounded-full animate-ping" style={{ animationDelay: `${i * 0.3}s` }} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Bottom Decorative Line */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="mt-8 h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"
      />
    </div>
  );
}
