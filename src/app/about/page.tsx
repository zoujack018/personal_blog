import { PageShell } from "@/components/PageShell";
import { markdownToHtml } from "@/lib/markdown";
import { getPage } from "@/lib/pages";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "关于" };

export default async function AboutPage() {
  const page = getPage("about");
  const html = await markdownToHtml(page.content);
  return (
    <PageShell active="about">
      <h1 className="page-title">{page.title}</h1>
      <div className="prose about" dangerouslySetInnerHTML={{ __html: html }} />
    </PageShell>
  );
}
