// Independently recalculates every numeric-answer question in content/science
// and checks it against the stored "answer" in questions.json. Same purpose
// and pattern as verify-maths-answers.mjs — see CONTENT.md. Run with:
//   node scripts/verify-science-answers.mjs

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(fileURLToPath(import.meta.url));
const contentRoot = path.join(root, "..", "content", "science");

function loadQuestions(strand, topic) {
  return JSON.parse(
    readFileSync(path.join(contentRoot, strand, topic, "questions.json"), "utf-8"),
  );
}

const topicById = {
  cb: { strand: "biology", topic: "cell-biology" },
  as: { strand: "chemistry", topic: "atomic-structure" },
  rr: { strand: "chemistry", topic: "rates-of-reaction" },
  en: { strand: "physics", topic: "energy" },
  fo: { strand: "physics", topic: "forces" },
};

// id -> recomputed value, independent of how the content file derived it.
const checks = {
  cb3: 8 / 400, // magnification: actual size in mm (then compared in μm below)
  cb4: 25 * 200, // image size in μm (then compared in mm below)
  cb5: ((4.8 - 5.2) / 5.2) * 100,
  as3: (63 * 69 + 65 * 31) / 100,
  rr2: 3.6 / 60,
  rr3: 24 / 20,
  en2: 0.5 * 4200 * 30,
  en3: 21000 / (1 * 10),
  en4: 150 / 200,
  fo2: 20 * 15,
  fo3: (25 - 5) / 4,
  fo4: 1000 * 2,
  fo5: 75 * 9.8,
};

// A couple of answers are stored in different units than the raw formula
// gives (mm vs μm) — convert here rather than hiding a magic number above.
const unitConversions = {
  cb3: (v) => v * 1000, // mm -> μm
  cb4: (v) => v / 1000, // μm -> mm
};

let failed = 0;
let checked = 0;

for (const [id, raw] of Object.entries(checks)) {
  const prefix = id.replace(/\d+$/, "");
  const { strand, topic } = topicById[prefix];
  const questions = loadQuestions(strand, topic);
  const question = questions.find((q) => q.id === id);
  if (!question) {
    console.error(`✗ ${id}: question not found in ${strand}/${topic}/questions.json`);
    failed++;
    continue;
  }
  const recomputed = unitConversions[id] ? unitConversions[id](raw) : raw;
  const tolerance = question.tolerance ?? 0.005;
  const diff = Math.abs(question.answer - recomputed);
  checked++;
  if (diff > tolerance + 1e-9) {
    console.error(
      `✗ ${id} (${strand}/${topic}): stored answer ${question.answer}, recomputed ${recomputed} — diff ${diff} exceeds tolerance ${tolerance}`,
    );
    failed++;
  } else {
    console.log(`✓ ${id}: ${question.answer} ≈ ${recomputed.toFixed(4)}`);
  }
}

console.log(`\n${checked - failed}/${checked} numeric answers verified.`);
if (failed > 0) process.exit(1);
