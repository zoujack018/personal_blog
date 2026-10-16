import { DocSheet } from "@/components/DocSheet";
import { monthUrl, longDate, shortDate, weekday } from "@/lib/dates";
import { lunar } from "@/lib/lunar";
import { markdownToHtml } from "@/lib/markdown";
import { getAllPosts, getNeighbors, getPost } from "@/lib/posts";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { params: { year: string; month: string; day: string } };

export function generateStaticParams() {
  const posts = getAllPosts();
  // 静态导出不接受空列表：一篇都没有时生成一个占位地址，打开它是 404
  if (posts.length === 0) return [{ year: "0000", month: "00", day: "00" }];
  return posts.map(({ year, month, day }) => ({ year, month, day }));
}

export function generateMetadata({ params }: Params): Metadata {
  const post = getPost(`${params.year}-${params.month}-${params.day}`);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article", url: post.url },
  };
}

export default async function PostPage({ params }: Params) {
  const post = getPost(`${params.year}-${params.month}-${params.day}`);
  if (!post) notFound();

  const html = await markdownToHtml(post.content);
  const { newer, older } = getNeighbors(post.date);
  const l = lunar(post.date);

  return (
    <DocSheet
      back={{ href: monthUrl(post.date.slice(0, 7)), label: "看板" }}
      running={`${longDate(post.date)} 星期${weekday(post.date)}`}
      kicker={[`农历${l.date}`, l.mark].filter(Boolean).join(" · ")}
      title={post.title}
      meta={`阅读约 ${post.readingMinutes} 分钟`}
      html={html}
      words={post.words}
      prev={older && { href: older.url, date: shortDate(older.date), title: older.title }}
      next={newer && { href: newer.url, date: shortDate(newer.date), title: newer.title }}
    />
  );
}
