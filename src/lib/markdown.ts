import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// 文章只来自这个仓库（自己写或流水线写），所以允许内嵌 HTML
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, {
    allowDangerousHtml: true,
    footnoteLabel: "注释",
    footnoteLabelProperties: { className: ["footnote-label"] },
    footnoteBackLabel: "回到正文",
    // ︎ 让 ↩ 按文字显示，不被 iOS 渲染成彩色 emoji
    footnoteBackContent: "↩︎",
  })
  .use(rehypeRaw)
  .use(rehypeStringify);

export async function markdownToHtml(markdown: string) {
  return String(await processor.process(markdown));
}
