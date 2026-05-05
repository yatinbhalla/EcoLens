import { GoogleGenAI, Type } from "@google/genai";
import { ProductIdea, SustainabilityAnalysis } from "../types";

let ai: GoogleGenAI | null = null;
export function getAI() {
  if (!ai) {
    // Note: ensure process.env.GEMINI_API_KEY is available in vite.config.ts define
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
  }
  return ai;
}

export async function analyzeProductIdea(idea: ProductIdea, onProgress?: (msg: string) => void): Promise<SustainabilityAnalysis> {
  const genAI = getAI();
  
  if (onProgress) onProgress("Initializing AI analyst...");

  const prompt = `You are a senior sustainability research analyst conducting an exhaustively detailed Life Cycle Assessment (LCA). 
Analyze the following product idea deeply, starting from the absolute base source of raw materials (e.g., planting seeds, water usage for agriculture, mining/extraction processes, refining of metals/oil) through all intermediate manufacturing stages, transportation, use phase, and complete end-of-life disposal or recycling.
You MUST directly compare this product against its most common conventional alternative (e.g., if it's a bamboo toothbrush, explicitly compare its lifecycle from the base source against a plastic toothbrush) across all lifecycle stages.
Provide highly specific, actionable, and modular design improvements (e.g., offering changeable bristles for a toothbrush to extend product life, or modular electronics repairs) to maximize circularity. Provide detailed rationale for exactly how these suggested improvements impact the lifecycle and carbon footprint.
Your assessment must be credible, solution-focused, extremely detailed, honest about uncertainties, and use scientific data where applicable. You must explicitly state your methodology for estimations when hard data is scarce.
For digital products, adapt lifecycle stages correctly (e.g. server energy, data transfer, device load).

Product Idea Name: ${idea.name}
Description: ${idea.description}
${idea.category ? `Category: ${idea.category}` : ''}
${idea.materials ? `Materials: ${idea.materials}` : ''}
${idea.productionLocation ? `Production Location: ${idea.productionLocation}` : ''}
${idea.targetMarket ? `Target Market: ${idea.targetMarket}` : ''}
${idea.intendedLifespan ? `IntendedLifespan: ${idea.intendedLifespan}` : ''}
${idea.distributionChannel ? `Distribution Channel: ${idea.distributionChannel}` : ''}

You must search the web to find realistic emissions factors, relevant UN SDG targets, circular economy strategies, and related news or reports.
Return ONLY valid JSON.
The JSON must adhere EXACTLY to this schema:
{
  "overallScore": 0-100,
  "verdict": "A comprehensive introductory summary of the environmental viability of this product.",
  "comparativeAnalysis": "An extremely detailed, multi-paragraph deep-dive comparing the complete lifecycle of this product to its conventional alternative. Discuss extraction (seeds, water, oil, mining), processing, transport, and end-of-life. Explicitly state the estimation methodology. Be exhaustive.",
  "carbon": {
    "score": 0-100,
    "totalKg": number (estimated total kg CO2e over lifetime),
    "uncertaintyRange": string (e.g. "\\u00b120%"),
    "stages": [
      { "name": "Raw Materials", "kg": number, "description": "Highly detailed breakdown of base resources, water usage, agriculture/mining, seed planting, refining..." },
      { "name": "Manufacturing", "kg": number, "description": "..." },
      { "name": "Packaging", "kg": number, "description": "..." },
      { "name": "Distribution", "kg": number, "description": "..." },
      { "name": "Use Phase", "kg": number, "description": "..." },
      { "name": "End-of-Life", "kg": number, "description": "..." }
    ]
  },
  "sdgs": {
    "score": 0-100,
    "supported": [
      { "goalNumber": 1-17, "targets": ["12.5", "13.3"], "explanation": "Detailed explanation..." }
    ]
  },
  "sixRs": {
    "score": 0-100,
    "refuse": { "score": 0-10, "reason": "..." },
    "reduce": { "score": 0-10, "reason": "..." },
    "reuse": { "score": 0-10, "reason": "..." },
    "repair": { "score": 0-10, "reason": "..." },
    "repurpose": { "score": 0-10, "reason": "..." },
    "recycle": { "score": 0-10, "reason": "..." }
  },
  "threePillars": {
    "score": 0-100,
    "environmental": { "score": 0-10, "reason": "..." },
    "social": { "score": 0-10, "reason": "..." },
    "economic": { "score": 0-10, "reason": "..." }
  },
  "improvements": [
    { "target": "Specific modular or systematic change", "reason": "Extremely detailed explanation of why it improves sustainability and the lifecycle benefits", "impact": "Estimated impact summary" }
  ],
  "citations": [
    { "id": 1, "title": "Source name", "url": "https://...", "snippet": "Excerpt" }
  ]
}

Ensure you include in-text citations like [1] or [2] inside your descriptions, comparativeAnalysis, and verdicts matching your citations array.
If no specific data is available, offer your best educated estimate based on deep domain knowledge and note it in uncertaintyRange.
Your descriptions must be comprehensive and not brief summaries. Give specific examples.`;

  if (onProgress) onProgress("Researching stages, materials, and processes...");

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        temperature: 0.2, // low temp for analytical output
      }
    });

    if (onProgress) onProgress("Compiling citations and formatting report...");
    
    // Attempt to parse JSON
    const text = response.text || "{}";
    let parsed: SustainabilityAnalysis;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      console.error("Failed to parse JSON response:", text);
      throw new Error("AI returned invalid JSON.");
    }
    
    return parsed;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
}
