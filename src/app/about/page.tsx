import { DocSheet } from "@/components/DocSheet";
import { markdownToHtml } from "@/lib/markdown";
import { getPage } from "@/lib/pages";
import { wordCount } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "关于" };

export default async function AboutPage() {
  const page = getPage("about");
  const html = await markdownToHtml(page.content);
  return (
    <DocSheet
      back={{ href: "/", label: "看板" }}
      running="关于"
      title={page.title}
      html={html}
      words={wordCount(page.content)}
    />
  );
}
