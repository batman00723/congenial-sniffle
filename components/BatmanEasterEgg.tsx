"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface BatmanEasterEggProps {
  isActive: boolean;
  soundEnabled?: boolean;
}

export default function BatmanEasterEgg({ isActive, soundEnabled = false }: BatmanEasterEggProps) {
  useEffect(() => {
    if (isActive) {
      document.documentElement.setAttribute("data-batman", "true");
      if (soundEnabled && typeof window !== "undefined") {
        const audio = new Audio("/batman-audio.mp3");
        audio.play().catch((err) => console.log("Batman audio play failed:", err));
      }
    } else {
      document.documentElement.removeAttribute("data-batman");
    }
  }, [isActive, soundEnabled]);

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Bat silhouette that flies across screen */}
          <motion.div
            key="bat-fly"
            initial={{ opacity: 0, x: -150, y: "40vh" }}
            animate={{ opacity: [0, 0.5, 0.5, 0], x: "110vw", y: "30vh" }}
            transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1], times: [0, 0.1, 0.9, 1] }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 9990,
              pointerEvents: "none",
            }}
            aria-hidden="true"
          >
            <BatSilhouette />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function BatSilhouette() {
  return (
    <img
      src="/batman-removebg-preview.png"
      alt="Batman"
      width="120"
      style={{ objectFit: "contain" }}
    />
  );
}
