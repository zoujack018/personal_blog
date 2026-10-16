import { WEEK_HEAD, addMonths, monthCells, monthDisplay, monthUrl, parse, todayUtc } from "@/lib/dates";
import { marksBetween } from "@/lib/lunar";
import { getMonthRange, getPostsByMonth } from "@/lib/posts";
import type { CSSProperties, ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "./Icons";
import { TodayMarker } from "./TodayMarker";

/** 每张便利贴都贴歪一点，角度由日期决定，每次构建都一样：-0.8° 到 0.8° */
function tilt(date: string) {
  let h = 0;
  for (const ch of date) h = (h * 31 + ch.charCodeAt(0)) | 0;
  return ((Math.abs(h) % 9) - 4) * 0.2;
}

function MonthLink({ month, enabled, label, children }: { month: string; enabled: boolean; label: string; children: ReactNode }) {
  return enabled ? (
    <a className="btn-icon" href={monthUrl(month)} aria-label={label}>
      {children}
    </a>
  ) : (
    <span className="btn-icon" aria-disabled="true" aria-label={label}>
      {children}
    </span>
  );
}

/** 日历看板：一个月一面墙，写了文章的日子贴一张便利贴 */
export function MonthBoard({ month }: { month: string }) {
  const posts = [...(getPostsByMonth().get(month) ?? [])].reverse(); // 从月初到月末
  const byDate = new Map(posts.map((p) => [p.date, p]));
  const marks = marksBetween(month, month);
  const range = getMonthRange();
  const prev = addMonths(month, -1);
  const next = addMonths(month, 1);
  // 先按构建那天标"今天"，浏览器里再由 TodayMarker 按读者的时区改正
  const today = todayUtc();
  const { y, m } = parse(`${month}-01`);

  return (
    <div className="board">
      <TodayMarker />

      <header className="board-head">
        <h1 className="display">
          {monthDisplay(month)}
          <span aria-hidden="true">.</span>
        </h1>
        <div className="board-aside">
          <p className="board-sub">
            {y} 年 {m} 月<span className="sep">·</span>
            {posts.length > 0 ? `${posts.length} 篇` : "还没有便利贴"}
          </p>
          <nav className="board-tools" aria-label="翻月">
            <MonthLink month={prev} enabled={prev >= range[0]} label="上个月">
              <ArrowLeft />
            </MonthLink>
            <MonthLink month={next} enabled={next <= range[range.length - 1]} label="下个月">
              <ArrowRight />
            </MonthLink>
            <a className="btn" href="/">
              今天
            </a>
          </nav>
        </div>
      </header>

      <div className="week" aria-hidden="true">
        {WEEK_HEAD.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <ol className="grid" aria-label={`${y}年${m}月`}>
        {monthCells(month).map((cell, i) => {
          if (!cell) return <li key={`pad-${i}`} className="cell cell--pad" aria-hidden="true" />;
          const post = byDate.get(cell.date);
          const classes = [
            "cell",
            post ? "cell--note" : "cell--slot",
            cell.date === today && "is-today",
            cell.date > today && "is-future",
          ]
            .filter(Boolean)
            .join(" ");
          const style = { "--i": i, "--tilt": `${post ? tilt(cell.date) : 0}deg` } as CSSProperties;
          const face = (
            <>
              <span className="n">{cell.day}</span>
              {marks[cell.date] && <span className="mark">{marks[cell.date]}</span>}
              {post && (
                <>
                  <span className="t">{post.title}</span>
                  <span className="meta">{post.readingMinutes} 分钟</span>
                </>
              )}
            </>
          );
          return (
            <li key={cell.date} className={classes} style={style} data-date={cell.date}>
              {post ? (
                <a href={post.url} aria-label={`${m}月${cell.day}日，${post.title}`}>
                  {face}
                </a>
              ) : (
                <div>{face}</div>
              )}
            </li>
          );
        })}
      </ol>

      {/* 手机上格子太小放不下标题，在下面列一遍 */}
      <section className="index" aria-label="本月文章">
        <h2>本月</h2>
        {posts.length === 0 ? (
          <p className="index-empty">这个月还没有便利贴。</p>
        ) : (
          <ol>
            {posts.map((p) => (
              <li key={p.date}>
                <a href={p.url}>
                  <span className="ix-d">{parse(p.date).d}</span>
                  <span className="ix-t">{p.title}</span>
                  <span className="ix-m">{p.readingMinutes} 分钟</span>
                </a>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
