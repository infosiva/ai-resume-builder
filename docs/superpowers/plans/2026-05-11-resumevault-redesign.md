# ResumeVault Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Two-column live-preview layout with career-ops-style paper template (Space Grotesk + DM Sans, cyan→purple gradient header), JD keyword gap analysis, AI bullet suggestions with approve/reject, and ATS score ring overlay.

**Architecture:** Split page.tsx into a left form panel and right live preview panel. Add `KeywordBar` component. Update `ResumeForm` to emit parsed JD keywords. Update `ResumePreview` to render paper template with AI-generated bullet suggestions inline. Add `/api/parse-jd` route. Update `/api/build-resume` to return `{ resume, suggestions }`.

**Tech Stack:** Next.js 15 App Router, React, Tailwind CSS, Space Grotesk + DM Sans (next/font/google), Groq→Gemini→Anthropic fallback, TypeScript

---

## File Map

| File | Action | Responsibility |
|------|--------|---------------|
| `src/app/page.tsx` | Modify | Two-column layout, JD keywords state, suggestion state, Generate All |
| `src/components/ResumeForm.tsx` | Modify | JD parse on blur, keyword chips, 4 action tiles layout |
| `src/components/ResumePreview.tsx` | Modify | Paper template: Space Grotesk/DM Sans, cyan→purple header, ATS ring, AI bullet chips |
| `src/components/KeywordBar.tsx` | Create | Match % progress bar + hit/miss chips |
| `src/app/api/parse-jd/route.ts` | Create | Extract company, role, keywords from JD via Groq |
| `src/app/api/build-resume/route.ts` | Modify | Return `{ resume: string, suggestions: Suggestion[] }` |

---

### Task 1: Create `/api/parse-jd` route

**Files:**
- Create: `src/app/api/parse-jd/route.ts`

- [ ] **Step 1: Create the route**

```typescript
// src/app/api/parse-jd/route.ts
import { NextRequest, NextResponse } from 'next/server'

interface ParsedJD {
  company:  string
  role:     string
  keywords: string[]  // top 12 technical/skill keywords
}

export async function POST(req: NextRequest) {
  let body: { jobDesc?: string }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Bad JSON' }, { status: 400 }) }
  if (!body.jobDesc?.trim()) return NextResponse.json({ error: 'jobDesc required' }, { status: 400 })

  const prompt = `Extract from this job description:
1. company name (or "Unknown" if not found)
2. job role/title
3. top 12 skill/technology keywords (tools, languages, frameworks, methodologies)

Reply ONLY with valid JSON, no markdown, no explanation:
{"company":"...", "role":"...", "keywords":["...","...",...]}

Job description:
${body.jobDesc.slice(0, 2000)}`

  const groqKey = process.env.GROQ_API_KEY
  if (groqKey) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 200,
          temperature: 0,
        })
      })
      if (res.ok) {
        const d = await res.json()
        const text = d.choices?.[0]?.message?.content ?? ''
        const parsed: ParsedJD = JSON.parse(text.replace(/```json|```/g, '').trim())
        return NextResponse.json(parsed)
      }
    } catch {}
  }

  const geminiKey = process.env.GEMINI_API_KEY
  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
        }
      )
      if (res.ok) {
        const d = await res.json()
        const text = d.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
        const parsed: ParsedJD = JSON.parse(text.replace(/```json|```/g, '').trim())
        return NextResponse.json(parsed)
      }
    } catch {}
  }

  // Graceful fallback — return empty so UI still works
  return NextResponse.json({ company: '', role: '', keywords: [] })
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/sivaprakasam/projects/agents/ai-resume-builder
git add src/app/api/parse-jd/route.ts
git commit -m "feat: add /api/parse-jd route — extract company, role, keywords via Groq"
```

---

### Task 2: Update `/api/build-resume` to return suggestions

**Files:**
- Modify: `src/app/api/build-resume/route.ts`

- [ ] **Step 1: Read current route**

```bash
head -60 /Users/sivaprakasam/projects/agents/ai-resume-builder/src/app/api/build-resume/route.ts
```

- [ ] **Step 2: Update prompt to return structured JSON**

Find the prompt string in the route and update it to request a JSON response with `resume` + `suggestions`:

