import { DateTile } from "@/components/DateTile";
import { Meta } from "@/components/Meta";
import { PageShell } from "@/components/PageShell";
import { longDate, lunar, shortDate, weekday } from "@/lib/dates";
import { markdownToHtml } from "@/lib/markdown";
import { getAllPosts, getNeighbors, getPost } from "@/lib/posts";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Params = { params: { year: string; month: string; day: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map(({ year, month, day }) => ({ year, month, day }));
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
    <PageShell month={post.date.slice(0, 7)}>
      <article className="post">
        <header className="post-head">
          <DateTile date={post.date} size="lg" />
          <div className="post-head-text">
            <h1>{post.title}</h1>
            <Meta
              items={[
                longDate(post.date),
                `星期${weekday(post.date)}`,
                `农历${l.date}`,
                l.mark,
                `阅读约 ${post.readingMinutes} 分钟`,
              ]}
            />
          </div>
        </header>

        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

        {(older || newer) && (
          <nav className="post-nav" aria-label="翻页">
            {older && (
              <a className="prev" href={older.url}>
                <span className="lbl">← 上一篇 · {shortDate(older.date)}</span>
                <span className="t">{older.title}</span>
              </a>
            )}
            {newer && (
              <a className="next" href={newer.url}>
                <span className="lbl">下一篇 · {shortDate(newer.date)} →</span>
                <span className="t">{newer.title}</span>
              </a>
            )}
          </nav>
        )}
      </article>
    </PageShell>
  );
}
