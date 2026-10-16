import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { addMonths, todayUtc } from "./dates";

export type Post = {
  /** "2026-10-16"，也是文章的身份：每天只有一篇 */
  date: string;
  year: string;
  month: string;
  day: string;
  title: string;
  excerpt: string;
  /** Markdown 正文 */
  content: string;
  /** "/2026/10/16/" */
  url: string;
  readingMinutes: number;
};

const POSTS_DIR = path.join(process.cwd(), "_posts");

let cache: Post[] | null = null;

/** 全部文章，新的在前 */
export function getAllPosts(): Post[] {
  if (cache) return cache;
  const files = fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".md")) : [];
  const seen = new Map<string, string>();
  const posts = files.map((file) => {
    const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), "utf8"));
    const date = normalizeDate(data.date ?? file, file);
    const other = seen.get(date);
    if (other) throw new Error(`${date} 有两篇文章：_posts/${other} 和 _posts/${file}。每天只放一篇。`);
    seen.set(date, file);
    const [year, month, day] = date.split("-");
    return {
      date,
      year,
      month,
      day,
      title: String(data.title ?? "").trim() || "无题",
      excerpt: String(data.excerpt ?? "").trim() || makeExcerpt(content),
      content,
      url: `/${year}/${month}/${day}/`,
      readingMinutes: readingMinutes(content),
    };
  });
  cache = posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  return cache;
}

export function getPost(date: string) {
  return getAllPosts().find((p) => p.date === date);
}

/** newer 是后一天方向，older 是前一天方向 */
export function getNeighbors(date: string) {
  const posts = getAllPosts();
  const i = posts.findIndex((p) => p.date === date);
  return { newer: i > 0 ? posts[i - 1] : undefined, older: posts[i + 1] };
}

/** "2026-10" → 当月文章（新的在前） */
export function getPostsByMonth() {
  const map = new Map<string, Post[]>();
  for (const p of getAllPosts()) {
    const key = p.date.slice(0, 7);
    map.set(key, [...(map.get(key) ?? []), p]);
  }
  return map;
}

/** 有日历页的月份，从第一篇所在月到本月（含），从早到晚 */
export function getMonthRange(): string[] {
  const posts = getAllPosts();
  const now = todayUtc().slice(0, 7);
  if (posts.length === 0) return [now];
  const first = posts[posts.length - 1].date.slice(0, 7);
  const last = posts[0].date.slice(0, 7) > now ? posts[0].date.slice(0, 7) : now;
  const months: string[] = [];
  for (let m = first; m <= last; m = addMonths(m, 1)) months.push(m);
  return months;
}

/** 截至最新一篇，连续写了几天 */
export function getStreak() {
  const posts = getAllPosts();
  let streak = 0;
  let expected = posts[0]?.date;
  for (const p of posts) {
    if (p.date !== expected) break;
    streak++;
    const t = new Date(`${p.date}T00:00:00Z`);
    t.setUTCDate(t.getUTCDate() - 1);
    expected = t.toISOString().slice(0, 10);
  }
  return streak;
}

function normalizeDate(value: unknown, file: string) {
  // YAML 里不加引号的日期会被解析成 Date
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const match = String(value).match(/(\d{4})-(\d{2})-(\d{2})/);
  if (!match) throw new Error(`_posts/${file}：没有日期。在 front matter 里写 date: 2026-10-16，或把文件命名成 2026-10-16.md`);
  return `${match[1]}-${match[2]}-${match[3]}`;
}

function plainText(markdown: string) {
  return markdown
    .replace(/^\[\^[^\]]+\]:.*$/gm, "") // 脚注定义
    .replace(/\[\^[^\]]+\]/g, "") // 脚注引用
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // 图片
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // 链接只留文字
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~>#|-]/g, "");
}

function makeExcerpt(markdown: string) {
  const paragraph = markdown
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .find((block) => block && !block.startsWith("#") && !block.startsWith("[^"));
  const text = plainText(paragraph ?? "").replace(/\s+/g, " ").trim();
  return text.length > 110 ? `${text.slice(0, 110)}…` : text;
}

function readingMinutes(markdown: string) {
  const text = plainText(markdown);
  const han = (text.match(/\p{Script=Han}/gu) ?? []).length;
  const words = (text.replace(/\p{Script=Han}/gu, " ").match(/[A-Za-z0-9]+/g) ?? []).length;
  return Math.max(1, Math.round(han / 400 + words / 220));
}
