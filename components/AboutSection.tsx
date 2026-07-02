"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface AboutData {
  name: string;
  title: string;
  mission: string;
  philosophy: string[];
  approach: { label: string; text: string }[];
}

interface AboutSectionProps {
  about: AboutData;
}

export default function AboutSection({ about }: AboutSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="about"
      className="section"
      aria-labelledby="about-heading"
      style={{ borderTop: "1px solid var(--gray-100)" }}
    >
      <div className="container">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="content-card">
            <div className="section-label">About</div>
            <h2
              id="about-heading"
              className="display-md"
              style={{ color: "var(--black)", marginBottom: 48, maxWidth: 500 }}
            >
              {about.mission}
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 80,
                marginBottom: 64,
              }}
            >
              <div>
                {about.philosophy.map((para, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: 16,
                      color: i === 0 ? "var(--gray-700)" : "var(--gray-500)",
                      lineHeight: 1.7,
                      marginBottom: 20,
                      fontWeight: i === 2 ? 500 : 400,
                      fontStyle: i === 2 ? "italic" : "normal",
                    }}
                  >
                    {para}
                  </p>
                ))}
              </div>

              <div
                style={{
                  borderLeft: "1px solid var(--gray-200)",
                  paddingLeft: 48,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 32,
                  }}
                >
                  {about.approach.map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: 20 }}
                      animate={inView ? { opacity: 1, x: 0 } : {}}
                      transition={{
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                        delay: i * 0.1 + 0.2,
                      }}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: 600,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--accent)",
                          marginBottom: 8,
                        }}
                      >
                        {item.label}
                      </div>
                      <p
                        style={{
                          fontSize: 15,
                          color: "var(--gray-700)",
                          lineHeight: 1.6,
                        }}
                      >
                        {item.text}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
