import { addMonths, lunar, monthCells, monthTitle, monthUrl, WEEK_HEAD } from "@/lib/dates";
import { getAllPosts, getMonthRange, getPostsByMonth } from "@/lib/posts";
import { PostEntry } from "./PostEntry";

/** 一整个月的月历，有文章的格子写着标题 */
export function MonthView({ month }: { month: string }) {
  const byDate = new Map(getAllPosts().map((p) => [p.date, p]));
  const monthPosts = getPostsByMonth().get(month) ?? [];
  const months = getMonthRange();
  const prev = addMonths(month, -1);
  const next = addMonths(month, 1);

  return (
    <section className="month">
      <header className="month-head">
        <div>
          <h1>{monthTitle(month)}</h1>
          <p className="sub">{monthPosts.length > 0 ? `本月 ${monthPosts.length} 篇` : "这个月还没有文章"}</p>
        </div>
        <nav className="month-pager" aria-label="翻月">
          {months.includes(prev) ? <a href={monthUrl(prev)}>← {Number(prev.slice(5))}月</a> : <span>← {Number(prev.slice(5))}月</span>}
          {months.includes(next) ? <a href={monthUrl(next)}>{Number(next.slice(5))}月 →</a> : <span>{Number(next.slice(5))}月 →</span>}
        </nav>
      </header>

      <div className="grid">
        {WEEK_HEAD.map((w, i) => (
          <div key={w} className={i >= 5 ? "wd we" : "wd"}>
            {w}
          </div>
        ))}
        {monthCells(month).map((cell, i) => {
          if (!cell) return <div key={i} className="cell blank" />;
          const l = lunar(cell.date);
          const post = byDate.get(cell.date);
          const number = (
            <span className="n">
              {cell.day}
              <small className={l.mark ? "mark" : undefined}>{l.cell}</small>
            </span>
          );
          return post ? (
            <a key={i} href={post.url} className="cell has" data-date={cell.date}>
              {number}
              <span className="t">{post.title}</span>
            </a>
          ) : (
            <div key={i} className="cell" data-date={cell.date}>
              {number}
            </div>
          );
        })}
      </div>

      {monthPosts.length > 0 && (
        <div className="month-list">
          {monthPosts.map((p) => (
            <PostEntry key={p.date} post={p} />
          ))}
        </div>
      )}
    </section>
  );
}
