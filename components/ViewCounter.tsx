"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ViewCounter() {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    // Only fetch once per session to avoid spamming the API on hot reloads
    const fetchViews = async () => {
      try {
        // counterapi.dev provides a free, no-auth hit counter
        const response = await fetch(
          "https://api.counterapi.dev/v1/batman00723/portfolio/up"
        );
        const data = await response.json();
        if (data && typeof data.count === "number") {
          setViews(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch view count:", error);
      }
    };

    fetchViews();
  }, []);

  if (views === null) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1, duration: 0.8 }}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        background: "rgba(255, 255, 255, 0.05)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "var(--radius-full)",
        color: "var(--gray-500)",
        fontSize: 12,
        fontFamily: "var(--font-mono)",
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: "#10b981", // Emerald green for "live" indicator
          boxShadow: "0 0 8px #10b981",
        }}
      />
      <span>{views.toLocaleString()} Views</span>
    </motion.div>
  );
}
