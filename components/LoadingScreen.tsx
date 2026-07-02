"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import WaveBackground from "./WaveBackground";

const SEQUENCE = [
  "Initializing…",
  "Loading Systems…",
  "Compiling Workflows…",
  "Rendering Architecture…",
  "Ready.",
];

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let stepIndex = 0;
    const totalSteps = SEQUENCE.length;
    const stepDuration = 380; // ms per step

    const interval = setInterval(() => {
      stepIndex++;
      setStep(stepIndex);
      setProgress((stepIndex / totalSteps) * 100);

      if (stepIndex >= totalSteps) {
        clearInterval(interval);
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 700);
        }, 400);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!exiting && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <WaveBackground />
          
          {/* Changing Icon */}
          <motion.div
            className="mb-10"
            style={{ 
              position: "relative", 
              zIndex: 1,
              fontSize: 32,
              color: "var(--black)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: 32,
              height: 32
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={step}
                initial={{ opacity: 0, scale: 0.5, rotate: -90 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                transition={{ duration: 0.3 }}
                style={{ position: "absolute" }}
              >
                {["⬡", "◈", "◉", "◎", "●"][Math.min(step, 4)]}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          {/* Status text */}
          <div className="relative h-5 mb-6" style={{ minWidth: 220, position: "relative", zIndex: 1 }}>
            <AnimatePresence mode="popLayout">
              <motion.p
                key={step}
                className="absolute inset-0 flex justify-center items-center"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--gray-500)",
                  letterSpacing: "0.02em",
                  fontFamily: "var(--font-mono)",
                }}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              >
                {SEQUENCE[Math.min(step, SEQUENCE.length - 1)]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Progress bar */}
          <div className="loading-bar" style={{ position: "relative", zIndex: 1 }}>
            <motion.div
              className="loading-bar-fill"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: progress / 100 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function BatLogo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.65}
      viewBox="0 0 64 42"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Aman Mishra logo"
    >
      <path
        d="M32 6C32 6 24 2 14 4C8 5.5 2 10 0 16C4 14 8 14 10 16C6 18 4 22 6 26C10 22 14 20 18 22C16 26 16 30 20 32C22 28 26 26 32 26C38 26 42 28 44 32C48 30 48 26 46 22C50 20 54 22 58 26C60 22 58 18 54 16C56 14 60 14 64 16C62 10 56 5.5 50 4C40 2 32 6 32 6Z"
        fill="currentColor"
        style={{ color: "var(--black)" }}
      />
    </svg>
  );
}

export { BatLogo };
