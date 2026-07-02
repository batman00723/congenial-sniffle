"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { playTick, playWhoosh } from "@/lib/sounds";

interface ContextMenuProps {
  onBatmanToggle: () => void;
  isBatman: boolean;
}

export default function ContextMenu({ onBatmanToggle, isBatman }: ContextMenuProps) {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      
      // Keep menu within screen bounds
      let x = e.clientX;
      let y = e.clientY;
      const menuWidth = 220;
      const menuHeight = 160;
      
      if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 10;
      if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 10;
      
      setPosition({ x, y });
      setVisible(true);
      playTick();
    };

    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setVisible(false);
    };

    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("click", handleClick);
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleAction = (action: () => void) => {
    playTick();
    action();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={menuRef}
          initial={{ opacity: 0, scale: 0.95, y: -5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -5 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{
            position: "fixed",
            top: position.y,
            left: position.x,
            width: 220,
            background: "rgba(255, 255, 255, 0.7)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid var(--gray-200)",
            borderRadius: "var(--radius-lg)",
            boxShadow: "var(--shadow-xl), var(--shadow-purple)",
            padding: "6px",
            zIndex: 100000,
            display: "flex",
            flexDirection: "column",
            gap: "4px",
          }}
          className="context-menu-container"
        >
          <ContextMenuItem 
            label="Copy Page URL" 
            icon="🔗"
            onClick={() => handleAction(() => navigator.clipboard.writeText(window.location.href))} 
          />
          
          <div style={{ height: 1, background: "var(--gray-200)", margin: "2px 4px" }} />
          
          <ContextMenuItem 
            label={isBatman ? "Disable Batman Mode" : "Enable Batman Mode"} 
            icon="🦇"
            onClick={() => handleAction(() => {
              playWhoosh();
              onBatmanToggle();
            })} 
          />
          
          <div style={{ height: 1, background: "var(--gray-200)", margin: "2px 4px" }} />
          
          <ContextMenuItem 
            label="Back to Top" 
            icon="↑"
            onClick={() => handleAction(() => window.scrollTo({ top: 0, behavior: "smooth" }))} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ContextMenuItem({ label, icon, onClick }: { label: string, icon: string, onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => {
        setHovered(true);
        playTick();
      }}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "8px 12px",
        borderRadius: "var(--radius-md)",
        background: hovered ? "var(--gray-100)" : "transparent",
        color: hovered ? "var(--black)" : "var(--gray-600)",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "13px",
        fontWeight: 500,
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
    >
      <span style={{ fontSize: "14px", filter: hovered ? "none" : "grayscale(100%) opacity(0.6)" }}>{icon}</span>
      {label}
    </div>
  );
}
