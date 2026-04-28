"use client";
import { useState } from "react";

interface Props {
  onGenerate: (resume: string) => void;
  setLoading: (v: boolean) => void;
}

export default function ResumeForm({ onGenerate, setLoading }: Props) {
  const [jobDesc, setJobDesc] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDesc, experience, skills }),
      });
      const data = await res.json();
      onGenerate(data.resume);
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.06] transition-all resize-none";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8">
      <h2 className="text-xl font-semibold mb-1">Your details</h2>
      <p className="text-sm text-white/40 mb-6">Fill in the fields — AI does the rest</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">
            Job description
          </label>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={6}
            className={fieldClass}
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">
            Your experience
          </label>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="List your previous roles, companies, and achievements..."
            rows={5}
            className={fieldClass}
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">
            Key skills
          </label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, TypeScript, Python, team leadership..."
            rows={3}
            className={fieldClass}
          />
        </div>

        <button
          type="submit"
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 font-semibold text-sm transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2"
        >
          <span>Generate resume</span>
          <span className="text-lg">✦</span>
        </button>
      </form>
    </div>
  );
}
