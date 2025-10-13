import { motion } from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  Star,
  Shield,
  Zap,
  Globe,
} from "lucide-react";

interface WelcomePageProps {
  onGetStarted: () => void;
}

const features = [
  {
    icon: BarChart3,
    title: "Real-Time Data",
    description:
      "Live cryptocurrency prices and market data updated every minute.",
  },
  {
    icon: Star,
    title: "Personal Watchlist",
    description: "Track your favorite coins and monitor their performance.",
  },
  {
    icon: TrendingUp,
    title: "Advanced Charts",
    description: "Interactive candlestick charts with historical data.",
  },
  {
    icon: Shield,
    title: "Market Insights",
    description: "Top gainers, losers, and global market statistics.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Optimized for seamless, high-performance experience.",
  },
  {
    icon: Globe,
    title: "Multi-Currency",
    description: "View prices in USD, EUR, and INR effortlessly.",
  },
];

export function WelcomePage({ onGetStarted }: WelcomePageProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* === Animated Background Blobs === */}
      <motion.div
        animate={{
          x: [0, 100, -100, 0],
          y: [0, 50, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-emerald-400/30 dark:bg-emerald-500/10 blur-3xl rounded-full"
      />
      <motion.div
        animate={{
          x: [0, -120, 120, 0],
          y: [0, 60, -60, 0],
          scale: [1.1, 0.9, 1.2],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 right-0 w-[450px] h-[450px] bg-cyan-400/30 dark:bg-cyan-600/10 blur-3xl rounded-full"
      />
      <motion.div
        animate={{
          rotate: [0, 360],
        }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute bottom-0 left-1/2 w-[600px] h-[600px] bg-gradient-to-r from-teal-300/20 to-emerald-400/10 blur-3xl rounded-full"
      />

      {/* === Content === */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 180, delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 mb-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-3xl shadow-2xl"
          >
            <TrendingUp className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.3 }}
  className="text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-emerald-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent drop-shadow-lg leading-[1.2] pb-1"
>
  CryptoDash
</motion.h1>


          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mb-10 max-w-3xl mx-auto"
          >
            The ultimate cryptocurrency analytics platform for real-time
            insights, charts, and market intelligence.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.5,
              type: "spring",
              stiffness: 250,
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 20px 50px rgba(16,185,129,0.4)",
            }}
            whileTap={{ scale: 0.95 }}
            onClick={onGetStarted}
            className="px-10 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-lg font-semibold rounded-xl shadow-lg transition-all"
          >
            Get Started
          </motion.button>
        </motion.div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-20"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              whileHover={{
                y: -10,
                scale: 1.02,
                boxShadow: "0 12px 25px rgba(0,0,0,0.1)",
              }}
              className="relative group bg-white/80 dark:bg-slate-800/70 rounded-2xl p-8 border border-slate-200/60 dark:border-slate-700/60 shadow-lg backdrop-blur-md overflow-hidden"
            >
              {/* Glow Layer */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-emerald-100/40 to-teal-100/30 dark:from-emerald-500/10 dark:to-teal-400/10 transition-opacity duration-500 rounded-2xl"></div>

              <div className="relative z-10">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center mb-5 shadow-md">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-100">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-24 text-center"
        >
          <p className="text-slate-500 dark:text-slate-400 text-sm tracking-wide">
            Powered by{" "}
            <a
              href="https://www.coingecko.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              CoinGecko API
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
