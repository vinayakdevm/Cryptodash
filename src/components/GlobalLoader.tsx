import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";

interface GlobalLoaderProps {
  loading: boolean;
}

export function GlobalLoader({ loading }: GlobalLoaderProps) {
  const [shouldShow, setShouldShow] = useState(false);

  // Prevents flicker on fast API responses
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loading) {
      timer = setTimeout(() => setShouldShow(true), 250);
    } else {
      setShouldShow(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          key="global-loader"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Subtle radial glow for brand identity */}
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-emerald-500/10 to-transparent pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 250, damping: 20 }}
            className="relative flex flex-col items-center"
          >
            <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-3 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <p className="text-slate-700 dark:text-slate-300 text-sm font-medium tracking-wide">
              Updating live market data...
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
