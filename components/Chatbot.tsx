"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2, RefreshCw } from "lucide-react";

interface Message {
  role: "user" | "bot";
  content: string;
}

interface ChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Chatbot({ isOpen, onClose }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Hello! I'm Alfred, Aman's Buttler. Do you have any questions regarding Aman?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userMessage }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);

      const data = await response.json();
      const botReply = data.answer || data.response || data.reply || data.message || data.text || "I'm sorry, I couldn't process that.";

      setMessages((prev) => [...prev, { role: "bot", content: botReply }]);
    } catch (error) {
      console.error("Chat API Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "bot", content: "Sorry, I'm having trouble connecting to the server right now. Please try again later." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="chatbox-container"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {/* Header */}
          <div
            style={{
              padding: "16px",
              borderBottom: "1px solid var(--gray-200)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "rgba(100,100,100,0.05)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: "#10b981",
                  boxShadow: "0 0 8px #10b981",
                }}
              />
              <h3 style={{ margin: 0, fontSize: "15px", fontWeight: 600 }}>Resume AI</h3>
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              <button
                onClick={() => setMessages([{ role: "bot", content: "Hello! I'm Alfred, Aman's Buttler. Do you have any questions regarding Aman?" }])}
                title="Start New Chat"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--gray-500)",
                  cursor: "pointer",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  transition: "color 0.2s, background 0.2s"
                }}
                className="hover:bg-gray-100 hover:text-black"
              >
                <RefreshCw size={16} />
              </button>
              <button
                onClick={onClose}
                title="Close"
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--gray-500)",
                  cursor: "pointer",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "4px",
                  transition: "color 0.2s, background 0.2s"
                }}
                className="hover:bg-gray-100 hover:text-black"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "flex-start",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: msg.role === "user" ? "var(--black)" : "var(--white)",
                    border: "1px solid var(--gray-200)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: msg.role === "user" ? "var(--white)" : "var(--black)",
                    flexShrink: 0,
                  }}
                >
                  {msg.role === "user" ? <User size={14} /> : <Bot size={14} />}
                </div>
                <div
                  style={{
                    backgroundColor: msg.role === "user" ? "var(--black)" : "var(--gray-50)",
                    color: msg.role === "user" ? "var(--white)" : "var(--black)",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    borderTopRightRadius: msg.role === "user" ? "4px" : "12px",
                    borderTopLeftRadius: msg.role === "bot" ? "4px" : "12px",
                    fontSize: "14px",
                    lineHeight: 1.5,
                    maxWidth: "80%",
                    border: msg.role === "bot" ? "1px solid var(--gray-200)" : "none",
                  }}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "var(--white)",
                    border: "1px solid var(--gray-200)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "var(--black)",
                    flexShrink: 0,
                  }}
                >
                  <Bot size={14} />
                </div>
                <div
                  style={{
                    backgroundColor: "var(--gray-50)",
                    padding: "10px 14px",
                    borderRadius: "12px",
                    borderTopLeftRadius: "4px",
                    border: "1px solid var(--border)",
                  }}
                >
                  <div style={{ display: 'flex', gap: '4px', padding: '6px 4px' }}>
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0 }} style={{ width: 6, height: 6, backgroundColor: 'var(--gray-400)', borderRadius: '50%' }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} style={{ width: 6, height: 6, backgroundColor: 'var(--gray-400)', borderRadius: '50%' }} />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} style={{ width: 6, height: 6, backgroundColor: 'var(--gray-400)', borderRadius: '50%' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              padding: "16px",
              borderTop: "1px solid var(--gray-200)",
              display: "flex",
              gap: "8px",
              backgroundColor: "var(--white)",
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about my experience..."
              style={{
                flex: 1,
                padding: "10px 14px",
                borderRadius: "8px",
                border: "1px solid var(--gray-200)",
                backgroundColor: "var(--gray-50)",
                color: "var(--black)",
                fontSize: "14px",
                outline: "none",
              }}
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "8px",
                backgroundColor: "var(--black)",
                color: "var(--white)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: isLoading || !input.trim() ? "not-allowed" : "pointer",
                opacity: isLoading || !input.trim() ? 0.5 : 1,
              }}
            >
              <Send size={16} />
            </button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
