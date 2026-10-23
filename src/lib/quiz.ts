import type { QuizQuestion } from "@/lib/content/types";

export type QuestionResult = {
  questionId: string;
  marks: number;
  marksAwarded: number;
  correct: boolean;
  answerGiven: string;
};

function normalise(s: string): string {
  return s.trim().toLowerCase();
}

/** Scores a non-extended question client-side (the data needed is already
 * in the loaded question, nothing secret about a revision quiz's answer). */
export function scoreQuestion(
  question: QuizQuestion,
  answer: string | number | string[],
): QuestionResult {
  const base = { questionId: question.id, marks: question.marks };

  switch (question.type) {
    case "multiple_choice": {
      const correct = answer === question.answerIndex;
      return { ...base, marksAwarded: correct ? question.marks : 0, correct, answerGiven: String(answer) };
    }
    case "short_answer": {
      const given = normalise(String(answer));
      const correct = question.accepted.some((a) => normalise(a) === given);
      return { ...base, marksAwarded: correct ? question.marks : 0, correct, answerGiven: String(answer) };
    }
    case "numeric": {
      const given = Number(answer);
      const tolerance = question.tolerance ?? 0;
      const correct = Number.isFinite(given) && Math.abs(given - question.answer) <= tolerance;
      return { ...base, marksAwarded: correct ? question.marks : 0, correct, answerGiven: String(answer) };
    }
    case "ordering": {
      const given = answer as string[];
      const correct = given.length === question.items.length && given.every((v, i) => v === question.items[i]);
      return { ...base, marksAwarded: correct ? question.marks : 0, correct, answerGiven: given.join(" | ") };
    }
    default:
      throw new Error("scoreQuestion doesn't handle extended questions — use the self-marked score directly.");
  }
}

/** A human-readable "correct answer" for the mistakes bank — extended
 * questions are self-marked, so there's no single right answer to show. */
export function describeCorrectAnswer(question: QuizQuestion): string | null {
  switch (question.type) {
    case "multiple_choice":
      return question.options[question.answerIndex];
    case "short_answer":
      return question.accepted[0];
    case "numeric":
      return `${question.answer}${question.unit ? ` ${question.unit}` : ""}`;
    case "ordering":
      return question.items.join(" → ");
    case "extended":
      return null;
  }
}

/** Self-marked extended answers: "wrong" (for the mistakes bank) means she
 * rated herself below 60% of the available marks. */
export function scoreExtended(question: QuizQuestion, marksAwarded: number, answerGiven: string): QuestionResult {
  const correct = marksAwarded >= question.marks * 0.6;
  return { questionId: question.id, marks: question.marks, marksAwarded, correct, answerGiven };
}
