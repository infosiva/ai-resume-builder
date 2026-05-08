"use client";
import { useState, useEffect } from "react";
import { useGate } from "@/lib/shared/useGate";
import RegisterGate from "@/lib/shared/RegisterGate";

const SESSION_KEY = "resumevault-session";

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

interface InterviewPrep {
  role_title?: string;
  questions?: {
    question: string;
    category: string;
    why_asked: string;
    answer_framework: string;
    sample_answer_start: string;
  }[];
  red_flags_to_avoid?: string[];
  questions_to_ask_them?: string[];
  salary_range_hint?: string;
}

interface Props {
  onGenerate: (resume: string) => void;
  setLoading: (v: boolean) => void;
  onAnalysis: (a: Analysis) => void;
  onCoverLetter: (cl: string) => void;
  onInterviewPrep: (prep: InterviewPrep) => void;
  // receive initial values from saved session
  initialValues?: {
    jobDesc: string;
    experience: string;
    skills: string;
    name: string;
    currentTitle: string;
  };
}

export default function ResumeForm({
  onGenerate,
  setLoading,
  onAnalysis,
  onCoverLetter,
  onInterviewPrep,
  initialValues,
}: Props) {
  const { count: gateCount, showGate, increment: gateIncrement, onRegistered, dismissGate, isRegistered } = useGate("resumevault", 3);
  const remaining = Math.max(0, 3 - gateCount);
  const isLimited = !isRegistered && gateCount >= 3;
  const [jobDesc, setJobDesc] = useState(initialValues?.jobDesc ?? "");
  const [experience, setExperience] = useState(initialValues?.experience ?? "");
  const [skills, setSkills] = useState(initialValues?.skills ?? "");
  const [name, setName] = useState(initialValues?.name ?? "");
  const [currentTitle, setCurrentTitle] = useState(initialValues?.currentTitle ?? "");
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingCL, setGeneratingCL] = useState(false);
  const [generatingPrep, setGeneratingPrep] = useState(false);
  const [generatingAll, setGeneratingAll] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<string | null>(null);

  // auto-save to localStorage on field change
  useEffect(() => {
    if (!jobDesc && !experience) return;
    const session = { jobDesc, experience, skills, name, currentTitle };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    setSavedAt(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
  }, [jobDesc, experience, skills, name, currentTitle]);

  async function handleAnalyze() {
    if (!jobDesc || !experience) return;
    const allowed = await gateIncrement();
    if (!allowed) return;
    setAnalyzing(true);
    setApiError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDesc, experience, skills, mode: "analyze" }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setApiError(data.error || "Analysis failed");
        return;
      }
      onAnalysis(data.analysis || {});
    } catch {
      setApiError("Network error. Please try again.");
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

  // Generate All: analyze → resume → cover letter → interview prep sequentially
  async function handleGenerateAll() {
    if (!jobDesc || !experience) return;
    const allowed = await gateIncrement();
    if (!allowed) return;
    setGeneratingAll(true);
    setApiError(null);
    try {
      // 1. Analyze
      const aRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDesc, experience, skills, mode: "analyze" }),
      });
      const aData = await aRes.json();
      if (aData.analysis) onAnalysis(aData.analysis);

      // 2. Resume
      setLoading(true);
      const rRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDesc, experience, skills, name, currentTitle, mode: "generate" }),
      });
      const rData = await rRes.json();
      if (rData.resume) onGenerate(rData.resume);
      setLoading(false);

      // 3. Cover letter
      const cRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDesc, experience, skills, name, currentTitle, mode: "cover_letter" }),
      });
      const cData = await cRes.json();
      if (cData.coverLetter) onCoverLetter(cData.coverLetter);

      // 4. Interview prep
      const pRes = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDesc, experience, skills, mode: "interview_prep" }),
      });
      const pData = await pRes.json();
      if (pData.prep) onInterviewPrep(pData.prep);
    } catch {
      setApiError("Something went wrong. Please try again.");
    } finally {
      setGeneratingAll(false);
      setLoading(false);
    }
  }

  const fieldClass =
    "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/60 focus:bg-white/[0.06] transition-all resize-none";
  const inputClass =
    "w-full bg-white/[0.04] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-orange-500/60 transition-all";

  const hasInput = !!jobDesc && !!experience;
  const isAnyLoading = analyzing || generatingCL || generatingPrep || generatingAll;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-5 sm:p-8">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-xl font-semibold">Build your career toolkit</h2>
        {savedAt && (
          <span className="text-[10px] text-white/30 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
            Auto-saved {savedAt}
          </span>
        )}
      </div>
      <p className="text-sm text-white/40 mb-6">
        Paste a job spec · AI scores your match · Get resume, cover letter &amp; interview prep
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name + Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">
              Your name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">
              Current title
            </label>
            <input
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              placeholder="Senior Engineer"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2 block">
            Job description
          </label>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            placeholder="Paste the full job description here — AI will extract keywords, required skills, and score your match..."
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
            placeholder="Describe your roles, companies, achievements... e.g. Led team of 5 engineers at Acme Corp, built React dashboard used by 10k users..."
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
            placeholder="React, TypeScript, Python, AWS, team leadership, agile..."
            rows={2}
            className={fieldClass}
          />
        </div>

        {/* Generate All — primary CTA */}
        <div className="pt-1">
          <button
            type="button"
            onClick={handleGenerateAll}
            disabled={!hasInput || isAnyLoading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-600 to-rose-600 hover:from-orange-500 hover:to-rose-500 font-bold text-base transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-40"
          >
            {generatingAll ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating everything...
              </>
            ) : (
              <>✦ Generate Full Career Toolkit</>
            )}
          </button>
          <div className="flex justify-between text-[10px] text-white/25 mt-1.5 px-1">
            <span>Runs all 4 steps at once: match score + resume + cover letter + interview prep</span>
            <span>{remaining} free left</span>
          </div>
        </div>

        {/* Individual steps */}
        <div className="border-t border-white/5 pt-4">
          <div className="text-[10px] text-white/30 uppercase tracking-wider mb-3">Or generate individually</div>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={!hasInput || analyzing}
              className="py-2.5 rounded-xl border border-violet-500/40 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 font-medium text-xs transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              {analyzing ? (
                <div className="w-3 h-3 border-2 border-violet-400/30 border-t-violet-400 rounded-full animate-spin" />
              ) : (
                <span>⚡</span>
              )}
              Match score
            </button>

            <button
              type="submit"
              disabled={!hasInput || isAnyLoading}
              className="py-2.5 rounded-xl border border-stone-500/40 bg-stone-500/10 hover:bg-stone-500/20 text-stone-300 font-medium text-xs transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              <span>📄</span> Resume only
            </button>

            <button
              type="button"
              onClick={handleCoverLetter}
              disabled={!hasInput || generatingCL || isAnyLoading}
              className="py-2.5 rounded-xl border border-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-medium text-xs transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              {generatingCL ? (
                <div className="w-3 h-3 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
              ) : (
                <span>✉️</span>
              )}
              Cover letter
            </button>

            <button
              type="button"
              onClick={handleInterviewPrep}
              disabled={!hasInput || generatingPrep || isAnyLoading}
              className="py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-medium text-xs transition-all disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              {generatingPrep ? (
                <div className="w-3 h-3 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
              ) : (
                <span>🎯</span>
              )}
              Interview prep
            </button>
          </div>
        </div>
      </form>

      {apiError && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3">
          <p className="text-red-300 text-sm">⚠️ {apiError}</p>
        </div>
      )}

      {showGate && (
        <RegisterGate
          freeUsed={gateCount}
          freeLimit={3}
          freeFeature="resumes"
          lockedFeature="unlimited resume generations"
          accentColor="#f97316"
          site="resumevault"
          onSuccess={onRegistered}
          onDismiss={dismissGate}
        />
      )}
    </div>
  );
}
