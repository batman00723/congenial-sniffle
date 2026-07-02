"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import ArchitectureExplorer from "./ArchitectureExplorer";

interface System {
  id: string;
  number: string;
  name: string;
  tagline: string;
  status: string;
  metrics: { label: string; value: string }[];
  stack: string[];
  highlights: string[];
  pipeline?: { step: string; description: string; duration: string }[];
  architecture: {
    nodes: {
      id: string;
      label: string;
      x: number;
      y: number;
      role: string;
      description: string;
      connections: string[];
      technology: string;
      inputs: string[];
      outputs: string[];
      failureCases: string[];
    }[];
  };
  engineeringDecisions: { decision: string; rationale: string }[];
  challenges: { title: string; description: string }[];
}

interface SystemsSectionProps {
  systems: System[];
}

export default function SystemsSection({ systems }: SystemsSectionProps) {
  const [activeSystem, setActiveSystem] = useState<System>(systems[0]);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section id="systems" className="section" aria-labelledby="systems-heading">
      <div className="container">
        <motion.div
          ref={ref}
          className="content-card"
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Section header */}
          <div className="section-label">Systems</div>
          <h2
            id="systems-heading"
            className="display-md"
            style={{ color: "var(--black)", marginBottom: 16, maxWidth: 600 }}
          >
            Production AI Systems.
          </h2>
          <p
            style={{
              fontSize: 16,
              color: "var(--gray-500)",
              maxWidth: 520,
              lineHeight: 1.6,
              marginBottom: 64,
            }}
          >
            Not demos. Not prototypes. Systems built for real-world deployment
            with production-grade architecture.
          </p>

          {/* System selector tabs */}
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 48,
              flexWrap: "wrap",
            }}
            role="tablist"
            aria-label="AI Systems"
          >
            {systems.map((sys) => (
              <button
                key={sys.id}
                onClick={() => setActiveSystem(sys)}
                role="tab"
                aria-selected={activeSystem.id === sys.id}
                aria-controls={`panel-${sys.id}`}
                style={{
                  padding: "10px 20px",
                  borderRadius: "var(--radius-full)",
                  border: `1px solid ${activeSystem.id === sys.id ? "var(--accent)" : "var(--gray-200)"}`,
                  background:
                    activeSystem.id === sys.id
                      ? "var(--accent-muted)"
                      : "transparent",
                  color:
                    activeSystem.id === sys.id
                      ? "var(--accent)"
                      : "var(--gray-500)",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                  transition: "all 0.2s var(--ease-out)",
                  fontFamily: "var(--font-mono)",
                  letterSpacing: "0.01em",
                }}
              >
                {sys.number} — {sys.name}
              </button>
            ))}
          </div>

          {/* Active system display */}
          <motion.div style={{ y: yParallax }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSystem.id}
                id={`panel-${activeSystem.id}`}
                role="tabpanel"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              >
                <SystemDetail system={activeSystem} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function SystemDetail({ system }: { system: System }) {
  const [tab, setTab] = useState<"overview" | "architecture" | "decisions" | "challenges">("overview");

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "architecture", label: "Architecture" },
    { id: "decisions", label: "Engineering Decisions" },
    { id: "challenges", label: "Challenges" },
  ] as const;

  return (
    <div>
      {/* System header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 40,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <div className="system-number">SYSTEM {system.number}</div>
          <h3
            className="display-md"
            style={{ color: "var(--black)", marginBottom: 8 }}
          >
            {system.name}
          </h3>
          <p
            style={{ fontSize: 16, color: "var(--gray-500)", maxWidth: 480, lineHeight: 1.6 }}
          >
            {system.tagline}
          </p>
        </div>

        <div className="system-status">
          <span className="system-status-dot" />
          {system.status}
        </div>
      </div>

      {/* Metrics */}
      <div className="metric-grid" style={{ marginBottom: 40 }}>
        {system.metrics.map((m) => (
          <div key={m.label} className="metric-item">
            <span className="metric-value">{m.value}</span>
            <span className="metric-label">{m.label}</span>
          </div>
        ))}
      </div>

      {/* Stack */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
        {system.stack.map((tech) => (
          <span key={tech} className="stack-badge">
            {tech}
          </span>
        ))}
      </div>

      {/* Inner tabs */}
      <div
        style={{
          display: "flex",
          gap: 4,
          borderBottom: "1px solid var(--gray-100)",
          marginBottom: 32,
        }}
        role="tablist"
      >
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            role="tab"
            aria-selected={tab === t.id}
            style={{
              padding: "10px 16px",
              fontSize: 13,
              fontWeight: 500,
              color: tab === t.id ? "var(--black)" : "var(--gray-400)",
              background: "transparent",
              border: "none",
              borderBottom: `2px solid ${tab === t.id ? "var(--black)" : "transparent"}`,
              cursor: "pointer",
              transition: "color 0.2s, border-color 0.2s",
              marginBottom: -1,
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          {tab === "overview" && (
            <OverviewTab system={system} />
          )}
          {tab === "architecture" && (
            <ArchitectureExplorer nodes={system.architecture.nodes} title={system.name} />
          )}
          {tab === "decisions" && (
            <DecisionsTab decisions={system.engineeringDecisions} />
          )}
          {tab === "challenges" && (
            <ChallengesTab challenges={system.challenges} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function OverviewTab({ system }: { system: System }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
      <div>
        <h4
          style={{
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "var(--gray-400)",
            marginBottom: 16,
          }}
        >
          Highlights
        </h4>
        <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {system.highlights.map((h, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                fontSize: 14,
                color: "var(--gray-700)",
                lineHeight: 1.5,
              }}
            >
              <span
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: "var(--accent-muted)",
                  border: "1px solid var(--accent-border)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                <span
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: "50%",
                    background: "var(--accent)",
                    display: "block",
                  }}
                />
              </span>
              {h}
            </li>
          ))}
        </ul>
      </div>

      {system.pipeline && (
        <div>
          <h4
            style={{
              fontSize: 13,
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "var(--gray-400)",
              marginBottom: 16,
            }}
          >
            Pipeline
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {system.pipeline.map((step, i) => (
              <div key={step.step} className="pipeline-step">
                <div
                  className="pipeline-step-number"
                  style={{
                    background: i === 0 ? "var(--accent-muted)" : undefined,
                    borderColor: i === 0 ? "var(--accent-border)" : undefined,
                    color: i === 0 ? "var(--accent)" : undefined,
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--black)", marginBottom: 2 }}>
                    {step.step}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--gray-500)", lineHeight: 1.5 }}>
                    {step.description}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "var(--accent)",
                      fontFamily: "var(--font-mono)",
                      marginTop: 4,
                    }}
                  >
                    {step.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DecisionsTab({
  decisions,
}: {
  decisions: { decision: string; rationale: string }[];
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      {decisions.map((d, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: "200px 1fr",
            gap: 24,
            paddingBottom: 24,
            borderBottom: i < decisions.length - 1 ? "1px solid var(--gray-100)" : "none",
          }}
        >
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: "var(--black)",
              lineHeight: 1.4,
            }}
          >
            {d.decision}
          </div>
          <div style={{ fontSize: 14, color: "var(--gray-600)", lineHeight: 1.6 }}>
            {d.rationale}
          </div>
        </div>
      ))}
    </div>
  );
}

function ChallengesTab({
  challenges,
}: {
  challenges: { title: string; description: string }[];
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
      {challenges.map((c, i) => (
        <div
          key={i}
          style={{
            padding: 24,
            border: "1px solid var(--gray-100)",
            borderRadius: "var(--radius-lg)",
            background: "var(--gray-50)",
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#ef4444",
              marginBottom: 8,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <span>⚠</span> Challenge
          </div>
          <h4
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--black)",
              marginBottom: 8,
              lineHeight: 1.3,
            }}
          >
            {c.title}
          </h4>
          <p style={{ fontSize: 13, color: "var(--gray-600)", lineHeight: 1.6 }}>
            {c.description}
          </p>
        </div>
      ))}
    </div>
  );
}
