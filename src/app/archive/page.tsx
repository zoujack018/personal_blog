import { PageShell } from "@/components/PageShell";
import { monthUrl, parse, weekday } from "@/lib/dates";
import { getAllPosts, getPostsByMonth } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "归档" };

export default function ArchivePage() {
  const total = getAllPosts().length;
  const years = new Map<string, [string, ReturnType<typeof getAllPosts>][]>();
  for (const [month, posts] of getPostsByMonth()) {
    const y = month.slice(0, 4);
    years.set(y, [...(years.get(y) ?? []), [month, posts]]);
  }

  return (
    <PageShell active="archive">
      <h1 className="page-title">归档</h1>
      <p className="page-sub">{total > 0 ? `共 ${total} 篇` : "还没有文章"}</p>

      {[...years.entries()].map(([year, months]) => (
        <section key={year} className="archive-year">
          <h2>{year}</h2>
          {months.map(([month, posts]) => (
            <div key={month} className="archive-month">
              <h3>
                <a href={monthUrl(month)}>{Number(month.slice(5))}月</a>
                <span>{posts.length} 篇</span>
              </h3>
              <ol className="archive-days">
                {posts.map((p) => (
                  <li key={p.date}>
                    <a href={p.url}>
                      <span className="dd">
                        {parse(p.date).d}日 · 周{weekday(p.date)}
                      </span>
                      <span className="tt">{p.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </section>
      ))}
    </PageShell>
  );
}
