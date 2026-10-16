import { lunar, monthName, parse, weekday } from "@/lib/dates";

/** 日历撕页。sm 用在文章列表，lg 是台历那一页 */
export function DateTile({ date, size = "sm" }: { date: string; size?: "sm" | "lg" }) {
  const { y, m, d } = parse(date);

  if (size === "lg") {
    const l = lunar(date);
    return (
      <div className="tile tile-lg" data-date={date} aria-hidden="true">
        <span className="band">
          {y} · {monthName(m)}
        </span>
        <span className="d">{d}</span>
        <span className="w">星期{weekday(date)}</span>
        <span className="l">{l.date}</span>
        {l.mark && <span className="mark">{l.mark}</span>}
      </div>
    );
  }

  return (
    <div className="tile" data-date={date} aria-hidden="true">
      <span className="m">{monthName(m)}</span>
      <span className="d">{d}</span>
      <span className="w">周{weekday(date)}</span>
    </div>
  );
}
