"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

interface PortraitHeroProps {
  onScrollStart: () => void;
  onOpenChat: () => void;
  isBatman?: boolean;
}

export default function PortraitHero({ onScrollStart, onOpenChat, isBatman = false }: PortraitHeroProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [breathing, setBreathing] = useState(true);
  const onScrollStartRef = useRef(onScrollStart);
  useEffect(() => { onScrollStartRef.current = onScrollStart; }, [onScrollStart]);

  const { scrollY } = useScroll();

  const portraitWidth = useTransform(scrollY, [0, 500], ["70vh", "320px"]);
  const portraitHeight = useTransform(scrollY, [0, 500], ["90vh", "380px"]);
  const portraitX = useTransform(scrollY, [0, 500], ["0%", "40%"]);
  const portraitBorderRadius = useTransform(scrollY, [0, 500], ["0px", "20px"]);
  const portraitShadow = useTransform(
    scrollY,
    [0, 500],
    ["0px 0px 0px rgba(0,0,0,0)", "0px 24px 64px rgba(0,0,0,0.15)"]
  );

  const heroOpacity = useTransform(scrollY, [200, 500], [0, 1]);
  const heroY = useTransform(scrollY, [200, 500], [40, 0]);
  const smoothHeroY = useSpring(heroY, { stiffness: 200, damping: 30 });

  useEffect(() => {
    const unsub = scrollY.on("change", (y) => {
      if (y > 20) {
        setBreathing(false);
        if (!hasScrolled) {
          setHasScrolled(true);
          onScrollStartRef.current();
        }
      } else {
        setBreathing(true);
      }
    });
    return () => unsub();
  }, [scrollY, hasScrolled]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      style={{ position: "relative", height: "200vh" }}
      aria-label="Introduction"
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "transparent",
        }}
      >
        {/* Portrait */}
        <motion.div
          style={{
            width: portraitWidth,
            height: portraitHeight,
            x: portraitX,
            borderRadius: portraitBorderRadius,
            boxShadow: portraitShadow,
            position: "absolute",
            overflow: "hidden",
            pointerEvents: "none",
            willChange: "transform, width, height, border-radius",
          }}
          className={breathing ? "breathing" : ""}
        >
          <Image
            src="/portrait.png"
            alt="Aman Mishra — AI Systems Engineer"
            fill
            priority
            className="portrait-img"
            style={{ objectFit: "cover", objectPosition: "center top" }}
            sizes="(max-width: 768px) 90vw, 70vh"
          />
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to left, rgba(255,255,255,0) 60%, rgba(255,255,255,0.18) 100%)",
              pointerEvents: "none",
            }}
          />
        </motion.div>

        {/* Gradient shield */}
        <motion.div
          aria-hidden="true"
          className="hero-gradient-shield"
          style={{ opacity: heroOpacity }}
        />

        {/* Hero text */}
        <motion.div
          className="hero-text-content"
          style={{
            opacity: heroOpacity,
            y: smoothHeroY,
            pointerEvents: "auto",
          }}
        >
          <HeroContent onOpenChat={onOpenChat} />
        </motion.div>
      </div>
    </section>
  );
}

function HeroContent({ onOpenChat }: { onOpenChat: () => void }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div className="section-label">
        <span>AI Systems Engineer</span>
      </div>

      <h1 className="display-xl" style={{ color: "var(--black)" }}>
        Engineering Autonomous Intelligence for the Real World.
      </h1>

      <p style={{ fontSize: 17, lineHeight: 1.65, color: "var(--gray-500)", maxWidth: 460 }}>
        Building production AI systems using agentic workflows,
        retrieval-augmented generation, orchestration, persistent memory, and
        production infrastructure.
      </p>

      <motion.div
        style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15, delayChildren: 0.6 },
          },
        }}
      >
        <motion.a
          variants={{
            hidden: { opacity: 0, scale: 0.8, y: 10 },
            visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
          }}
          className="btn-primary"
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 7h12M7.5 1.5L13 7l-5.5 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </motion.a>

        <motion.button
          variants={{
            hidden: { opacity: 0, scale: 0.8, y: 10 },
            visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
          }}
          className="btn-secondary"
          onClick={onOpenChat}
        >
          Interview Me
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </motion.button>

        <motion.a
          variants={{
            hidden: { opacity: 0, scale: 0.8, y: 10 },
            visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } },
          }}
          className="btn-secondary"
          href="#contact"
        >
          Contact
        </motion.a>
      </motion.div>
    </div>
  );
}
