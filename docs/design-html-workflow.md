# /design-html Workflow — ai-resume-builder

This document describes the interactive Claude design workflow for applying
Claude-generated HTML/CSS polish to the ai-resume-builder (resumevault.app).

## When to run

Run this workflow when:
- Starting a new UI pass on the builder or landing page
- The Playwright smoke test flags a CTA visibility issue
- DESIGN.md is updated with a new design system brief

## Pre-requisites

1. Be in a Claude Code session with the `superpowers` skill set loaded.
2. Have the current `src/app/page.tsx` and `src/app/globals.css` open for reference.
3. Know the target page: landing (`/`) or builder UI (`/` after interaction).

## Step-by-step

### 1. Read DESIGN.md

```bash
cat /Users/sivaprakasam/projects/agents/ai-resume-builder/DESIGN.md
```

Note the design system match (Apple), layout archetype (CareerPortfolio), and Stitch prompt. These guide the design brief.

### 2. Invoke the /design-html skill

In Claude Code, run:

```
/design-html
```

When prompted for the brief, paste the following template (fill in the bracketed sections from DESIGN.md):

```
Product: AI Resume Builder (resumevault.app)
Design system: Apple — clean white space, SF Pro-style typography, subtle depth, no gradients
Layout archetype: CareerPortfolio — hero with credential proof, two-column builder, preview pane
Existing stack: Next.js 15, Tailwind v4, liquid-glass globals.css already applied

Target section: [landing hero OR builder two-column layout — pick one per run]

Requirements:
- Hero: large H1 "Land your next role with AI", sub-headline, ShimmerButton CTA "Build my resume free"
- Social proof strip: 3 stat cards (ATS score avg 94%, 10k+ resumes built, 2min to first draft)
- Trust signals: "No signup needed" badge, "Used by engineers at [Google / Meta / Amazon]"
- Builder: left column = form fields (Name, Job title, Experience textarea, Skills chips), right column = live resume preview with PDF download button
- Color palette: white bg, #1d1d1f text, #0071e3 CTA blue, subtle #f5f5f7 section backgrounds
- No emojis in the design output
- Output: a single self-contained HTML file with inline Tailwind classes
```

### 3. Review the HTML output

The skill outputs a full HTML mockup. Review for:
- CTA button is clearly visible (the Playwright smoke test checks this)
- H1 is present and prominent
- No horizontal overflow at 375px width (open browser DevTools → 375px viewport)
- Matches Apple design system feel (clean, no gradients, proper spacing)

### 4. Convert HTML → React components

For each distinct section in the HTML output:

1. Create a new file in `src/components/sections/`:
   - `HeroSection.tsx` — hero + CTA + social proof
   - `BuilderLayout.tsx` — two-column builder + preview
   - `TrustStrip.tsx` — stat cards + trust badges

2. Copy the HTML for that section into the component.
3. Convert `class=` → `className=`.
4. Replace hardcoded text with props where the value may change.
5. Wrap interactive elements in `'use client'` if they use state.

### 5. Update src/app/page.tsx

Replace the current hero/builder JSX with the new section components:

```tsx
import { HeroSection } from '@/components/sections/HeroSection'
import { TrustStrip } from '@/components/sections/TrustStrip'
import { BuilderLayout } from '@/components/sections/BuilderLayout'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TrustStrip />
      <BuilderLayout />
    </main>
  )
}
```

### 6. Run Playwright smoke test to verify

```bash
cd /Users/sivaprakasam/projects/agents/ai-resume-builder
npm run dev &
sleep 5
BASE_URL=http://localhost:3000 npm run test:smoke
kill %1
```

All 5 tests must pass before committing.

### 7. Commit

```bash
git add src/app/page.tsx src/components/sections/
git commit -m "design: apply /design-html Apple CareerPortfolio layout to landing"
git push origin main
```

## Notes

- Run this workflow once per section, not the entire page at once
- The /design-html skill works best with concrete colour codes and layout descriptions
- After commit, the GitHub Actions QA workflow will run automatically
