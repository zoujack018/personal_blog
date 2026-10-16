import { monthUrl, monthDisplay, parse, weekday } from "@/lib/dates";
import { getAllPosts, getPostsByMonth, type Post } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "归档" };

export default function ArchivePage() {
  const total = getAllPosts().length;
  const years = new Map<string, [string, Post[]][]>();
  for (const [month, posts] of getPostsByMonth()) {
    const y = month.slice(0, 4);
    years.set(y, [...(years.get(y) ?? []), [month, posts]]);
  }

  return (
    <div className="archive">
      <header className="page-head">
        <h1 className="display">
          Archive<span aria-hidden="true">.</span>
        </h1>
        <p className="board-sub">{total > 0 ? `共 ${total} 篇` : "还没有文章"}</p>
      </header>

      {total === 0 && <p className="empty">第一篇写好之后，会出现在这里。</p>}

      {[...years].map(([year, months]) => (
        <section key={year} className="archive-year">
          <h2>{year}</h2>
          <div>
            {months.map(([month, posts]) => (
              <div key={month} className="archive-month">
                <h3>
                  <a href={monthUrl(month)}>
                    {monthDisplay(month)} · {Number(month.slice(5))}月
                  </a>
                  <span>{posts.length} 篇</span>
                </h3>
                <ol>
                  {posts.map((p) => (
                    <li key={p.date}>
                      <a href={p.url}>
                        <span className="ad">{parse(p.date).d}</span>
                        <span className="aw">周{weekday(p.date)}</span>
                        <span className="at">{p.title}</span>
                        <span className="am">{p.readingMinutes} 分钟</span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
