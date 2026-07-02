import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aman Mishra — AI Systems Engineer",
  description:
    "Engineering Autonomous Intelligence for the Real World. Building production AI systems using agentic workflows, RAG, orchestration, and persistent memory.",
  keywords: [
    "AI Systems Engineer",
    "LangGraph",
    "RAG",
    "Agentic AI",
    "Production AI",
    "Aman Mishra",
  ],
  authors: [{ name: "Aman Mishra" }],
  creator: "Aman Mishra",
  openGraph: {
    type: "website",
    title: "Aman Mishra — AI Systems Engineer",
    description:
      "Engineering Autonomous Intelligence for the Real World.",
    siteName: "Aman Mishra Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aman Mishra — AI Systems Engineer",
    description: "Engineering Autonomous Intelligence for the Real World.",
    creator: "@batmanmishra007",
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={inter.variable}>
        <div className="noise-overlay"></div>
        {children}
      </body>
    </html>
  );
}
