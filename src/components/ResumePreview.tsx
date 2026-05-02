"use client";
import { useState, useCallback } from "react";

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

interface InterviewQuestion {
  question: string;
  category: string;
  why_asked: string;
  answer_framework: string;
  sample_answer_start: string;
}

interface InterviewPrep {
  role_title?: string;
  questions?: InterviewQuestion[];
  red_flags_to_avoid?: string[];
  questions_to_ask_them?: string[];
  salary_range_hint?: string;
}

interface Props {
  resume: string | null;
  loading: boolean;
  analysis: Analysis | null;
  coverLetter: string | null;
  interviewPrep: InterviewPrep | null;
  activeTab: 'resume' | 'cover' | 'prep';
  onTabChange: (tab: 'resume' | 'cover' | 'prep') => void;
}

function MatchGauge({ score }: { score: number }) {
  const color = score >= 75 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444';
  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 100 60" className="w-28 h-18">
        <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" strokeLinecap="round" />
        <path d="M10,50 A40,40 0 0,1 90,50" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${score * 1.257} 200`} />
        <text x="50" y="48" textAnchor="middle" fill="white" fontSize="18" fontWeight="bold">{score}</text>
        <text x="50" y="58" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="7">/ 100</text>
      </svg>
      <div className="text-xs font-semibold" style={{ color }}>
        {score >= 75 ? 'Strong Match' : score >= 50 ? 'Good Match' : 'Needs Work'}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return (
    <button onClick={copy}
      className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${copied ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300' : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white'}`}>
      {copied ? '✓ Copied' : '📋 Copy'}
    </button>
  );
}

