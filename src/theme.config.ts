/**
 * theme.config.ts — swap this to restyle the entire app
 * Core logic in page.tsx / components never changes.
 * Only visual identity lives here.
 *
 * 2026 Design: Aurora Editorial — light + dark hybrid, bento grid, micro-interactions
 */

export const theme = {
  // ── Identity ─────────────────────────────────────────────
  name:    'ResumeVault',
  tagline: 'Paste a job spec. Get hired.',
  sub:     'AI-powered resume, cover letter & interview prep — in 60 seconds',

  // ── Visual style ─────────────────────────────────────────
  // Options: 'editorial' | 'aurora' | 'terminal' | 'glass' | 'bento'
  style: 'aurora' as const,

  // ── Colour tokens ─────────────────────────────────────────
  bg:          '#09090b',           // near-black zinc
  bgCard:      'rgba(255,255,255,0.03)',
  bgCardHover: 'rgba(255,255,255,0.06)',
  border:      'rgba(255,255,255,0.08)',
  borderHover: 'rgba(255,255,255,0.16)',

  accent1:     '#f97316',           // orange — energy, career drive
  accent2:     '#fb923c',
  accentText:  '#fdba74',
  accentGlow:  'rgba(249,115,22,0.15)',

  // Aurora blobs (fixed position, pointer-events none)
  blobs: [
    { x: '-10%', y: '-20%', w: '600px', h: '500px', color: 'rgba(249,115,22,0.12)', blur: '140px' },
    { x: '60%',  y: '40%',  w: '400px', h: '400px', color: 'rgba(234,88,12,0.08)',  blur: '120px' },
    { x: '20%',  y: '80%',  w: '300px', h: '300px', color: 'rgba(251,146,60,0.06)', blur: '100px' },
  ],

  // ── Typography ────────────────────────────────────────────
  fontHeading: "'Inter', sans-serif",
  fontBody:    "'Inter', sans-serif",
  fontMono:    "'JetBrains Mono', monospace",

  // ── Feature badges shown in hero ─────────────────────────
  badges: [
    '✓ ATS keyword match',
    '✓ Match score',
    '✓ Tailored resume',
    '✓ Cover letter',
    '✓ Interview prep',
    '✓ Salary insight',
  ],

  // ── Steps strip ──────────────────────────────────────────
  steps: [
    { n: '01', label: 'Paste job spec' },
    { n: '02', label: 'Check match score' },
    { n: '03', label: 'Generate resume' },
    { n: '04', label: 'Write cover letter' },
    { n: '05', label: 'Ace the interview' },
  ],

  // ── Pricing ───────────────────────────────────────────────
  pricing: [
    {
      name: 'Free', price: '$0', sub: 'forever', highlight: false,
      features: ['3 AI uses / day', 'Job match score', 'ATS keyword analysis', 'Resume generator', 'Cover letter', 'Interview prep'],
      cta: 'Start free',
    },
    {
      name: 'Pro', price: '$15', sub: '/month', highlight: true,
      features: ['Unlimited AI uses', 'Full interview prep', 'Salary range insight', 'ATS score checker', 'Job alerts by email', 'Priority AI speed'],
      cta: 'Start free trial →',
    },
  ],

  // ── SEO ───────────────────────────────────────────────────
  metaTitle:       'ResumeVault — AI Resume Builder & Job Match',
  metaDescription: 'Paste a job description. AI scores your match, finds keyword gaps, and crafts a tailored resume, cover letter & interview prep in 60 seconds.',
}

export type Theme = typeof theme
export default theme
