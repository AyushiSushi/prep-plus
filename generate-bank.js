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
const BATCH_SIZE = 10;
const QUESTIONS_PER_DIFFICULTY = 84; // ~250 total

async function generateBatch(topic, difficulty, batchNum) {
  const diffGuide = {
    Easy: "vocabulary definitions, basic concept identification, simple 'what is' questions. One sentence max per question. Example: 'What term describes the process of buying and selling goods between countries?' or 'Which of the following is an example of a variable cost?'",
    Medium: "application of concepts, short scenarios (one sentence), identifying correct terms from descriptions. Example: 'A business sells more products during the holiday season. This is an example of which type of demand?' or 'Which pricing strategy involves setting a low initial price to gain market share?'",
    Hard: "analysis and multi-concept questions, still concise. Example: 'Which of the following would MOST likely cause a decrease in consumer demand?' or 'A company increases its advertising budget by 20% and sees a 5% increase in sales. What does this suggest about the campaign?'"
  };

  const prompt = `You are a DECA and FBLA business competition exam question writer.

Generate exactly ${BATCH_SIZE} multiple-choice questions about: ${topic}
Difficulty: ${difficulty}
Batch: ${batchNum} — make questions different from typical batches

STYLE GUIDE — this is critical:
- Questions must match the style of real DECA/FBLA written exams
- ${diffGuide[difficulty]}
- Questions should be SHORT — 1-2 sentences maximum
- No lengthy multi-paragraph scenarios
- Focus on: vocabulary, definitions, concept identification, short applications
- All 4 answer choices must be plausible and similar in length
- Wrong answers should be common misconceptions, not obviously wrong
- Answer field is ONLY the letter: A, B, C, or D

Return ONLY a valid JSON array, no markdown:
[{"q":"Short question here?","options":["A) option","B) option","C) option","D) option"],"answer":"A","explanation":"One sentence explanation.","difficulty":"${difficulty}"}]`;

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

  // Start fresh but save a backup of old bank
  let bank = {};
  const newBankPath = "src/questionBank.json";
  const inProgressPath = "src/questionBank_inprogress.json";

  // Resume from in-progress file if it exists
  if (fs.existsSync(inProgressPath)) {
    bank = JSON.parse(fs.readFileSync(inProgressPath, "utf8"));
    console.log(`Resuming in-progress generation (${Object.keys(bank).length} topics done)...\n`);
  } else {
    console.log("Starting fresh with improved DECA/FBLA style questions...\n");
  }

  for (const { cat, topic } of TOPICS) {
    const key = `${cat}::${topic}`;
    if (bank[key] && bank[key].length >= 50) {
      console.log(`⏭ Skipping ${topic} (already generated ${bank[key].length} questions)`);
      continue;
    }

    bank[key] = await generateTopic(cat, topic);

    // Save to in-progress file after each topic
    fs.writeFileSync(inProgressPath, JSON.stringify(bank, null, 2));
    console.log(`💾 Saved progress`);

    // Save after each topic in case of interruption
    fs.writeFileSync("src/questionBank.json", JSON.stringify(bank, null, 2));
    console.log(`💾 Saved progress`);
  }

  // Save final bank and clean up in-progress file
  fs.writeFileSync(newBankPath, JSON.stringify(bank, null, 2));
  if (fs.existsSync(inProgressPath)) fs.unlinkSync(inProgressPath);
  console.log("\n✅ Done! Question bank saved to src/questionBank.json");
  const total = Object.values(bank).reduce((a, b) => a + b.length, 0);
  console.log(`📊 Total questions: ${total}`);
}

main().catch(console.error);
