import { addMonths, monthCells, monthTitle, monthUrl, WEEK_HEAD } from "@/lib/dates";
import type { Post } from "@/lib/posts";

/** 侧栏的小月历：有文章的日子可以点 */
export function MiniCalendar({ month, posts, months }: { month: string; posts: Map<string, Post>; months: string[] }) {
  const cells = monthCells(month);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));
  const prev = addMonths(month, -1);
  const next = addMonths(month, 1);

  return (
    <div className="cal">
      <table>
        <caption>
          <a href={monthUrl(month)}>{monthTitle(month)}</a>
        </caption>
        <thead>
          <tr>
            {WEEK_HEAD.map((w, i) => (
              <th key={w} scope="col" className={i >= 5 ? "we" : undefined}>
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, r) => (
            <tr key={r}>
              {week.map((cell, i) => {
                if (!cell) return <td key={i} />;
                const post = posts.get(cell.date);
                return (
                  <td key={i}>
                    {post ? (
                      <a href={post.url} title={post.title} data-date={cell.date}>
                        {cell.day}
                      </a>
                    ) : (
                      <span data-date={cell.date}>{cell.day}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="cal-nav">
        {months.includes(prev) ? <a href={monthUrl(prev)}>« {Number(prev.slice(5))}月</a> : <span />}
        {months.includes(next) ? <a href={monthUrl(next)}>{Number(next.slice(5))}月 »</a> : <span />}
      </div>
    </div>
  );
}