```typescript
const prompt = `You are an expert ATS-optimised resume writer.

Given the candidate info below, produce:
1. A complete ATS-ready resume as plain text with clear sections (SUMMARY, EXPERIENCE, SKILLS, EDUCATION)
2. Up to 5 improvement suggestions — each is a specific bullet or skill to add

Reply ONLY with valid JSON (no markdown):
{
  "resume": "full resume text here",
  "suggestions": [
    { "section": "EXPERIENCE", "replacement": "• Led migration of monolith to microservices, reducing deploy time by 60%" },
    { "section": "SKILLS", "replacement": "Kubernetes" }
  ]
}

Candidate:
Name: {{NAME}}
Current title: {{TITLE}}
Experience: {{EXPERIENCE}}
Skills: {{SKILLS}}
Target job: {{JOB_DESC}}`
```

Replace `{{NAME}}`, `{{TITLE}}`, `{{EXPERIENCE}}`, `{{SKILLS}}`, `{{JOB_DESC}}` with the actual interpolated values from the existing route handler.

Also update the response parsing from returning raw text to:
```typescript
// After getting AI response text:
let parsed: { resume: string; suggestions: { section: string; replacement: string }[] }
try {
  parsed = JSON.parse(text.replace(/```json|```/g, '').trim())
} catch {
  // If AI didn't return valid JSON, wrap raw text
  parsed = { resume: text, suggestions: [] }
}
return NextResponse.json(parsed)
```

- [ ] **Step 3: Build check**

```bash
npx tsc --noEmit 2>&1 | head -20
```
Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add src/app/api/build-resume/route.ts
git commit -m "feat: build-resume returns {resume, suggestions} JSON"
```

---

### Task 3: Create `KeywordBar` component

**Files:**
- Create: `src/components/KeywordBar.tsx`

- [ ] **Step 1: Create component**

```typescript
// src/components/KeywordBar.tsx
interface Props {
  keywords: string[]
  userText: string  // combined experience + skills text
}

