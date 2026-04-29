import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeAI — AI-Powered Resume Builder",
  description: "Generate tailored resumes from job descriptions in seconds using Claude AI.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}<script src="/t.js" data-site="ai-resume-builder-olive-omega.vercel.app" defer></script></body>
    </html>
  );
}
