"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

interface BuildLogEntry {
  date: string;
  id: string;
  title: string;
  lesson: string;
  insight: string;
  tags: string[];
}

interface BuildLogSectionProps {
  entries: BuildLogEntry[];
}

export default function BuildLogSection({ entries }: BuildLogSectionProps) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section
      id="buildlog"
      className="section"
      aria-labelledby="buildlog-heading"
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
          <div className="section-label">Build Log</div>
          <h2
            id="buildlog-heading"
            className="display-md"
            style={{ color: "var(--black)", marginBottom: 16, maxWidth: 560 }}
          >
            Engineering notebook.
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
            Real decisions, real lessons. What worked, what didn't, and
            why it matters.
          </p>

          {/* Log entries */}
          <div
            style={{
              maxWidth: 800,
            }}
          >
            {entries.map((entry, i) => (
              <motion.article
                key={entry.id}
                className="buildlog-entry"
                aria-label={entry.title}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  ease: [0.16, 1, 0.3, 1],
                  delay: i * 0.07,
                }}
              >
                <div className="buildlog-date">{entry.date}</div>

                <div>
                  <h3
                    style={{
                      fontSize: 16,
                      fontWeight: 600,
                      color: "var(--black)",
                      marginBottom: 8,
                      lineHeight: 1.3,
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {entry.title}
                  </h3>

                  {/* Lesson */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      marginBottom: 10,
                      padding: "8px 12px",
                      background: "var(--accent-muted)",
                      border: "1px solid var(--accent-border)",
                      borderRadius: "var(--radius-sm)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "var(--accent)",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        flexShrink: 0,
                        paddingTop: 1,
                      }}
                    >
                      Lesson
                    </span>
                    <p
                      style={{
                        fontSize: 13,
                        color: "var(--accent-dark)",
                        lineHeight: 1.5,
                        fontStyle: "italic",
                      }}
                    >
                      {entry.lesson}
                    </p>
                  </div>

                  {/* Insight */}
                  <p
                    style={{
                      fontSize: 14,
                      color: "var(--gray-600)",
                      lineHeight: 1.65,
                      marginBottom: 12,
                    }}
                  >
                    {entry.insight}
                  </p>

                  {/* Tags */}
                  <div className="buildlog-tags">
                    {entry.tags.map((tag) => (
                      <span key={tag} className="buildlog-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
