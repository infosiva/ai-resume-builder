import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  const { jobDesc, experience, skills } = await req.json();

  const message = await client.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: `You are an expert resume writer. Create a professional, ATS-optimized resume in clean markdown format.
Tailor the resume specifically to the job description provided. Use strong action verbs and quantify achievements.
Format: Name placeholder, Summary, Experience, Skills, Education sections.`,
    messages: [
      {
        role: "user",
        content: `Job Description:\n${jobDesc}\n\nMy Experience:\n${experience}\n\nMy Skills:\n${skills}\n\nGenerate a tailored, professional resume.`,
      },
    ],
  });

  const resume = message.content[0].type === "text" ? message.content[0].text : "";
  return NextResponse.json({ resume });
}