function mdToHtml(md: string): string {
  return md
    .replace(/^# (.+)$/gm, '<h1 style="font-size:1.5rem;font-weight:700;margin:1rem 0 0.5rem">$1</h1>')
    .replace(/^## (.+)$/gm, '<h2 style="font-size:1.1rem;font-weight:600;margin:1rem 0 0.25rem;border-bottom:1px solid #eee;padding-bottom:0.25rem">$1</h2>')
    .replace(/^### (.+)$/gm, '<h3 style="font-size:0.95rem;font-weight:600;margin:0.75rem 0 0.25rem">$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/^- (.+)$/gm, '<li style="margin:0.2rem 0 0.2rem 1rem">$1</li>')
    .replace(/^(.*\S.*)$/gm, (l) => l.startsWith('<') ? l : `<p style="margin:0.25rem 0">${l}</p>`)
    .replace(/\n/g, '');
}

const CATEGORY_COLORS: Record<string, string> = {
  behavioural: 'bg-violet-500/15 border-violet-500/30 text-violet-300',
  technical: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-300',
  situational: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
  culture: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
};

function InterviewPrepPanel({ prep }: { prep: InterviewPrep }) {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div className="space-y-5">
      {prep.salary_range_hint && (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 px-4 py-3">
          <div className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Salary insight</div>
          <p className="text-sm text-emerald-300">{prep.salary_range_hint}</p>
        </div>
      )}

      {(prep.questions || []).length > 0 && (
        <div>
          <div className="text-xs font-semibold text-white/70 mb-3">Likely interview questions</div>
          <div className="space-y-2">
            {prep.questions!.map((q, i) => (
              <div key={i} className="rounded-xl border border-white/8 bg-white/[0.025] overflow-hidden">
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  className="w-full px-4 py-3 flex items-start gap-3 text-left hover:bg-white/[0.03] transition-colors">
                  <span className={`mt-0.5 text-[10px] px-1.5 py-0.5 rounded border flex-shrink-0 ${CATEGORY_COLORS[q.category] || 'bg-white/10 border-white/20 text-white/50'}`}>
                    {q.category}
                  </span>
                  <span className="text-sm text-white/80 leading-snug">{q.question}</span>
                  <span className="ml-auto text-white/30 flex-shrink-0 text-xs mt-0.5">{openIdx === i ? '▲' : '▼'}</span>
                </button>
                {openIdx === i && (
                  <div className="px-4 pb-4 space-y-2.5 border-t border-white/5">
                    <div>
                      <div className="text-[10px] text-white/40 mt-3 mb-1 uppercase tracking-wider">Why they ask this</div>
                      <p className="text-xs text-white/60">{q.why_asked}</p>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">How to answer</div>
                      <p className="text-xs text-white/60">{q.answer_framework}</p>
                    </div>
                    <div>
                      <div className="text-[10px] text-white/40 mb-1 uppercase tracking-wider">Strong opening</div>
                      <p className="text-xs text-cyan-300 italic">"{q.sample_answer_start}"</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {(prep.questions_to_ask_them || []).length > 0 && (
        <div>
          <div className="text-xs font-semibold text-white/70 mb-2">Questions to ask them</div>
          <div className="space-y-1.5">
            {prep.questions_to_ask_them!.map((q, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-white/60">
                <span className="text-emerald-400 mt-0.5 flex-shrink-0">?</span>{q}
              </div>
            ))}
          </div>
        </div>
      )}

      {(prep.red_flags_to_avoid || []).length > 0 && (
        <div className="rounded-xl border border-red-500/15 bg-red-500/5 p-4">
          <div className="text-[10px] text-white/40 mb-2 uppercase tracking-wider">Avoid these mistakes</div>
          <div className="space-y-1.5">
            {prep.red_flags_to_avoid!.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-red-300/70">
                <span className="text-red-400 flex-shrink-0">✕</span>{f}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResumePreview({ resume, loading, analysis, coverLetter, interviewPrep, activeTab, onTabChange }: Props) {
  const [downloadOpen, setDownloadOpen] = useState(false);

  function downloadAs(format: 'md' | 'html' | 'txt') {
    if (!resume) return;
    let content = resume;
    let mime = 'text/plain';
    const ext = format;

    if (format === 'html') {
      content = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Resume</title>
<style>body{font-family:Arial,sans-serif;max-width:800px;margin:2rem auto;padding:2rem;color:#111;line-height:1.5}
h1{color:#111}h2{color:#333;border-bottom:1px solid #ddd}li{margin:0.2rem 0}
</style></head><body>${mdToHtml(resume)}</body></html>`;
      mime = 'text/html';
    } else if (format === 'txt') {
      content = resume.replace(/[#*_`]/g, '');
      mime = 'text/plain';
    }

    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `resume.${ext}`; a.click();
    URL.revokeObjectURL(url);
    setDownloadOpen(false);
  }

  function printResume() {
    if (!resume) return;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Resume</title>
<style>body{font-family:Arial,sans-serif;max-width:800px;margin:2rem auto;color:#111;line-height:1.5}
@media print{body{margin:0}}</style></head><body>${mdToHtml(resume)}</body></html>`;
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.print();
  }

  const searchTerms = analysis?.job_search_terms || '';
  const jobLinks = searchTerms ? [
    { label: '🔗 LinkedIn', url: `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(searchTerms)}` },
    { label: '🔍 Indeed', url: `https://www.indeed.com/jobs?q=${encodeURIComponent(searchTerms)}` },
    { label: '🌐 Google Jobs', url: `https://www.google.com/search?q=${encodeURIComponent(searchTerms + ' jobs')}` },
    { label: '🏢 Glassdoor', url: `https://www.glassdoor.com/Search/results.htm?keyword=${encodeURIComponent(searchTerms)}` },
  ] : [];

  const tabs = [
    { id: 'resume' as const, label: 'Resume', dot: !!resume },
    { id: 'cover' as const, label: 'Cover Letter', dot: !!coverLetter },
    { id: 'prep' as const, label: 'Interview Prep', dot: !!interviewPrep?.questions?.length },
  ];

  return (
    <div className="space-y-4">
      {/* Analysis panel */}
      {analysis && analysis.match_score !== undefined && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6"
          style={{ boxShadow: analysis.match_score >= 75 ? '0 0 30px rgba(16,185,129,0.1)' : '0 0 30px rgba(245,158,11,0.1)' }}>

          <div className="flex items-start gap-5 mb-5">
            <MatchGauge score={analysis.match_score} />
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-base mb-0.5">{analysis.role_title || 'Role Analysis'}</div>
              {analysis.company_type && <div className="text-xs text-white/40 capitalize mb-3">{analysis.company_type}</div>}
              <div className="space-y-1">
                {(analysis.strengths || []).slice(0, 2).map((s, i) => (
                  <div key={i} className="text-xs text-emerald-300 flex items-start gap-1.5">
                    <span className="flex-shrink-0 mt-0.5">✓</span>{s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Keywords */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Matched
              </div>
              <div className="flex flex-wrap gap-1">
                {(analysis.matched_keywords || []).slice(0, 8).map(kw => (
                  <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">{kw}</span>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Add to resume
              </div>
              <div className="flex flex-wrap gap-1">
                {(analysis.missing_keywords || []).slice(0, 8).map(kw => (
                  <span key={kw} className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300">{kw}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Gaps */}
          {(analysis.key_gaps || []).length > 0 && (
            <div className="rounded-xl bg-white/[0.03] border border-white/5 p-3 mb-4">
              <div className="text-[10px] text-white/40 mb-1.5 uppercase tracking-wider">Address these gaps:</div>
              {analysis.key_gaps!.map((gap, i) => (
                <div key={i} className="text-xs text-white/60 flex items-start gap-1.5">
                  <span className="text-amber-400 flex-shrink-0">→</span>{gap}
                </div>
              ))}
            </div>
          )}

          {/* Job search */}
          {jobLinks.length > 0 && (
            <div>
              <div className="text-[10px] text-white/40 uppercase tracking-wider mb-2">Find matching openings</div>
              <div className="grid grid-cols-2 gap-2">
                {jobLinks.map(({ label, url }) => (
                  <a key={label} href={url} target="_blank" rel="noopener noreferrer"
                    className="py-2 px-3 rounded-lg bg-white/[0.04] border border-white/10 text-white/60 text-xs font-medium text-center hover:bg-white/[0.08] hover:text-white transition-all">
                    {label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab bar + content */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl flex flex-col">
        {/* Tabs */}
        <div className="flex border-b border-white/8 px-2 pt-2">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => onTabChange(tab.id)}
              className={`relative px-4 py-2.5 text-sm font-medium rounded-t-lg transition-all flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'text-white bg-white/[0.06] border-b-2 border-violet-400'
                  : 'text-white/40 hover:text-white/70'
              }`}>
              {tab.label}
              {tab.dot && <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />}
            </button>
          ))}
        </div>

        <div className="p-6 flex-1 flex flex-col">
          {/* Resume tab */}
          {activeTab === 'resume' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold mb-0.5">Tailored Resume</h2>
                  <p className="text-xs text-white/40">ATS-optimised · Keywords matched</p>
                </div>
                {resume && (
                  <div className="relative">
                    <div className="flex gap-2">
                      <button onClick={printResume}
                        className="px-3 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 text-xs font-medium transition-all">
                        🖨️ Print / PDF
                      </button>
                      <button onClick={() => setDownloadOpen(o => !o)}
                        className="px-3 py-2 rounded-lg border border-violet-500/30 bg-violet-500/10 hover:bg-violet-500/20 text-violet-300 text-xs font-medium transition-all flex items-center gap-1">
                        ↓ Download ▾
                      </button>
                    </div>
                    {downloadOpen && (
                      <div className="absolute right-0 top-10 w-40 rounded-xl border border-white/10 bg-[#0f0f1a] shadow-xl z-50 overflow-hidden">
                        {([['md', '📝 Markdown'], ['html', '🌐 HTML'], ['txt', '📄 Plain Text']] as const).map(([fmt, label]) => (
                          <button key={fmt} onClick={() => downloadAs(fmt)}
                            className="w-full px-4 py-2.5 text-left text-sm text-white/70 hover:bg-white/[0.06] hover:text-white transition-all flex items-center gap-2">
                            {label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="rounded-xl border border-white/5 bg-black/30 p-6 min-h-[350px] overflow-y-auto flex-1">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-4">
                    <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                    <p className="text-sm text-white/40">Tailoring your resume...</p>
                    <p className="text-xs text-white/25">Matching keywords · ATS optimising · Highlighting your best experience</p>
                  </div>
                ) : resume ? (
                  <div className="text-sm text-white/80 leading-relaxed prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: mdToHtml(resume) }} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">✦</div>
                    <p className="text-white/40 text-sm max-w-xs">
                      Click <strong className="text-white/60">⚡ Check job match</strong> first, then generate your tailored resume
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Cover Letter tab */}
          {activeTab === 'cover' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold mb-0.5">Cover Letter</h2>
                  <p className="text-xs text-white/40">Personalised · Avoids clichés · Under 350 words</p>
                </div>
                {coverLetter && <CopyButton text={coverLetter} />}
              </div>
              <div className="rounded-xl border border-white/5 bg-black/30 p-6 min-h-[350px] overflow-y-auto flex-1">
                {coverLetter ? (
                  <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono leading-relaxed">{coverLetter}</pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">✉️</div>
                    <p className="text-white/40 text-sm max-w-xs">
                      Click <strong className="text-white/60">✉️ Cover letter</strong> on the left to generate a personalised cover letter
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Interview Prep tab */}
          {activeTab === 'prep' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold mb-0.5">Interview Prep</h2>
                  <p className="text-xs text-white/40">Questions they'll ask · How to answer · What to ask them</p>
                </div>
                {interviewPrep?.role_title && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300">
                    {interviewPrep.role_title}
                  </span>
                )}
              </div>
              <div className="overflow-y-auto flex-1 min-h-[350px]">
                {interviewPrep?.questions?.length ? (
                  <InterviewPrepPanel prep={interviewPrep} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">🎯</div>
                    <p className="text-white/40 text-sm max-w-xs">
                      Click <strong className="text-white/60">🎯 Interview prep</strong> on the left to get likely questions and how to answer them
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
