"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface TimelineItem {
  date: string;
  title: string;
  description: string;
  type: string;
}

interface TimelineSectionProps {
  items: TimelineItem[];
}

export default function TimelineSection({ items }: TimelineSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="timeline"
      className="section"
      aria-labelledby="timeline-heading"
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
          <div className="section-label">Timeline</div>
          <h2
            id="timeline-heading"
            className="display-md"
            style={{ color: "var(--black)", marginBottom: 16, maxWidth: 500 }}
          >
            How it unfolded.
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
            From first principles to production systems in four months.
          </p>

          <div style={{ maxWidth: 600 }}>
            <div className="timeline-container">
              <div className="timeline-line" />

              {items.map((item, i) => (
                <motion.div
                  key={`${item.date}-${item.title}`}
                  className="timeline-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{
                    duration: 0.5,
                    ease: [0.16, 1, 0.3, 1],
                    delay: i * 0.1,
                  }}
                >
                  <div
                    className={`timeline-dot ${item.type}`}
                    aria-hidden="true"
                  />

                  <div className="timeline-date">{item.date}</div>

                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--black)",
                      marginBottom: 6,
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                    {item.type === "current" && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          marginLeft: 10,
                          fontSize: 11,
                          fontWeight: 500,
                          color: "var(--accent)",
                          background: "var(--accent-muted)",
                          border: "1px solid var(--accent-border)",
                          padding: "2px 8px",
                          borderRadius: "var(--radius-full)",
                          verticalAlign: "middle",
                        }}
                      >
                        <span
                          style={{
                            width: 5,
                            height: 5,
                            borderRadius: "50%",
                            background: "var(--accent)",
                            display: "inline-block",
                            animation: "pulse-green 2s ease-in-out infinite",
                          }}
                        />
                        Now
                      </span>
                    )}
                  </h3>

                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--gray-500)",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
