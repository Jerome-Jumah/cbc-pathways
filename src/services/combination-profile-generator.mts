/**
 * Combination Profile Generator
 *
 * Generates structured educational metadata for a CBC subject combination.
 * Uses Google Gemini (gemini-2.0-flash) when GEMINI_API_KEY is set.
 * Falls back to a deterministic generator when the key is absent.
 *
 * Never generates factual school data — only explanatory combination metadata.
 */

import "dotenv/config";
import { GeneratedCombinationProfile, generatedCombinationProfileSchema } from "../schemas/combination-profile.schema.mjs";
import logger from "../constants/logger.mjs";

const GENERATOR_ID = "gemini-2.0-flash";
const PROMPT_VERSION = "v1";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CombinationGeneratorInput {
  subjects: string[];
  trackName: string;
  pathway: string;
  schoolCount: number;
}

export interface CombinationGeneratorResult {
  profile: GeneratedCombinationProfile;
  generatedBy: string;
  promptVersion: string;
}

// ─── Prompt Builder ──────────────────────────────────────────────────────────

function buildPrompt(input: CombinationGeneratorInput): string {
  return `You are generating educational guidance metadata for a CBC senior school subject combination in Kenya.

Generate structured JSON only. No markdown. No explanatory text outside JSON.

Combination subjects:
${input.subjects.join(", ")}

Track:
${input.trackName}

Pathway:
${input.pathway}

Number of schools offering this combination:
${input.schoolCount}

Rules:
- Do not invent official admission requirements.
- Do not mention universities unless phrased generally.
- Do not claim this is official government guidance.
- Keep language helpful, student-friendly, and accurate.
- Career pathways should be plausible based on subjects.
- Output JSON only — no markdown code blocks, no preamble.

Required JSON shape:
{
  "overview": "string (min 30 chars)",
  "bestFor": "string (min 10 chars)",
  "difficultyLevel": "Low | Medium | High",
  "careerPathways": [
    { "title": "string", "compatibility": "Low | Medium | High" }
  ],
  "keyBenefits": ["string"],
  "subjectDetails": [
    { "subject": "string", "role": "string", "importance": "Core | Supporting | Specialized" }
  ]
}`;
}

// ─── Live AI Generator (Gemini) ───────────────────────────────────────────────

async function generateWithGemini(input: CombinationGeneratorInput): Promise<GeneratedCombinationProfile> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY not set");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GENERATOR_ID}:generateContent?key=${apiKey}`;

  const body = {
    contents: [{ role: "user", parts: [{ text: buildPrompt(input) }] }],
    generationConfig: {
      temperature: 0.4,
      responseMimeType: "application/json",
    },
  };

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Gemini API error ${response.status}: ${text}`);
  }

  const json: any = await response.json();
  const rawText: string = json.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

  // Strip any accidental markdown code fences
  const cleaned = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "").trim();

  const parsed = JSON.parse(cleaned);
  return generatedCombinationProfileSchema.parse(parsed);
}

// ─── Deterministic Fallback ───────────────────────────────────────────────────

function generateDeterministic(input: CombinationGeneratorInput): GeneratedCombinationProfile {
  const { subjects, trackName, pathway, schoolCount } = input;
  const subjectList = subjects.join(", ");
  const availability = schoolCount > 50 ? "widely available" : schoolCount > 10 ? "available in select schools" : "offered in a limited number of schools";

  // Difficulty heuristic: Pure Sciences / Technical = High, Applied / Humanities = Medium, Arts / Sports = Low
  const highTracks = ["pure sciences", "technical studies"];
  const lowTracks = ["arts", "sports"];
  const tn = trackName.toLowerCase();
  const difficultyLevel: "Low" | "Medium" | "High" = highTracks.some(t => tn.includes(t))
    ? "High"
    : lowTracks.some(t => tn.includes(t))
      ? "Low"
      : "Medium";

  return {
    overview: `This ${trackName} combination includes ${subjectList}. It provides learners with a strong foundation in the ${pathway} pathway and is ${availability} across Kenyan senior schools.`,
    bestFor: `Learners interested in ${trackName.toLowerCase()} with a passion for ${subjects[0]} and related fields.`,
    difficultyLevel,
    careerPathways: subjects.slice(0, 4).map((s, i) => ({
      title: `${s}-related Career`,
      compatibility: (["High", "High", "Medium", "Medium"] as const)[i] ?? "Medium",
    })),
    keyBenefits: [
      `Builds expertise in ${subjects[0]} and complementary subjects`,
      `Aligns with the ${pathway} pathway for tertiary progression`,
      `Offered by ${schoolCount} school${schoolCount !== 1 ? "s" : ""} nationally`,
    ],
    subjectDetails: subjects.map((subject, i) => ({
      subject,
      role: i === 0 ? "Primary area of study" : i === 1 ? "Complementary discipline" : "Supporting subject",
      importance: (["Core", "Core", "Supporting", "Specialized"] as const)[i] ?? "Supporting",
    })),
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

export async function generateCombinationProfile(input: CombinationGeneratorInput): Promise<CombinationGeneratorResult> {
  const hasApiKey = Boolean(process.env.GEMINI_API_KEY);

  if (hasApiKey) {
    try {
      logger.info(`Generating combination profile via Gemini for subjects: ${input.subjects.join(", ")}`);
      const profile = await generateWithGemini(input);
      return { profile, generatedBy: GENERATOR_ID, promptVersion: PROMPT_VERSION };
    } catch (err) {
      logger.warn(`Gemini generation failed, falling back to deterministic generator: ${err}`);
    }
  } else {
    logger.info("GEMINI_API_KEY not set — using deterministic combination profile generator");
  }

  const profile = generateDeterministic(input);
  return { profile, generatedBy: "deterministic-v1", promptVersion: PROMPT_VERSION };
}
