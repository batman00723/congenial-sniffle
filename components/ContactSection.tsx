"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Magnetic from "./Magnetic";

interface Socials {
  github: string;
  linkedin: string;
  x: string;
  instagram: string;
  email: string;
}

interface ContactSectionProps {
  socials: Socials;
}

const SOCIAL_ITEMS = [
  {
    key: "github",
    label: "GitHub",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    key: "x",
    label: "X (Twitter)",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.26 5.632L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  {
    key: "email",
    label: "Email",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M22 7l-10 7L2 7" />
      </svg>
    ),
  },
];

export default function ContactSection({ socials }: ContactSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const getHref = (key: string) => {
    if (key === "email") return `mailto:${socials.email}`;
    return socials[key as keyof Socials] as string;
  };

  return (
    <section
      id="contact"
      className="section"
      aria-labelledby="contact-heading"
      style={{ borderTop: "1px solid var(--gray-100)" }}
    >
      <div className="container">
        <motion.div
          ref={ref}
          className="content-card"
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: "center", maxWidth: 900, margin: "0 auto", paddingLeft: "var(--space-12)", paddingRight: "var(--space-12)" }}
        >
          <div className="section-label" style={{ justifyContent: "center" }}>
            <span>Contact</span>
          </div>
          <h2
            id="contact-heading"
            className="display-md"
            style={{ color: "var(--black)", marginBottom: 16 }}
          >
            Let&apos;s build something.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--gray-500)",
              lineHeight: 1.6,
              marginBottom: 48,
            }}
          >
            Interested in production AI systems, agentic architectures, or
            engineering collaborations.
          </p>

          {/* Social links */}
          <div
            style={{
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {SOCIAL_ITEMS.map((item, i) => (
              <Magnetic key={item.key} intensity={0.4}>
                <motion.a
                  href={getHref(item.key)}
                  target={item.key !== "email" ? "_blank" : undefined}
                  rel={item.key !== "email" ? "noopener noreferrer" : undefined}
                  className="social-link"
                  aria-label={item.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                    delay: i * 0.07,
                  }}
                  style={{ display: "inline-flex", width: "100%", height: "100%" }}
                >
                  {item.icon}
                  {item.label}
                </motion.a>
              </Magnetic>
            ))}
          </div>

          {/* Email display */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.5 }}
            style={{
              marginTop: 40,
              padding: "20px 32px",
              border: "1px solid var(--gray-100)",
              borderRadius: "var(--radius-lg)",
              display: "inline-block",
            }}
          >
            <a
              href={`mailto:${socials.email}`}
              style={{
                fontSize: 18,
                fontWeight: 500,
                color: "var(--black)",
                textDecoration: "none",
                fontFamily: "var(--font-mono)",
                letterSpacing: "-0.01em",
                transition: "color 0.2s",
              }}
              className="email-link"
            >
              {socials.email}
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
