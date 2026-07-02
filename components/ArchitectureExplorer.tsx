"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ArchNode {
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
}

interface ArchitectureExplorerProps {
  nodes: ArchNode[];
  title?: string;
}

const NODE_W = 140;
const NODE_H = 52;
const PAD = 48; // padding around the graph bounds

export default function ArchitectureExplorer({
  nodes,
  title,
}: ArchitectureExplorerProps) {
  const [activeNode, setActiveNode] = useState<ArchNode | null>(null);

  // Auto-compute canvas size from node positions
  const { canvasW, canvasH } = useMemo(() => {
    if (!nodes.length) return { canvasW: 960, canvasH: 560 };
    const maxX = Math.max(...nodes.map((n) => n.x + NODE_W)) + PAD;
    const maxY = Math.max(...nodes.map((n) => n.y + NODE_H)) + PAD;
    return { canvasW: maxX, canvasH: maxY };
  }, [nodes]);

  // Build connection paths as straight orthogonal (elbow) lines
  const connections = useMemo(() => {
    const paths: { d: string; key: string; active: boolean }[] = [];

    nodes.forEach((node) => {
      node.connections.forEach((targetId) => {
        const target = nodes.find((n) => n.id === targetId);
        if (!target) return;

        // Exit from bottom-center of source, enter top-center of target
        const x1 = node.x + NODE_W / 2;
        const y1 = node.y + NODE_H;
        const x2 = target.x + NODE_W / 2;
        const y2 = target.y;

        // If target is mostly below source — go straight down with elbow
        // Use a simple L-path: go halfway down then horizontal then down
        const midY = (y1 + y2) / 2;

        let d: string;
        if (Math.abs(x1 - x2) < 8) {
          // Straight vertical
          d = `M ${x1} ${y1} L ${x2} ${y2}`;
        } else {
          // Elbow: down to midY, horizontal, down to target
          d = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
        }

        const isActive =
          activeNode?.id === node.id || activeNode?.id === targetId;

        paths.push({ d, key: `${node.id}-${targetId}`, active: isActive });
      });
    });

    return paths;
  }, [nodes, activeNode]);

  const markerId = `arrow-${title?.replace(/\s+/g, "") ?? "default"}`;

  return (
    <div style={{ position: "relative", width: "100%" }}>
      {/* Scrollable canvas */}
      <div
        style={{
          width: "100%",
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: 620,
          border: "1px solid var(--gray-100)",
          borderRadius: "var(--radius-lg)",
          background: "var(--gray-50)",
          position: "relative",
        }}
        role="img"
        aria-label={`${title || "System"} architecture diagram. Click nodes for details.`}
      >
        <div
          style={{
            position: "relative",
            width: canvasW,
            height: canvasH,
            minWidth: "100%",
          }}
        >
          {/* SVG connection lines */}
          <svg
            style={{
              position: "absolute",
              inset: 0,
              width: canvasW,
              height: canvasH,
              pointerEvents: "none",
              overflow: "visible",
            }}
            viewBox={`0 0 ${canvasW} ${canvasH}`}
          >
            <defs>
              <marker
                id={markerId}
                markerWidth="7"
                markerHeight="7"
                refX="6"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 7 3.5, 0 7"
                  fill="var(--gray-300)"
                />
              </marker>
              <marker
                id={`${markerId}-active`}
                markerWidth="7"
                markerHeight="7"
                refX="6"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 7 3.5, 0 7"
                  fill="var(--accent)"
                />
              </marker>
            </defs>

            {connections.map((conn) => (
              <path
                key={conn.key}
                d={conn.d}
                stroke={conn.active ? "var(--accent)" : "var(--gray-200)"}
                strokeWidth={conn.active ? 1.5 : 1.5}
                strokeOpacity={activeNode && !conn.active ? 0.3 : 1}
                fill="none"
                markerEnd={`url(#${conn.active ? `${markerId}-active` : markerId})`}
                style={{ transition: "stroke 0.2s, stroke-opacity 0.2s" }}
              />
            ))}
          </svg>

          {/* Architecture nodes */}
          {nodes.map((node) => {
            const isActive = activeNode?.id === node.id;
            const isConnected =
              activeNode?.connections.includes(node.id) ||
              nodes.some(
                (n) => n.id === activeNode?.id && n.connections.includes(node.id)
              );
            const isDimmed =
              activeNode && !isActive && !isConnected &&
              !nodes.find((n) => n.connections.includes(node.id) && n.id === activeNode.id);

            return (
              <motion.button
                key={node.id}
                onClick={() =>
                  setActiveNode(activeNode?.id === node.id ? null : node)
                }
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                aria-label={`${node.label}: ${node.role}`}
                aria-pressed={isActive}
                style={{
                  position: "absolute",
                  left: node.x,
                  top: node.y,
                  width: NODE_W,
                  minHeight: NODE_H,
                  padding: "8px 12px",
                  background: isActive
                    ? "var(--black)"
                    : "rgba(255,255,255,0.95)",
                  border: `1.5px solid ${isActive ? "var(--black)" : isConnected ? "var(--accent)" : "var(--gray-200)"}`,
                  borderRadius: 8,
                  cursor: "pointer",
                  textAlign: "left",
                  boxShadow: isActive
                    ? "0 4px 20px rgba(0,0,0,0.15)"
                    : "0 1px 4px rgba(0,0,0,0.06)",
                  opacity: isDimmed ? 0.35 : 1,
                  transition: "opacity 0.2s, border-color 0.2s, background 0.2s, box-shadow 0.2s",
                  zIndex: isActive ? 10 : 1,
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    fontSize: 11.5,
                    color: isActive ? "#fff" : "var(--black)",
                    lineHeight: 1.3,
                    marginBottom: 3,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {node.label}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: isActive ? "rgba(255,255,255,0.55)" : "var(--gray-400)",
                    lineHeight: 1.3,
                    letterSpacing: "0.02em",
                  }}
                >
                  {node.role}
                </div>
              </motion.button>
            );
          })}

          {/* Hint */}
          {!activeNode && (
            <div
              style={{
                position: "absolute",
                bottom: 10,
                left: 14,
                fontSize: 10,
                color: "var(--gray-400)",
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.04em",
                pointerEvents: "none",
              }}
            >
              click any node to explore
            </div>
          )}
        </div>
      </div>

      {/* Detail panel — rendered outside the scrollable container */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            style={{
              marginTop: 16,
              padding: "24px 28px",
              border: "1px solid var(--gray-100)",
              borderRadius: "var(--radius-lg)",
              background: "#fff",
            }}
            role="complementary"
            aria-label="Node details"
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 16,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 10,
                    fontWeight: 600,
                    color: "var(--accent)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    marginBottom: 4,
                  }}
                >
                  {activeNode.role}
                </div>
                <h3
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "var(--black)",
                    letterSpacing: "-0.02em",
                    lineHeight: 1.2,
                  }}
                >
                  {activeNode.label}
                </h3>
              </div>
              <button
                onClick={() => setActiveNode(null)}
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  border: "1px solid var(--gray-200)",
                  background: "var(--gray-50)",
                  cursor: "pointer",
                  fontSize: 14,
                  color: "var(--gray-500)",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Close panel"
              >
                ×
              </button>
            </div>

            <p
              style={{
                fontSize: 13,
                lineHeight: 1.65,
                color: "var(--gray-600)",
                marginBottom: 20,
              }}
            >
              {activeNode.description}
            </p>

            {/* Info grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: 16,
              }}
            >
              <PanelSection title="Technology">
                <span
                  style={{
                    display: "inline-block",
                    padding: "3px 8px",
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                    background: "var(--gray-50)",
                    border: "1px solid var(--gray-200)",
                    borderRadius: 4,
                    color: "var(--black)",
                    lineHeight: 1.5,
                  }}
                >
                  {activeNode.technology}
                </span>
              </PanelSection>

              <PanelSection title="Inputs">
                <ul style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {activeNode.inputs.map((inp) => (
                    <li
                      key={inp}
                      style={{
                        fontSize: 12,
                        color: "var(--gray-600)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 5,
                        lineHeight: 1.4,
                      }}
                    >
                      <span style={{ color: "var(--gray-300)", flexShrink: 0, marginTop: 1 }}>→</span>
                      {inp}
                    </li>
                  ))}
                </ul>
              </PanelSection>

              <PanelSection title="Outputs">
                <ul style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {activeNode.outputs.map((out) => (
                    <li
                      key={out}
                      style={{
                        fontSize: 12,
                        color: "var(--gray-600)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 5,
                        lineHeight: 1.4,
                      }}
                    >
                      <span style={{ color: "var(--accent)", flexShrink: 0, marginTop: 1 }}>←</span>
                      {out}
                    </li>
                  ))}
                </ul>
              </PanelSection>

              <PanelSection title="Failure Cases">
                <ul style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {activeNode.failureCases.map((fc) => (
                    <li
                      key={fc}
                      style={{
                        fontSize: 12,
                        color: "var(--gray-600)",
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 5,
                        lineHeight: 1.4,
                      }}
                    >
                      <span style={{ color: "#ef4444", fontSize: 10, flexShrink: 0, marginTop: 2 }}>⚠</span>
                      {fc}
                    </li>
                  ))}
                </ul>
              </PanelSection>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PanelSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        style={{
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--gray-400)",
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}
