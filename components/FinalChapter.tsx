"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

export default function FinalChapter() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section
      id="final"
      className="final-chapter"
      aria-label="Closing statement"
    >
      {/* Cave texture */}
      <div className="cave-texture" aria-hidden="true" />

      {/* Subtle ambient particles */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(139,124,255,0.04) 0%, transparent 60%)`,
          pointerEvents: "none",
        }}
      />

      <div ref={ref} className="final-chapter-content">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Quote */}
          <motion.blockquote
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.3, duration: 1.0 }}
            style={{
              maxWidth: 640,
              margin: "0 auto",
            }}
          >
            <p
              style={{
                fontSize: "clamp(22px, 3.5vw, 36px)",
                fontWeight: 400,
                lineHeight: 1.4,
                color: "rgba(255,255,255,0.9)",
                letterSpacing: "-0.02em",
                marginBottom: 24,
                fontStyle: "italic",
              }}
            >
              &ldquo;The cave you fear to enter holds the treasure you
              seek.&rdquo;
            </p>
            <footer
              style={{
                fontSize: 14,
                color: "rgba(255,255,255,0.35)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontWeight: 500,
              }}
            >
              — Joseph Campbell
            </footer>
          </motion.blockquote>

          {/* Divider */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={inView ? { scaleX: 1, opacity: 1 } : {}}
            transition={{ delay: 0.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: 1,
              height: 60,
              background:
                "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent)",
              margin: "48px auto 0",
            }}
          />

          {/* Name */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.6 }}
            style={{
              marginTop: 32,
              fontSize: 13,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 500,
              fontFamily: "var(--font-mono)",
            }}
          >
            Aman Mishra — AI Systems Engineer
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
