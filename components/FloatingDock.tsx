"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DOCK_ITEMS = [
  { id: "home", label: "Home", href: "#hero", icon: "⌂" },
  { id: "systems", label: "Systems", href: "#systems", icon: "⬡" },
  { id: "about", label: "About", href: "#about", icon: "◎" },
  { id: "contact", label: "Contact", href: "#contact", icon: "◌" },
  { id: "interview", label: "Interview", icon: "⌨" },
];

interface FloatingDockProps {
  visible?: boolean;
  isBatman?: boolean;
  activeSection?: string;
  soundEnabled?: boolean;
  onSoundToggle?: () => void;
  onBatmanToggle?: () => void;
  onOpenChat?: () => void;
}

export default function FloatingDock({
  visible = true,
  isBatman = false,
  activeSection = "hero",
  soundEnabled = false,
  onSoundToggle = () => {},
  onBatmanToggle = () => {},
  onOpenChat = () => {},
}: FloatingDockProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollY = currentScrollY;
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      // Show if mouse moves into the bottom 15% of the viewport
      if (e.clientY > window.innerHeight * 0.85) {
        setIsHidden(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const scrollTo = (href: string) => {
    if (!href) return;
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          className="dock"
          aria-label="Main navigation"
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ 
            opacity: isHidden ? 0 : 1, 
            y: isHidden ? 100 : 0, 
            scale: isHidden ? 0.9 : 1,
            pointerEvents: isHidden ? "none" : "auto"
          }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {DOCK_ITEMS.map((item, i) => {
            const isHovered = hoveredIndex === i;
            const neighborDistance = hoveredIndex !== null ? Math.abs(hoveredIndex - i) : 99;
            const scale =
              isHovered ? 1.18 : neighborDistance === 1 ? 1.08 : 1.0;

            return (
              <motion.button
                key={item.id}
                className={`dock-item ${activeSection === item.id ? "active" : ""}`}
                onClick={() => {
                  if (item.id === "interview") {
                    onOpenChat();
                  } else if (item.href) {
                    scrollTo(item.href);
                  }
                }}
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                animate={{ scale }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                aria-label={`Navigate to ${item.label}`}
                aria-current={activeSection === item.id ? "page" : undefined}
              >
                <span
                  style={{
                    fontSize: 18,
                    lineHeight: 1,
                    color:
                      activeSection === item.id
                        ? "var(--accent)"
                        : "var(--gray-500)",
                    transition: "color 0.2s",
                  }}
                >
                  {item.icon}
                </span>
                <span className="dock-item-label">{item.label}</span>

                {/* Tooltip on hover */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{
                        position: "absolute",
                        bottom: "calc(100% + 10px)",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "var(--black)",
                        color: "var(--white)",
                        fontSize: 11,
                        fontWeight: 500,
                        padding: "4px 8px",
                        borderRadius: "var(--radius-sm)",
                        whiteSpace: "nowrap",
                        pointerEvents: "none",
                        zIndex: 1001,
                      }}
                    >
                      {item.label}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
          
          <div style={{ width: 1, height: 16, background: "rgba(0, 0, 0, 0.06)", alignSelf: "center", margin: "0 6px" }} />

          <motion.button
            className={`dock-item sound-toggle`}
            onClick={onSoundToggle}
            onMouseEnter={() => setHoveredIndex(99)}
            onMouseLeave={() => setHoveredIndex(null)}
            animate={{ scale: hoveredIndex === 99 ? 1.18 : 1.0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
          >
            <span
              style={{
                fontSize: 17,
                lineHeight: 1,
                color: soundEnabled ? "var(--accent)" : "var(--gray-500)",
                transition: "color 0.2s",
              }}
            >
              {soundEnabled ? "🔊" : "🔇"}
            </span>
            <span className="dock-item-label">{soundEnabled ? "Mute" : "Unmute"}</span>

            <AnimatePresence>
              {hoveredIndex === 99 && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 10px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "rgba(255, 255, 255, 0.9)",
                    color: "var(--gray-600)",
                    border: "1px solid rgba(0, 0, 0, 0.05)",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "4px 8px",
                    borderRadius: "var(--radius-sm)",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    zIndex: 1001,
                  }}
                >
                  {soundEnabled ? "Mute Sound" : "Enable Sound"}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Batman Toggle Button */}
          <motion.button
            className={`dock-item batman-toggle`}
            onClick={onBatmanToggle}
            onMouseEnter={() => setHoveredIndex(100)}
            onMouseLeave={() => setHoveredIndex(null)}
            animate={{ scale: hoveredIndex === 100 ? 1.18 : 1.0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            aria-label={isBatman ? "Exit Batman Mode" : "Enter Batman Mode"}
          >
            <span
              style={{
                width: 18,
                height: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "filter 0.2s",
                filter: isBatman ? "drop-shadow(0 0 4px rgba(212,160,23,0.8))" : "grayscale(1) opacity(0.5)",
              }}
            >
              <img
                src="/batman-seeklogo.png"
                alt="Batman"
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </span>
            <span className="dock-item-label">{isBatman ? "Normal" : "Batman"}</span>

            <AnimatePresence>
              {hoveredIndex === 100 && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 10px)",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "var(--black)",
                    color: "var(--white)",
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "4px 8px",
                    borderRadius: "var(--radius-sm)",
                    whiteSpace: "nowrap",
                    pointerEvents: "none",
                    zIndex: 1001,
                  }}
                >
                  {isBatman ? "Exit Batman Mode" : "Enter Batman Mode"}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
