import { TrendingUp, Heart, Github, Linkedin, Mail } from "lucide-react";
import { motion } from "framer-motion";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socials = [
    {
      name: "GitHub",
      icon: Github,
      href: "https://github.com/vinayakdevm", // your GitHub
      color: "hover:text-slate-900 dark:hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: Linkedin,
      href: "https://www.linkedin.com/in/vinayakdevm", // your LinkedIn
      color: "hover:text-blue-600 dark:hover:text-blue-400",
    },
    {
      name: "Email",
      icon: Mail,
      href: "mailto:vinayakdevmishra12@gmail.com", // your email
      color: "hover:text-emerald-500",
    },
  ];

  return (
    <footer className="relative mt-16 border-t border-slate-200 dark:border-slate-700 bg-gradient-to-b from-white/80 to-slate-50/70 dark:from-slate-900/70 dark:to-slate-950/90 backdrop-blur-xl shadow-inner">
      {/* Subtle top glow line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 opacity-80"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          {/* === Brand & About === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <div className="relative">
                <TrendingUp className="w-6 h-6 text-emerald-500 drop-shadow-md" />
                <div className="absolute inset-0 blur-md bg-emerald-400/40 rounded-full"></div>
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                CryptoDash
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Real-time cryptocurrency insights, analytics, and portfolio tools.
              Track trends and stay ahead in the world of digital assets.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              {socials.map(({ name, icon: Icon, href, color }) => (
                <motion.a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`transition-colors ${color}`}
                >
                  <Icon className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* === Quick Links === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
              Explore
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li className="hover:text-emerald-500 transition-colors cursor-pointer">
                Live Markets
              </li>
              <li className="hover:text-emerald-500 transition-colors cursor-pointer">
                Top Gainers
              </li>
              <li className="hover:text-emerald-500 transition-colors cursor-pointer">
                Watchlist
              </li>
              <li className="hover:text-emerald-500 transition-colors cursor-pointer">
                Portfolio Analytics
              </li>
            </ul>
          </motion.div>

          {/* === Resources === */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
              Resources
            </h3>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <span className="text-slate-500 dark:text-slate-400">
                  Market Data by{" "}
                </span>
                <a
                  href="https://www.coingecko.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-500 transition-colors font-medium"
                >
                  CoinGecko
                </a>
              </li>
              <li>24/7 Price Tracking</li>
              <li>Multi-Currency Support</li>
              <li>Responsive & PWA Ready</li>
            </ul>
          </motion.div>
        </div>

        {/* === Bottom Section === */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="pt-6 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-sm text-slate-600 dark:text-slate-400">
            © {currentYear}{" "}
            <span className="font-medium text-slate-800 dark:text-slate-200">
              CryptoDash
            </span>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400">
            <span>Crafted with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
            <span>by</span>
            <a
              href="https://github.com/vinayakdevm"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-600 dark:text-emerald-400 hover:underline ml-1"
            >
              Vinayak Dev Mishra
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
