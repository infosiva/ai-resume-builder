import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ResumeVault — AI-Powered Resume Builder",
  description: "Generate tailored, professional resumes from job descriptions in seconds. Free AI resume builder for job seekers.",
  keywords: "resume builder, AI resume, CV generator, job application, free resume maker, resumevault",
  openGraph: {
    title: "ResumeVault — AI Resume Builder",
    description: "Paste a job description and get a polished, tailored resume in seconds. Free and powered by AI.",
    type: "website",
    url: "https://resumevault.app",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}<script src="/t.js" data-site="ai-resume-builder-olive-omega.vercel.app" defer></script></body>
    </html>
  );
}
