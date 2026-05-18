// Question Bank Generator for Prep+
// Run with: node generate-bank.js
// This will generate 500 questions per topic and save to src/questionBank.json

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const TOPICS = [
  // Accounting & Finance
  { cat: "accounting-finance", topic: "Accounting" },
  { cat: "accounting-finance", topic: "Business Finance" },
  { cat: "accounting-finance", topic: "Financial Statements" },
  { cat: "accounting-finance", topic: "Personal Finance & Financial Literacy" },
  { cat: "accounting-finance", topic: "Financial Planning" },
  { cat: "accounting-finance", topic: "Investing & Securities" },
  // Marketing, Sales & CX
  { cat: "marketing-sales", topic: "Marketing" },
  { cat: "marketing-sales", topic: "Marketing Communications" },
  { cat: "marketing-sales", topic: "Social Media Marketing" },
  { cat: "marketing-sales", topic: "Sales & Professional Selling" },
  { cat: "marketing-sales", topic: "Retail Marketing & Merchandising" },
  { cat: "marketing-sales", topic: "Customer Service" },
  // Business Management & Leadership
  { cat: "management-leadership", topic: "Business Management" },
  { cat: "management-leadership", topic: "Leadership & Human Resources" },
  { cat: "management-leadership", topic: "Project Management" },
  { cat: "management-leadership", topic: "Public Administration" },
  { cat: "management-leadership", topic: "Career Development" },
  // Entrepreneurship & Strategy
  { cat: "entrepreneurship", topic: "Entrepreneurship" },
  { cat: "entrepreneurship", topic: "Business Plan Development" },
  { cat: "entrepreneurship", topic: "Startups & Innovation" },
  { cat: "entrepreneurship", topic: "Business Growth Strategy" },
  { cat: "entrepreneurship", topic: "Franchise & Independent Business Plans" },
  { cat: "entrepreneurship", topic: "Case Studies / Business Problem Solving" },
  // Economics & Global Business
  { cat: "economics-global", topic: "Economics" },
  { cat: "economics-global", topic: "International Business" },
  { cat: "economics-global", topic: "Insurance & Risk Management" },
  { cat: "economics-global", topic: "Real Estate" },
  // Hospitality & Events
  { cat: "hospitality", topic: "Hospitality & Event Management" },
  { cat: "hospitality", topic: "Event Planning" },
  { cat: "hospitality", topic: "Sports & Entertainment Management" },
  // Operations & Supply Chain
  { cat: "operations", topic: "Supply Chain Management" },
  { cat: "operations", topic: "Operations & Business Analytics" },
  // Business Technology
  { cat: "technology", topic: "Management Information Systems (MIS)" },
  { cat: "technology", topic: "Data-driven Business Tools" },
];

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const BATCH_SIZE = 10; // Generate 10 questions per API call
const QUESTIONS_PER_DIFFICULTY = 84; // ~250 total (84 × 3 = 252)

async function generateBatch(topic, difficulty, batchNum) {
  const prompt = `You are a DECA/FBLA business competition exam generator.
Generate exactly ${BATCH_SIZE} unique multiple-choice questions about: ${topic}
Difficulty: ${difficulty}
Batch number: ${batchNum} (make sure these are different from previous batches)

Return ONLY a valid JSON array, no markdown, no explanation:
[{"q":"Question text?","options":["A) option","B) option","C) option","D) option"],"answer":"A","explanation":"Brief explanation.","difficulty":"${difficulty}"}]

Rules:
- Questions MUST be relevant to actual DECA and FBLA competition content
- Cover core concepts, definitions, calculations, real-world applications, and scenarios
- Same concept can appear multiple times but worded differently or from a different angle
- All 4 options must be plausible — no obvious wrong answers
- Answer field is just the letter: A, B, C, or D
- Explanations should be educational and specific
- No trivia or obscure facts — focus on what students actually need to know
- Mix question styles: definitions, calculations, scenario-based, application, analysis`;

  const response = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 8000,
    messages: [{ role: "user", content: prompt }],
  });

  const text = response.content[0].text;
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

async function generateTopic(catId, topic) {
  console.log(`\n📚 Generating: ${topic}`);
  const allQuestions = [];

  for (const difficulty of DIFFICULTIES) {
    console.log(`  ${difficulty}: generating ${QUESTIONS_PER_DIFFICULTY} questions...`);
    const batches = Math.ceil(QUESTIONS_PER_DIFFICULTY / BATCH_SIZE);

    for (let i = 0; i < batches; i++) {
      try {
        console.log(`    Batch ${i + 1}/${batches}...`);
        const questions = await generateBatch(topic, difficulty, i + 1);
        allQuestions.push(...questions);
        // Small delay to avoid rate limits
        await new Promise((r) => setTimeout(r, 1500));
      } catch (e) {
        console.error(`    Error on batch ${i + 1}:`, e.message);
        // Wait longer and retry once
        await new Promise((r) => setTimeout(r, 8000));
        try {
          const questions = await generateBatch(topic, difficulty, i + 1);
          allQuestions.push(...questions);
        } catch (e2) {
          console.error(`    Retry failed, skipping batch`);
        }
      }
    }
  }

  console.log(`  ✓ Generated ${allQuestions.length} questions for ${topic}`);
  return allQuestions;
}

async function main() {
  console.log("🚀 Prep+ Question Bank Generator");
  console.log(`Generating questions for ${TOPICS.length} topics...`);
  console.log("This will take a while — go grab a snack!\n");

  // Load existing bank if it exists (so we can resume if interrupted)
  let bank = {};
  if (fs.existsSync("src/questionBank.json")) {
    bank = JSON.parse(fs.readFileSync("src/questionBank.json", "utf8"));
    console.log("Found existing question bank — resuming where we left off.");
  }

  for (const { cat, topic } of TOPICS) {
    const key = `${cat}::${topic}`;
    if (bank[key] && bank[key].length >= 50) {
      console.log(`⏭ Skipping ${topic} (already generated ${bank[key].length} questions)`);
      continue;
    }
    if (bank[key] && bank[key].length < 50) {
      console.log(`🔄 Retrying ${topic} (only ${bank[key].length} questions — needs more)`);
      delete bank[key];
    }

    bank[key] = await generateTopic(cat, topic);

    // Save after each topic in case of interruption
    fs.writeFileSync("src/questionBank.json", JSON.stringify(bank, null, 2));
    console.log(`💾 Saved progress`);
  }

  console.log("\n✅ Done! Question bank saved to src/questionBank.json");
  const total = Object.values(bank).reduce((a, b) => a + b.length, 0);
  console.log(`📊 Total questions: ${total}`);
}

main().catch(console.error);
