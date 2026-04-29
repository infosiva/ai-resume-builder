"use client";
import { useState } from "react";

interface Analysis {
  role_title?: string;
  company_type?: string;
  required_keywords?: string[];
  nice_to_have?: string[];
  matched_keywords?: string[];
  missing_keywords?: string[];
  match_score?: number;
  match_label?: string;
  key_gaps?: string[];
  strengths?: string[];
  job_search_terms?: string;
}

interface Props {
  onGenerate: (resume: string) => void;
  setLoading: (v: boolean) => void;
  onAnalysis: (a: Analysis) => void;
  onCoverLetter: (cl: string) => void;
  onInterviewPrep: (prep: InterviewPrep) => void;
}

interface InterviewPrep {
  role_title?: string;
  questions?: { question: string; category: string; why_asked: string; answer_framework: string; sample_answer_start: string }[];
  red_flags_to_avoid?: string[];
  questions_to_ask_them?: string[];
  salary_range_hint?: string;
}

export default function ResumeForm({ onGenerate, setLoading, onAnalysis, onCoverLetter, onInterviewPrep }: Props) {
  const [jobDesc, setJobDesc] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [name, setName] = useState("");
  const [currentTitle, setCurrentTitle] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingCL, setGeneratingCL] = useState(false);
  const [generatingPrep, setGeneratingPrep] = useState(false);

  async function handleAnalyze() {
    if (!jobDesc || !experience) return;
    setAnalyzing(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDesc, experience, skills, mode: "analyze" }),
      });
      const data = await res.json();
      onAnalysis(data.analysis || {});
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleCoverLetter() {
    if (!jobDesc || !experience) return;
    setGeneratingCL(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDesc, experience, skills, name, currentTitle, mode: "cover_letter" }),
      });
      const data = await res.json();
      onCoverLetter(data.coverLetter || "");
    } finally {
      setGeneratingCL(false);
    }
  }

  async function handleInterviewPrep() {
    if (!jobDesc || !experience) return;
    setGeneratingPrep(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDesc, experience, skills, mode: "interview_prep" }),
      });
      const data = await res.json();
      onInterviewPrep(data.prep || {});
    } finally {
      setGeneratingPrep(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDesc, experience, skills, name, currentTitle, mode: "generate" }),
      });
      const data = await res.json();
      onGenerate(data.resume);
    } finally {
      setLoading(false);
    }
  }

  const fieldClass =
    "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/60 focus:bg-white/[0.06] transition-all resize-none";
  const inputClass =
    "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500/60 transition-all";

  const hasInput = !!jobDesc && !!experience;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8">
      <h2 className="text-xl font-semibold mb-1">Build your resume</h2>
      <p className="text-sm text-white/40 mb-6">Paste a job spec · AI analyses the match · Get a tailored resume, cover letter & interview prep</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name + Title row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">Your name</label>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Jane Smith" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">Current title</label>
            <input value={currentTitle} onChange={e => setCurrentTitle(e.target.value)} placeholder="Senior Engineer" className={inputClass} />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">Job description</label>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here — AI will extract keywords, required skills, and score your profile match..."
            rows={6}
            className={fieldClass}
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">Your experience</label>
          <textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Describe your roles, companies, achievements... e.g. Led team of 5 engineers at Acme Corp, built React dashboard used by 10k users..."
            rows={5}
            className={fieldClass}
            required
          />
        </div>

        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">Key skills</label>
          <textarea
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="React, TypeScript, Python, AWS, team leadership, agile..."
            rows={2}
            className={fieldClass}
          />
        </div>

        {/* Step 1: Analyze */}
        <div>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Step 1 · Check your match</div>
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={!hasInput || analyzing}
            className="w-full py-3 rounded-xl border border-violet-500/40 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 font-medium text-sm transition-all disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {analyzing ? (
              <><div className="w-4 h-4 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" /> Analysing match...</>
            ) : (
              <><span>⚡</span> Check job match score</>
            )}
          </button>
        </div>

        {/* Step 2: Generate assets */}
        <div>
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-2">Step 2 · Generate your materials</div>
          <div className="grid grid-cols-1 gap-2.5">
            <button
              type="submit"
              disabled={!hasInput}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 font-semibold text-sm transition-all shadow-lg shadow-violet-500/20 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <span>✦</span> Generate tailored resume
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleCoverLetter}
                disabled={!hasInput || generatingCL}
                className="py-3 rounded-xl border border-cyan-500/30 bg-cyan-500/8 hover:bg-cyan-500/15 text-cyan-300 font-medium text-sm transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                {generatingCL ? (
                  <><div className="w-3.5 h-3.5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" /> Writing...</>
                ) : (
                  <><span>✉️</span> Cover letter</>
                )}
              </button>

              <button
                type="button"
                onClick={handleInterviewPrep}
                disabled={!hasInput || generatingPrep}
                className="py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/8 hover:bg-emerald-500/15 text-emerald-300 font-medium text-sm transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
              >
                {generatingPrep ? (
                  <><div className="w-3.5 h-3.5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" /> Preparing...</>
                ) : (
                  <><span>🎯</span> Interview prep</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
