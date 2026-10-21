import {
  BookOpen,
  Calculator,
  ChefHat,
  Church,
  FlaskConical,
  Landmark,
  PenTool,
  type LucideIcon,
} from "lucide-react";

export type Subject = {
  /** URL-safe id, used in routes and to tag content/progress rows. */
  slug: string;
  name: string;
  board: string;
  qualification: string;
  tier?: string;
  icon: LucideIcon;
  /** Subtle accent within the pink/yellow palette (see globals.css tokens). */
  tint: "pink" | "yellow";
  /** English splits into two set-text groups that share one subject tile. */
  strands?: { slug: string; name: string }[];
};

// Build order from the brief (section 2): English, History, Maths, Science,
// RE, Food, Graphics. Keep this order everywhere subjects are listed.
export const SUBJECTS: Subject[] = [
  {
    slug: "english",
    name: "English",
    board: "AQA",
    qualification: "Language (8700) & Literature (8702)",
    icon: BookOpen,
    tint: "pink",
    strands: [
      { slug: "language", name: "Language" },
      { slug: "literature", name: "Literature" },
    ],
  },
  {
    slug: "history",
    name: "History",
    board: "Edexcel",
    qualification: "GCSE History (1HI0)",
    icon: Landmark,
    tint: "yellow",
  },
  {
    slug: "maths",
    name: "Maths",
    board: "AQA",
    qualification: "GCSE Mathematics (8300)",
    tier: "Higher",
    icon: Calculator,
    tint: "pink",
  },
  {
    slug: "science",
    name: "Combined Science",
    board: "AQA",
    qualification: "Trilogy (8464)",
    tier: "Higher",
    icon: FlaskConical,
    tint: "yellow",
    strands: [
      { slug: "biology", name: "Biology" },
      { slug: "chemistry", name: "Chemistry" },
      { slug: "physics", name: "Physics" },
    ],
  },
  {
    slug: "re",
    name: "Religious Studies",
    board: "AQA",
    qualification: "GCSE Religious Studies A (8062)",
    icon: Church,
    tint: "pink",
  },
  {
    slug: "food",
    name: "Food",
    board: "Eduqas",
    qualification: "GCSE Food Preparation & Nutrition",
    icon: ChefHat,
    tint: "yellow",
  },
  {
    slug: "graphics",
    name: "Graphics",
    board: "Eduqas",
    qualification: "GCSE Design & Technology",
    tier: "Papers & boards focus",
    icon: PenTool,
    tint: "pink",
  },
];

export function getSubject(slug: string): Subject | undefined {
  return SUBJECTS.find((subject) => subject.slug === slug);
}
