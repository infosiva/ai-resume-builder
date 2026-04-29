import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { jobDesc, experience, skills, name, currentTitle, mode } = await req.json();

  if (mode === "analyze") {
    // Analyze job spec and profile match
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
