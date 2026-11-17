import React, { useState, useEffect } from "react";
import { SITE_CONFIG } from "../../config/site";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

export default function AnnouncementBar() {
  const { messages, enabled } = SITE_CONFIG.announcement;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!messages || messages.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [messages]);

  if (!enabled || !messages.length) return null;

  return (
    <div className="bg-[#521225] text-[#FFF8F3] py-2 px-4 text-xs sm:text-sm font-medium tracking-wider relative overflow-hidden border-b border-[#C5A059]/30">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span>{messages[index]}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
