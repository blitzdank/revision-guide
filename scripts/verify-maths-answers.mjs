// Independently recalculates every numeric-answer question in content/maths
// and checks it against the stored "answer" in questions.json, so an
// authoring slip (wrong arithmetic in a flashcard/question) gets caught
// automatically rather than relying on proofreading alone. Run with:
//   node scripts/verify-maths-answers.mjs
// Section 2 of the build brief: "Where possible, write a small automated
// check (script) for numeric answers." Add a case here whenever a new
// numeric Maths/Science question is written.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const contentRoot = path.join(root, "..", "content", "maths");

function loadQuestions(topic) {
  return JSON.parse(readFileSync(path.join(contentRoot, topic, "questions.json"), "utf-8"));
}

// id -> recomputed value, independent of how the content file derived it.
const checks = {
  si4: Math.cbrt(8) ** 2, // 8^(2/3)
  si5: 1 / Math.sqrt(4), // 4^(-1/2)
  qe4: 3 ** 2 - 4 * 2 * -5, // discriminant of 2x²+3x-5
  qe6: 0 ** 2 + 6 * 0 + 5, // y-intercept of x²+6x+5
  qe7: -((6 / 2) ** 2) + 5, // minimum of x²+6x+5 via -(b/2)²+c
  se2: (() => {
    // x+y=10, x-y=4
    const x = (10 + 4) / 2;
    return x;
  })(),
  se4: (() => {
    // y=3x-1, 2x+y=9 -> 2x+3x-1=9
    const x = (9 + 1) / 5;
    return 3 * x - 1;
  })(),
  cg2: 1000 * 1.04 ** 3,
  cg3: 20000 * 0.9 ** 2,
  cg5: 64 / 0.8,
  tr2: 12 * Math.sin((50 * Math.PI) / 180),
  tr3: Math.sqrt(5 ** 2 + 12 ** 2),
  tr4: (Math.asin(5 / 13) * 180) / Math.PI,
  tr6: Math.sqrt(10 ** 2 + 14 ** 2 - 2 * 10 * 14 * Math.cos((50 * Math.PI) / 180)),
  pt2: 0.3 * 0.5,
  pt3: 0.3 + 0.5 - 0.15,
  pt4: (4 / 10) * (4 / 10),
  pt5: (4 / 10) * (3 / 9),
  pt6: 1 - (6 / 10) * (5 / 9),
};

const topicById = {
  si: "surds-and-indices",
  qe: "quadratic-equations",
  se: "simultaneous-equations",
  cg: "compound-growth-decay",
  tr: "trigonometry",
  pt: "probability-trees",
};

let failed = 0;
let checked = 0;

for (const [id, recomputed] of Object.entries(checks)) {
  const prefix = id.replace(/\d+$/, "");
  const topic = topicById[prefix];
  const questions = loadQuestions(topic);
  const question = questions.find((q) => q.id === id);
  if (!question) {
    console.error(`✗ ${id}: question not found in ${topic}/questions.json`);
    failed++;
    continue;
  }
  const tolerance = question.tolerance ?? 0.005;
  const diff = Math.abs(question.answer - recomputed);
  checked++;
  if (diff > tolerance + 1e-9) {
    console.error(
      `✗ ${id} (${topic}): stored answer ${question.answer}, recomputed ${recomputed} — diff ${diff} exceeds tolerance ${tolerance}`,
    );
    failed++;
  } else {
    console.log(`✓ ${id}: ${question.answer} ≈ ${recomputed.toFixed(4)}`);
  }
}

console.log(`\n${checked - failed}/${checked} numeric answers verified.`);
if (failed > 0) process.exit(1);
