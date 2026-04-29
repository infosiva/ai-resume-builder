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
  resume: string | null;
  loading: boolean;
  analysis: Analysis | null;
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

// Convert markdown to simple HTML for display + download
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

export default function ResumePreview({ resume, loading, analysis }: Props) {
  const [downloadOpen, setDownloadOpen] = useState(false);

  function downloadAs(format: 'md' | 'html' | 'txt') {
    if (!resume) return;
    let content = resume;
    let mime = 'text/plain';
    let ext = format;

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
              <p className="text-[10px] text-white/30 mt-2 text-center">Click a link to search for jobs matching your profile</p>
            </div>
          )}
        </div>
      )}

      {/* Resume preview */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 flex flex-col">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-1">Tailored Resume</h2>
            <p className="text-sm text-white/40">ATS-optimised · Keywords matched</p>
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

        <div className="flex-1 rounded-xl border border-white/5 bg-black/30 p-6 min-h-[400px] overflow-y-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
              <p className="text-sm text-white/40">Tailoring your resume...</p>
              <p className="text-xs text-white/25">Matching keywords · ATS optimising · Highlighting your best experience</p>
            </div>
          ) : resume ? (
            <pre className="text-sm text-white/80 whitespace-pre-wrap font-mono leading-relaxed">{resume}</pre>
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-3xl">✦</div>
              <p className="text-white/40 text-sm max-w-xs">
                Click <strong className="text-white/60">⚡ Check job match</strong> first to see your score, then generate your tailored resume
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