export default function KeywordBar({ keywords, userText }: Props) {
  if (keywords.length === 0) return null

  const lower = userText.toLowerCase()
  const hits  = keywords.filter(k => lower.includes(k.toLowerCase()))
  const misses = keywords.filter(k => !lower.includes(k.toLowerCase()))
  const pct   = Math.round((hits.length / keywords.length) * 100)

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-white/50">JD keyword match</span>
        <span className={`font-semibold ${pct >= 70 ? 'text-green-400' : pct >= 45 ? 'text-amber-400' : 'text-red-400'}`}>
          {pct}%
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${pct >= 70 ? 'bg-green-500' : pct >= 45 ? 'bg-amber-500' : 'bg-red-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-1">
        {hits.map(k => (
          <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 border border-green-500/25 text-green-300">
            ✓ {k}
          </span>
        ))}
        {misses.map(k => (
          <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-300/70">
            ✗ {k}
          </span>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/KeywordBar.tsx
git commit -m "feat: KeywordBar component — match % + hit/miss chips"
```

---

### Task 4: Update `ResumeForm` with JD parse + keyword bar

**Files:**
- Modify: `src/components/ResumeForm.tsx`

- [ ] **Step 1: Read current form top (already read above — proceed)**

- [ ] **Step 2: Add JD parse state and onBlur handler**

After the existing `useState` declarations, add:
```typescript
const [parsedJD, setParsedJD] = useState<{ company: string; role: string; keywords: string[] } | null>(null)
const [parsingJD, setParsingJD] = useState(false)
```

Add `onBlur` handler for the jobDesc textarea:
```typescript
async function handleJDBlur() {
  if (!jobDesc.trim() || jobDesc.length < 50) return
  setParsingJD(true)
  try {
    const res = await fetch('/api/parse-jd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobDesc })
    })
    if (res.ok) setParsedJD(await res.json())
  } catch {}
  setParsingJD(false)
}
```

- [ ] **Step 3: Add parsed JD display below jobDesc textarea**

After the jobDesc `</textarea>` closing tag, add:
```tsx
{parsingJD && (
  <div className="text-xs text-white/30 mt-1 flex items-center gap-1.5">
    <div className="w-2.5 h-2.5 rounded-full border border-white/30 border-t-transparent animate-spin" />
    Parsing job description...
  </div>
)}
{parsedJD && (parsedJD.company || parsedJD.role) && (
  <div className="mt-2 text-xs text-white/50 bg-white/[0.04] rounded-lg px-3 py-2">
    {parsedJD.company && <span className="text-white/70 font-medium">{parsedJD.company}</span>}
    {parsedJD.company && parsedJD.role && <span className="text-white/30"> · </span>}
    {parsedJD.role && <span>{parsedJD.role}</span>}
  </div>
)}
{parsedJD && parsedJD.keywords.length > 0 && (
  <KeywordBar
    keywords={parsedJD.keywords}
    userText={`${experience} ${skills}`}
  />
)}
```

- [ ] **Step 4: Add `onBlur={handleJDBlur}` to jobDesc textarea element**

Find the jobDesc `<textarea` and add `onBlur={handleJDBlur}` as a prop.

- [ ] **Step 5: Import KeywordBar at top of ResumeForm.tsx**

```typescript
import KeywordBar from './KeywordBar'
```

- [ ] **Step 6: Build check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 7: Commit**

```bash
git add src/components/ResumeForm.tsx
git commit -m "feat: ResumeForm — JD parse on blur, keyword bar with hit/miss chips"
```

---

### Task 5: Update `ResumePreview` — paper template + AI suggestions

**Files:**
- Modify: `src/components/ResumePreview.tsx`

- [ ] **Step 1: Read current ResumePreview**

```bash
cat /Users/sivaprakasam/projects/agents/ai-resume-builder/src/components/ResumePreview.tsx
```

- [ ] **Step 2: Add font imports to layout or globals**

In `src/app/layout.tsx`, add font loading:
```typescript
import { Space_Grotesk, DM_Sans } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-space-grotesk',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-sans',
})
```

Add the variables to the `<html>` or `<body>` className:
```typescript
<body className={`${spaceGrotesk.variable} ${dmSans.variable} ...existing classes`}>
```

- [ ] **Step 3: Add `Suggestion` interface and accept it as prop**

In `ResumePreview.tsx`, add after existing interfaces:
```typescript
export interface Suggestion {
  section: string
  replacement: string
}
```

Update Props interface to accept suggestions:
```typescript
interface Props {
  resume:      string
  coverLetter: string
  // ... existing props
  suggestions?: Suggestion[]
  onApproveSuggestion?: (s: Suggestion) => void
  onSkipSuggestion?:   (s: Suggestion) => void
}
```

- [ ] **Step 4: Replace paper render in Resume Preview tab**

Find the section that renders `resume` text (likely a `<pre>` or `<div>` with whitespace-pre) and replace with the paper component:

```tsx
{/* Paper */}
<div
  className="bg-white rounded-lg shadow-2xl p-8 relative overflow-hidden"
  style={{ fontFamily: 'var(--font-dm-sans), system-ui, sans-serif', color: '#1a1a2e', minHeight: '600px' }}
>
  {/* ATS score ring — top right overlay */}
  {atsScore !== undefined && (
    <div className="absolute top-6 right-6">
      <svg width="56" height="56" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r="22" fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <circle
          cx="28" cy="28" r="22" fill="none"
          stroke={atsScore >= 80 ? '#0d9488' : atsScore >= 60 ? '#f59e0b' : '#ef4444'}
          strokeWidth="4"
          strokeDasharray={`${(atsScore / 100) * 138.2} 138.2`}
          strokeLinecap="round"
          transform="rotate(-90 28 28)"
        />
        <text x="28" y="33" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1a1a2e">{atsScore}</text>
      </svg>
      <div className="text-center text-xs text-gray-400 mt-0.5">ATS</div>
    </div>
  )}

  {/* Header: name + gradient underline */}
  {candidateName && (
    <div className="mb-4">
      <h1 style={{ fontFamily: 'var(--font-space-grotesk), system-ui', fontWeight: 700, fontSize: '1.75rem', color: '#0f172a', marginBottom: '4px' }}>
        {candidateName}
      </h1>
      <div style={{
        height: '3px', width: '100%', borderRadius: '2px',
        background: 'linear-gradient(90deg, hsl(187,74%,32%), hsl(270,70%,45%))'
      }} />
    </div>
  )}

  {/* Resume body — render sections */}
  <div className="mt-4 space-y-3 text-sm leading-relaxed" style={{ whiteSpace: 'pre-wrap' }}>
    {resume}
  </div>

  {/* AI suggestions */}
  {suggestions && suggestions.length > 0 && (
    <div className="mt-4 space-y-2 border-t border-dashed border-purple-200 pt-4">
      <div className="text-xs font-semibold text-purple-600 mb-2">✨ AI suggestions — click to approve</div>
      {suggestions.map((s, i) => (
        <div key={i} className="flex items-start gap-2 bg-purple-50 border border-purple-200 rounded-lg px-3 py-2">
          <div className="flex-1 text-xs text-purple-700 italic">{s.section}: {s.replacement}</div>
          <button
            onClick={() => onApproveSuggestion?.(s)}
            className="text-xs px-2 py-0.5 rounded bg-purple-600 text-white hover:bg-purple-700 transition-colors flex-shrink-0"
          >
            ✓
          </button>
          <button
            onClick={() => onSkipSuggestion?.(s)}
            className="text-xs px-2 py-0.5 rounded bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors flex-shrink-0"
          >
            ✗
          </button>
        </div>
      ))}
    </div>
  )}
</div>
```

- [ ] **Step 5: Build check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ResumePreview.tsx src/app/layout.tsx
git commit -m "feat: ResumePreview paper template — Space Grotesk header, gradient, ATS ring, AI suggestion chips"
```

---

### Task 6: Update `page.tsx` — two-column layout + suggestion state

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add suggestion state**

In the main page component, add:
```typescript
const [suggestions, setSuggestions] = useState<import('@/components/ResumePreview').Suggestion[]>([])
```

- [ ] **Step 2: Update `onGenerate` handler to parse suggestions from new API response**

Currently `onGenerate` receives a `string`. Update ResumeForm's `handleGenerate` to parse `{ resume, suggestions }` from the API response and call two callbacks:
```typescript
// In ResumeForm.tsx handleGenerate, change:
// OLD: onGenerate(data.resume ?? data)
// NEW:
onGenerate(data.resume ?? (typeof data === 'string' ? data : ''))
if (data.suggestions) onSuggestions(data.suggestions)
```

Add `onSuggestions` to ResumeForm Props:
```typescript
onSuggestions?: (s: Suggestion[]) => void
```

Pass it in page.tsx:
```tsx
<ResumeForm
  onGenerate={r => setResume(r)}
  onSuggestions={s => setSuggestions(s)}
  ...other props
/>
```

- [ ] **Step 3: Add approve/skip handlers**

```typescript
function approveSuggestion(s: Suggestion) {
  setResume(prev => `${prev}\n\n[${s.section}] ${s.replacement}`)
  setSuggestions(prev => prev.filter(x => x !== s))
}

function skipSuggestion(s: Suggestion) {
  setSuggestions(prev => prev.filter(x => x !== s))
}
```

- [ ] **Step 4: Switch page layout to two-column**

Find the outermost layout wrapper in page.tsx and make it a grid/flex two-column at `md:` breakpoint:

```tsx
{/* Two column body — show only when resume tab active */}
{resume && (
  <div className="max-w-6xl mx-auto px-4 pb-16">
    <div className="md:grid md:grid-cols-[380px_1fr] md:gap-8 space-y-8 md:space-y-0">
      {/* Left: form */}
      <div>
        <ResumeForm ... />
      </div>
      {/* Right: preview */}
      <div>
        <ResumePreview
          resume={resume}
          suggestions={suggestions}
          onApproveSuggestion={approveSuggestion}
          onSkipSuggestion={skipSuggestion}
          candidateName={savedSession?.name ?? ''}
          atsScore={analysis?.match_score}
          ...other props
        />
      </div>
    </div>
  </div>
)}
```

- [ ] **Step 5: Build check + dev test**

```bash
npx tsc --noEmit 2>&1 | head -20
npm run dev &
sleep 5 && curl -s http://localhost:3000 | grep -o '<title>[^<]*</title>'
```

- [ ] **Step 6: Commit**

```bash
git add src/app/page.tsx src/components/ResumeForm.tsx
git commit -m "feat: two-column layout, suggestion state, approve/skip handlers"
```
