"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface Principle {
  number: string;
  title: string;
  description: string;
}

interface PrinciplesSectionProps {
  principles: Principle[];
}

export default function PrinciplesSection({ principles }: PrinciplesSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="principles"
      className="section"
      aria-labelledby="principles-heading"
      style={{ borderTop: "1px solid var(--gray-100)" }}
    >
      <div className="container">
        <motion.div
          ref={ref}
          className="content-card"
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Section header */}
          <div className="section-label">Engineering Principles</div>
          <h2
            id="principles-heading"
            className="display-md"
            style={{ color: "var(--black)", marginBottom: 16, maxWidth: 500 }}
          >
            How I think about systems.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--gray-500)",
              maxWidth: 480,
              lineHeight: 1.6,
              marginBottom: 64,
            }}
          >
            Principles distilled from building and debugging production AI
            systems.
          </p>

          {/* Principles list */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "0 80px",
            }}
          >
            {principles.map((p, i) => (
              <motion.div
                key={p.number}
                className="principle-item"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.08,
                }}
              >
                <div className="principle-number">{p.number}</div>
                <div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--black)",
                      lineHeight: 1.3,
                      marginBottom: 8,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {p.title}
                  </h3>
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--gray-500)",
                      lineHeight: 1.65,
                    }}
                  >
                    {p.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
