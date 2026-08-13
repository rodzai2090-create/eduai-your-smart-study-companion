/**
 * Curriculum catalog — intentionally data-driven so that countries, boards,
 * grades, subjects, chapters and topics can be extended (or later loaded from
 * a backend) without touching any UI code.
 */

export type Country = {
  id: string;
  name: string;
  flag: string;
  boardIds: string[];
};

export type Board = {
  id: string;
  name: string;
  shortName: string;
  gradeIds: string[];
};

export type Grade = {
  id: string;
  label: string;
  stage: "primary" | "middle" | "secondary" | "senior-secondary";
};

export type Subject = {
  id: string;
  name: string;
  icon: string;
  blurb: string;
  chapters: number;
  topics: number;
};

export type Chapter = {
  id: string;
  subjectId: string;
  title: string;
  topics: string[];
  progress: number;
};

export const countries: Country[] = [
  { id: "in", name: "India", flag: "🇮🇳", boardIds: ["cbse", "icse", "state-mh"] },
  { id: "gb", name: "United Kingdom", flag: "🇬🇧", boardIds: ["gcse", "a-level"] },
  { id: "us", name: "United States", flag: "🇺🇸", boardIds: ["common-core", "ap"] },
  { id: "ae", name: "United Arab Emirates", flag: "🇦🇪", boardIds: ["cbse", "gcse"] },
  { id: "ng", name: "Nigeria", flag: "🇳🇬", boardIds: ["waec"] },
  { id: "intl", name: "International", flag: "🌍", boardIds: ["ib", "cambridge"] },
];

export const boards: Board[] = [
  { id: "cbse", name: "Central Board of Secondary Education", shortName: "CBSE", gradeIds: ["g6", "g7", "g8", "g9", "g10", "g11", "g12"] },
  { id: "icse", name: "Indian Certificate of Secondary Education", shortName: "ICSE", gradeIds: ["g6", "g7", "g8", "g9", "g10"] },
  { id: "state-mh", name: "Maharashtra State Board", shortName: "MSBSHSE", gradeIds: ["g8", "g9", "g10", "g11", "g12"] },
  { id: "gcse", name: "GCSE", shortName: "GCSE", gradeIds: ["y9", "y10", "y11"] },
  { id: "a-level", name: "A Levels", shortName: "A-Level", gradeIds: ["y12", "y13"] },
  { id: "common-core", name: "Common Core State Standards", shortName: "Common Core", gradeIds: ["g6", "g7", "g8", "g9", "g10"] },
  { id: "ap", name: "Advanced Placement", shortName: "AP", gradeIds: ["g11", "g12"] },
  { id: "waec", name: "West African Examinations Council", shortName: "WAEC", gradeIds: ["g9", "g10", "g11", "g12"] },
  { id: "ib", name: "International Baccalaureate", shortName: "IB", gradeIds: ["y9", "y10", "y11", "y12", "y13"] },
  { id: "cambridge", name: "Cambridge International", shortName: "CAIE", gradeIds: ["y9", "y10", "y11", "y12", "y13"] },
];

export const grades: Grade[] = [
  { id: "g6", label: "Class 6", stage: "middle" },
  { id: "g7", label: "Class 7", stage: "middle" },
  { id: "g8", label: "Class 8", stage: "middle" },
  { id: "g9", label: "Class 9", stage: "secondary" },
  { id: "g10", label: "Class 10", stage: "secondary" },
  { id: "g11", label: "Class 11", stage: "senior-secondary" },
  { id: "g12", label: "Class 12", stage: "senior-secondary" },
  { id: "y9", label: "Year 9", stage: "secondary" },
  { id: "y10", label: "Year 10", stage: "secondary" },
  { id: "y11", label: "Year 11", stage: "secondary" },
  { id: "y12", label: "Year 12", stage: "senior-secondary" },
  { id: "y13", label: "Year 13", stage: "senior-secondary" },
];

export const subjects: Subject[] = [
  { id: "math", name: "Mathematics", icon: "Sigma", blurb: "Algebra, geometry, calculus and problem solving.", chapters: 14, topics: 96 },
  { id: "physics", name: "Physics", icon: "Atom", blurb: "Motion, energy, electricity and modern physics.", chapters: 12, topics: 84 },
  { id: "chemistry", name: "Chemistry", icon: "FlaskConical", blurb: "Atoms, reactions, organic and physical chemistry.", chapters: 13, topics: 88 },
  { id: "biology", name: "Biology", icon: "Leaf", blurb: "Cells, genetics, human body and ecology.", chapters: 11, topics: 79 },
  { id: "english", name: "English", icon: "BookOpen", blurb: "Literature, grammar, comprehension and writing.", chapters: 10, topics: 62 },
  { id: "cs", name: "Computer Science", icon: "Code2", blurb: "Programming, data, logic and computational thinking.", chapters: 9, topics: 58 },
  { id: "history", name: "History", icon: "Landmark", blurb: "Civilisations, revolutions and the modern world.", chapters: 10, topics: 66 },
  { id: "geography", name: "Geography", icon: "Globe2", blurb: "Landforms, climate, resources and human geography.", chapters: 9, topics: 54 },
  { id: "economics", name: "Economics", icon: "TrendingUp", blurb: "Markets, macroeconomics and development.", chapters: 8, topics: 47 },
];

export const chapters: Chapter[] = [
  { id: "ch-quad", subjectId: "math", title: "Quadratic Equations", topics: ["Standard form", "Factorisation", "Quadratic formula", "Nature of roots"], progress: 72 },
  { id: "ch-trig", subjectId: "math", title: "Introduction to Trigonometry", topics: ["Ratios", "Identities", "Heights & distances"], progress: 40 },
  { id: "ch-motion", subjectId: "physics", title: "Laws of Motion", topics: ["Newton's laws", "Friction", "Momentum", "Free-body diagrams"], progress: 88 },
  { id: "ch-light", subjectId: "physics", title: "Light: Reflection & Refraction", topics: ["Mirrors", "Lenses", "Refractive index"], progress: 25 },
  { id: "ch-periodic", subjectId: "chemistry", title: "Periodic Classification", topics: ["Groups & periods", "Trends", "Modern table"], progress: 55 },
  { id: "ch-life", subjectId: "biology", title: "Life Processes", topics: ["Nutrition", "Respiration", "Transport", "Excretion"], progress: 63 },
  { id: "ch-writing", subjectId: "english", title: "Writing Skills", topics: ["Formal letters", "Article writing", "Précis"], progress: 30 },
  { id: "ch-loops", subjectId: "cs", title: "Loops & Iteration", topics: ["For loops", "While loops", "Nested loops"], progress: 91 },
];

export const getBoardsForCountry = (countryId: string) => {
  const country = countries.find((c) => c.id === countryId);
  return boards.filter((b) => country?.boardIds.includes(b.id));
};

export const getGradesForBoard = (boardId: string) => {
  const board = boards.find((b) => b.id === boardId);
  return grades.filter((g) => board?.gradeIds.includes(g.id));
};

export const getChaptersForSubject = (subjectId: string) =>
  chapters.filter((c) => c.subjectId === subjectId);
