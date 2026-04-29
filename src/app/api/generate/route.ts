import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { jobDesc, experience, skills, name, currentTitle, mode } = await req.json();

  if (mode === "analyze") {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1500,
      system: "You are a professional recruiter and ATS expert. Return ONLY valid JSON, no markdown.",
      messages: [{
        role: "user",
        content: `Analyze this job description and candidate profile.

JOB DESCRIPTION:
${jobDesc}

CANDIDATE EXPERIENCE:
${experience}

CANDIDATE SKILLS:
${skills}

Return this JSON:
{
  "role_title": "exact job title from JD",
  "company_type": "startup/enterprise/agency/etc",
  "required_keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6", "keyword7", "keyword8"],
  "nice_to_have": ["keyword1", "keyword2", "keyword3"],
  "matched_keywords": ["keywords the candidate already has"],
  "missing_keywords": ["important keywords the candidate is missing"],
  "match_score": 78,
  "match_label": "Strong Match",
  "key_gaps": ["gap1", "gap2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "job_search_terms": "React Developer remote"
}`,
      }],
    });
    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    try {
      const match = text.match(/\{[\s\S]*\}/);
      return NextResponse.json({ analysis: match ? JSON.parse(match[0]) : {} });
    } catch {
      return NextResponse.json({ analysis: {} });
    }
  }

  if (mode === "cover_letter") {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1200,
      system: `You are an expert career coach and professional writer. Write compelling, personalised cover letters.
Rules:
- 3-4 paragraphs, conversational yet professional
- Opening: grab attention — reference something specific about the role/company
- Middle: connect 2-3 achievements directly to their requirements, use numbers where possible
- Closing: confident call-to-action, express genuine enthusiasm
- Do NOT use generic phrases like "I am writing to apply" or "Please find enclosed"
- Mirror the language/tone of the job description
- Keep under 350 words`,
      messages: [{
        role: "user",
        content: `Write a tailored cover letter for:

CANDIDATE NAME: ${name || "Your Name"}
CURRENT TITLE: ${currentTitle || "Professional"}

JOB DESCRIPTION:
${jobDesc}

MY EXPERIENCE:
${experience}

MY SKILLS:
${skills}

Write a concise, powerful cover letter that shows genuine fit for this specific role.`,
      }],
    });
    const coverLetter = message.content[0].type === "text" ? message.content[0].text : "";
    return NextResponse.json({ coverLetter });
  }

  if (mode === "interview_prep") {
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2000,
      system: "You are an expert interview coach. Return ONLY valid JSON, no markdown.",
      messages: [{
        role: "user",
        content: `Based on this job description and candidate profile, generate interview prep materials.

JOB DESCRIPTION:
${jobDesc}

CANDIDATE EXPERIENCE:
${experience}

CANDIDATE SKILLS:
${skills}

Return this JSON:
{
  "role_title": "job title",
  "questions": [
    {
      "question": "Tell me about a time you...",
      "category": "behavioural|technical|situational|culture",
      "why_asked": "what the interviewer is assessing",
      "answer_framework": "STAR framework hint or key points to cover",
      "sample_answer_start": "Strong opening line for an answer"
    }
  ],
  "red_flags_to_avoid": ["common mistake 1", "common mistake 2", "common mistake 3"],
  "questions_to_ask_them": ["smart question 1", "smart question 2", "smart question 3"],
  "salary_range_hint": "Based on role/location, typical range is..."
}

Generate 8 questions covering: 2 technical, 3 behavioural, 2 situational, 1 culture fit. Make them specific to this exact role.`,
      }],
    });
    const text = message.content[0].type === "text" ? message.content[0].text : "{}";
    try {
      const match = text.match(/\{[\s\S]*\}/);
      return NextResponse.json({ prep: match ? JSON.parse(match[0]) : {} });
    } catch {
      return NextResponse.json({ prep: {} });
    }
  }

  // Generate tailored resume
  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 3000,
    system: `You are an expert resume writer and career coach. Create a professional, ATS-optimized resume.
Rules:
- Use the EXACT keywords from the job description (ATS requires this)
- Start bullet points with strong action verbs (Led, Built, Drove, Increased, Reduced)
- Quantify achievements wherever possible (%, $, users, time saved)
- Match the tone and technical level of the job description
- Format in clean markdown with clear sections
- Highlight skills that directly match job requirements
- Keep it concise: 1 page ideally, 2 pages max`,
    messages: [{
      role: "user",
      content: `Create a tailored resume for this specific role.

CANDIDATE NAME: ${name || "Your Name"}
CURRENT TITLE: ${currentTitle || "Professional"}

JOB DESCRIPTION:
${jobDesc}

MY EXPERIENCE:
${experience}

MY SKILLS:
${skills}

Generate a complete, tailored resume that:
1. Uses exact keywords from the job description for ATS
2. Highlights the most relevant experience for THIS role
3. Quantifies achievements
4. Includes a strong summary tailored to this specific job
5. Lists skills in order of relevance to the job description`,
    }],
  });

  const resume = message.content[0].type === "text" ? message.content[0].text : "";
  return NextResponse.json({ resume });
}
