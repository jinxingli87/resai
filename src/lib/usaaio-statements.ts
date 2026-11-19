import fs from "node:fs";
import path from "node:path";

/**
 * Full problem statements for the USAAIO problem pages, read at build time from src/content/usaaio.
 *
 * - 2025 sets: `<slug>.json`, imported from the official forum threads (with official solutions)
 *   by scripts/usaaio/import_2025.py.
 * - 2026 sets: `<slug>/p<N>.md`, transcribed from the official PDFs. Parts start with a line
 *   `### Part 1.2 (10 points)`; text before the first part is the problem's intro.
 *   An optional `instructions.md` holds rules that apply to the whole paper.
 */

export type StatementPart = {
  label: string;
  points: number;
  kind?: string;
  body: string;
  answer?: string;
  source?: string;
  /** A group heading (e.g. "Part 1.2. Relative Positional Encoding") and shared setup that precede this part. */
  section?: { title: string; body: string };
};

export type StatementProblem = { number: number; intro: string; parts: StatementPart[] };

export type Statements = { instructions?: string; problems: StatementProblem[] };

const DIR = path.join(process.cwd(), "src/content/usaaio");

const PART_RE = /^###\s+Part\s+([\d.]+)\s+\((\d+)\s+points?\)\s*$/gim;

// A bold line such as `**Part 1.2. Relative Positional Encoding**` that groups the parts after it.
const SECTION_RE = /^\*\*Part\s+[\d.]+\.?\s+([^*\n]+)\*\*\s*$/m;

/** Split a trailing group heading (and the setup text after it) off a block of Markdown. */
function splitSection(md: string): [string, StatementPart["section"]] {
  const m = SECTION_RE.exec(md);
  if (!m) return [md.trim(), undefined];
  return [md.slice(0, m.index).trim(), { title: m[0].replace(/\*\*/g, "").trim(), body: md.slice(m.index + m[0].length).trim() }];
}

function parseProblem(number: number, md: string): StatementProblem {
  const heads = [...md.matchAll(PART_RE)];
  if (!heads.length) return { number, intro: md.trim(), parts: [] };
  const [intro, firstSection] = splitSection(md.slice(0, heads[0].index));
  let section = firstSection;
  const parts = heads.map((m, i) => {
    const [body, next] = splitSection(md.slice(m.index! + m[0].length, i + 1 < heads.length ? heads[i + 1].index : undefined));
    const part: StatementPart = { label: m[1], points: Number(m[2]), body, section };
    section = next;
    return part;
  });
  return { number, intro, parts };
}

export function loadStatements(slug: string): Statements | null {
  const json = path.join(DIR, `${slug}.json`);
  if (fs.existsSync(json)) return JSON.parse(fs.readFileSync(json, "utf8")) as Statements;

  const dir = path.join(DIR, slug);
  if (!fs.existsSync(dir)) return null;
  const problems = fs
    .readdirSync(dir)
    .map((f) => /^p(\d+)\.md$/.exec(f))
    .filter((m): m is RegExpExecArray => !!m)
    .map((m) => parseProblem(Number(m[1]), fs.readFileSync(path.join(dir, m[0]), "utf8")))
    .sort((a, b) => a.number - b.number);
  const instr = path.join(dir, "instructions.md");
  return { instructions: fs.existsSync(instr) ? fs.readFileSync(instr, "utf8").trim() : undefined, problems };
}

export function loadDocument(slug: string): string | null {
  const file = path.join(DIR, `${slug}.md`);
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : null;
}
