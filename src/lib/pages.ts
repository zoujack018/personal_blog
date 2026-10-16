import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/** _pages/ 里的独立页面，比如 about.md */
export function getPage(name: string) {
  const { data, content } = matter(fs.readFileSync(path.join(process.cwd(), "_pages", `${name}.md`), "utf8"));
  return { title: String(data.title ?? name), content };
}
