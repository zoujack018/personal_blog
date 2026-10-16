import { monthTitle, monthUrl } from "@/lib/dates";
import { getAllPosts, getMonthRange, getPostsByMonth, getStreak } from "@/lib/posts";
import { MiniCalendar } from "./MiniCalendar";

export type Section = "home" | "calendar" | "archive" | "about";

const NAV: { key: Section; href: string; label: string; hint: string }[] = [
  { key: "home", href: "/", label: "今天", hint: "最新一篇" },
  { key: "calendar", href: "/calendar/", label: "月历", hint: "按月翻看" },
  { key: "archive", href: "/archive/", label: "归档", hint: "全部文章" },
  { key: "about", href: "/about/", label: "关于", hint: "这是什么" },
];

/** 左侧导航 + 正文。month 决定侧栏小月历显示哪个月 */
export function PageShell({
  active,
  month,
  wide = false,
  children,
}: {
  active?: Section;
  month?: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  const posts = getAllPosts();
  const byDate = new Map(posts.map((p) => [p.date, p]));
  const months = getMonthRange();
  const byMonth = getPostsByMonth();
  const focus = month ?? posts[0]?.date.slice(0, 7) ?? months[months.length - 1];

  return (
    <>
      <nav className="mobile-nav wrap" aria-label="主导航">
        {NAV.map((item) => (
          <a key={item.key} href={item.href} aria-current={item.key === active ? "page" : undefined}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="layout wrap">
        <aside className="sidebar">
          <nav className="widget side-nav" aria-label="主导航">
            <h2 className="widget-title">导航</h2>
            <ul className="nav-list">
              {NAV.map((item) => (
                <li key={item.key}>
                  <a href={item.href} aria-current={item.key === active ? "page" : undefined}>
                    <b>{item.label}</b>
                    <span>{item.hint}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <section className="widget">
            <h2 className="widget-title">日历</h2>
            <MiniCalendar month={focus} posts={byDate} months={months} />
          </section>

          {byMonth.size > 0 && (
            <section className="widget">
              <h2 className="widget-title">归档</h2>
              <ul className="archive-list">
                {[...byMonth.entries()].slice(0, 12).map(([m, list]) => (
                  <li key={m}>
                    <a href={monthUrl(m)}>
                      {monthTitle(m)}
                      <span>{list.length}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <p className="stats">
            累计 {posts.length} 篇 · 连续 {getStreak()} 天
          </p>
        </aside>

        <main id="main" className={wide ? "main wide" : "main"}>
          {children}
        </main>
      </div>
    </>
  );
}
