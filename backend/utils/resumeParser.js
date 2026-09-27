// backend/utils/resumeParser.js
import fs from "fs";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const extractResumeText = async (filePath, mimetype) => {
  const buffer = fs.readFileSync(filePath);

  if (mimetype === "application/pdf") {
    const parser = new PDFParse({ data: new Uint8Array(buffer) });
    const result = await parser.getText();
    return result.pages.map((p) => p.text).join("\n");
  }

  if (
    mimetype ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  throw new Error("Unsupported resume file type for parsing");
};

const EXTRACTION_PROMPT = `You are extracting structured data from a resume. Read the resume text below and return ONLY a JSON object (no markdown fences, no commentary) with exactly this shape. Omit or null out anything you can't find evidence for — never invent data:

{
  "headline": string | null,
  "bio": string | null,
  "currentPosition": string | null,
  "experienceYears": number | null,
  "skills": string[],
  "experience": [{ "company": string, "position": string, "startDate": string|null, "endDate": string|null, "description": string|null }],
  "education": [{ "degree": string, "institution": string, "startDate": string|null, "endDate": string|null }],
  "projects": [{ "name": string, "description": string|null, "technologies": string[], "link": string|null }],
  "achievements": [{ "title": string, "organization": string|null, "year": number|null, "description": string|null }],
  "certifications": [{ "name": string, "issuer": string|null, "issueDate": string|null, "credentialUrl": string|null }],
  "github": string | null,
  "linkedin": string | null,
  "portfolio": string | null
}

Use ISO dates (YYYY-MM-DD); if only a year is given, use YYYY-01-01.

Resume text:
"""
{{RESUME_TEXT}}
"""`;

export const parseResumeWithAI = async (resumeText) => {
  const prompt = EXTRACTION_PROMPT.replace(
    "{{RESUME_TEXT}}",
    resumeText.slice(0, 15000) // keep prompt bounded
  );

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json", // asks Gemini to return raw JSON, no fences
    },
  });

  const rawText = response.text;

  if (!rawText) {
    throw new Error("No response from AI parser");
  }

  const cleaned = rawText.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error("Failed to parse AI JSON:", cleaned);
    throw new Error("Could not parse resume data");
  }
};