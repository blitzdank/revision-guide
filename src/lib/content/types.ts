/** A topic within a subject's spec.json — every topic is listed here even
 * before its content folder (guide/flashcards/questions) is written, so
 * coverage against the real spec can be tracked from day one. */
export type SpecTopic = {
  slug: string;
  name: string;
  /** Exam board spec reference, e.g. "8700/1 Section A" or "8464 B1". */
  specRef: string;
};

export type SpecPaper = {
  id: string;
  name: string;
  topics: SpecTopic[];
};

export type SubjectSpec = {
  qualification: string;
  papers: SpecPaper[];
};

export type Flashcard = {
  id: string;
  front: string;
  back: string;
};

type QuestionBase = {
  id: string;
  specRef: string;
  marks: number;
  prompt: string;
};

export type MultipleChoiceQuestion = QuestionBase & {
  type: "multiple_choice";
  options: string[];
  answerIndex: number;
  explanation: string;
};

export type ShortAnswerQuestion = QuestionBase & {
  type: "short_answer";
  /** Any of these (case-insensitive) counts as correct. */
  accepted: string[];
  explanation: string;
};

export type NumericQuestion = QuestionBase & {
  type: "numeric";
  answer: number;
  tolerance?: number;
  unit?: string;
  workedSolution: string;
};

export type OrderingQuestion = QuestionBase & {
  type: "ordering";
  /** Items in their correct order; shown to the student shuffled. */
  items: string[];
};

export type ExtendedQuestion = QuestionBase & {
  type: "extended";
  /** Bullet points of what a strong answer would cover. */
  indicativeContent: string[];
  levelDescriptors: { level: number; marksRange: string; description: string }[];
};

export type QuizQuestion =
  | MultipleChoiceQuestion
  | ShortAnswerQuestion
  | NumericQuestion
  | OrderingQuestion
  | ExtendedQuestion;
