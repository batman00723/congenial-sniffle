"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import ContextMenu from "@/components/ContextMenu";

// Dynamic imports for client-only components
import LoadingScreen from "@/components/LoadingScreen";
import FloatingDock from "@/components/FloatingDock";
import PortraitHero from "@/components/PortraitHero";
import SystemsSection from "@/components/SystemsSection";
import PrinciplesSection from "@/components/PrinciplesSection";
import BuildLogSection from "@/components/BuildLogSection";
import TimelineSection from "@/components/TimelineSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import FinalChapter from "@/components/FinalChapter";
import BatmanEasterEgg from "@/components/BatmanEasterEgg";
import GridBackground from "@/components/GridBackground";
import ParticlesBackground from "@/components/ParticlesBackground";
import ViewCounter from "@/components/ViewCounter";
import Chatbot from "@/components/Chatbot";

// Dynamic import for cursor (no SSR)
const CustomCursor = dynamic(() => import("@/components/CustomCursor"), {
  ssr: false,
});

// Content imports
import projects from "@/content/projects.json";
import principles from "@/content/principles.json";
import buildlog from "@/content/buildlog.json";
import timeline from "@/content/timeline.json";
import about from "@/content/about.json";
import socials from "@/content/socials.json";

const BATMAN_SEQUENCE = ["b", "a", "t", "m", "a", "n"];

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [dockVisible, setDockVisible] = useState(false);
  const [isBatman, setIsBatman] = useState(false);
  const [batmanKeySequence, setBatmanKeySequence] = useState<string[]>([]);
  const [activeSection, setActiveSection] = useState("hero");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const soundEnabledRef = useRef(true);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

  const toggleBatman = useCallback(() => {
    setIsBatman((b) => {
      const nextBatman = !b;
      if (nextBatman) {
        document.documentElement.setAttribute("data-batman", "true");
      } else {
        document.documentElement.removeAttribute("data-batman");
      }
      return nextBatman;
    });
  }, []);

  // Batman keyboard sequence detector
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();

      // Batman sequence detection
      setBatmanKeySequence((prev) => {
        const next = [...prev, key].slice(-BATMAN_SEQUENCE.length);
        if (JSON.stringify(next) === JSON.stringify(BATMAN_SEQUENCE)) {
          toggleBatman();
          return [];
        }
        return next;
      });
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const handleLoadComplete = useCallback(() => {
    setLoading(false);
    document.body.classList.remove("loading");
  }, []);

  const handleScrollStart = useCallback(() => {
    setDockVisible(true);
  }, []);

  useEffect(() => {
    if (loading) {
      document.body.classList.add("loading");
    }
  }, [loading]);

  // Background Music loop tied to Sound Toggle and page visibility
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio("/bg-music.mp3");
      audioRef.current.loop = true;
      audioRef.current.volume = 0.05; // 5% volume - very subtle background ambient
    }

    const handlePlayState = () => {
      if (soundEnabled && !document.hidden) {
        audioRef.current?.play().catch((err) => {
          console.warn("Audio autoplay blocked by browser until user click:", err);
        });
      } else {
        audioRef.current?.pause();
      }
    };

    // Initial check
    handlePlayState();

    // Re-check when user switches tabs or minimizes
    const handleVisibilityChange = () => {
      handlePlayState();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [soundEnabled]);

  // Active section tracking via IntersectionObserver
  useEffect(() => {
    if (loading) return;

    const sections = [
      "hero",
      "systems",
      "principles",
      "buildlog",
      "timeline",
      "about",
      "contact",
      "final",
    ];

    const observers: IntersectionObserver[] = [];

    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { threshold: 0.3 }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, [loading]);

  return (
    <>
      {/* Loading Screen */}
      {loading && <LoadingScreen onComplete={handleLoadComplete} />}

      {/* Custom Cursor */}
      {!loading && <CustomCursor isBatman={isBatman} />}

      {/* Batman Easter Egg */}
      <BatmanEasterEgg isActive={isBatman} soundEnabled={soundEnabled} />

      {/* 3D Network Background */}
      {!loading && <GridBackground isBatman={isBatman} />}
      {!loading && <ParticlesBackground />}

      {/* Custom Context Menu */}
      <ContextMenu onBatmanToggle={toggleBatman} isBatman={isBatman} />

      {/* Main content */}
      {!loading && (
        <motion.main 
          id="main-content" 
          style={{ position: "relative", zIndex: 1 }}
        >
          {/* Portrait Hero */}
          <PortraitHero onScrollStart={handleScrollStart} onOpenChat={() => setIsChatOpen(true)} />
          
          {/* Systems */}
          <SystemsSection systems={projects as any} />

          {/* Engineering Principles */}
          <PrinciplesSection principles={principles} />

          {/* Build Log */}
          <BuildLogSection entries={buildlog} />

          {/* Timeline */}
          <TimelineSection items={timeline} />

          {/* About */}
          <AboutSection about={about} />

          {/* Contact */}
          <ContactSection socials={socials} />

          {/* Final Chapter */}
          <FinalChapter />
        </motion.main>
      )}

      {/* Floating Dock — hidden in final/quote section */}
      {!loading && activeSection !== "final" && (
        <FloatingDock
          visible={dockVisible}
          isBatman={isBatman}
          activeSection={activeSection}
          soundEnabled={soundEnabled}
          onSoundToggle={() => setSoundEnabled((s) => !s)}
          onBatmanToggle={toggleBatman}
          onOpenChat={() => setIsChatOpen(true)}
        />
      )}

      {/* Chatbot — single instance at root level so position:fixed works correctly */}
      {!loading && <Chatbot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />}

      {/* Floating View Counter */}
      {!loading && <ViewCounter />}
    </>
  );
}
