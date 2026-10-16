// 日期一律用 "YYYY-MM-DD" 字符串在各处传递。
// 这个文件不依赖任何库，看板在浏览器里也会用到它，农历放在 lunar.ts。

export const WEEK_HEAD = ["一", "二", "三", "四", "五", "六", "日"]; // 周一开头
const WEEKDAY = ["日", "一", "二", "三", "四", "五", "六"]; // getUTCDay() 的顺序
const MONTH_EN = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function ymd(y: number, m: number, d: number) {
  return `${y}-${pad(m)}-${pad(d)}`;
}

export function parse(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return { y, m, d };
}

function utc(date: string) {
  const { y, m, d } = parse(date);
  return new Date(Date.UTC(y, m - 1, d));
}

/** 构建时的"今天"，只在服务端用 */
export function todayUtc() {
  const now = new Date();
  return ymd(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate());
}

/** 读者所在时区的今天，只在浏览器里用 */
export function localToday() {
  const now = new Date();
  return ymd(now.getFullYear(), now.getMonth() + 1, now.getDate());
}

/** "五" */
export function weekday(date: string) {
  return WEEKDAY[utc(date).getUTCDay()];
}

/** "2026-10" → "October" */
export function monthDisplay(month: string) {
  return MONTH_EN[Number(month.slice(5)) - 1];
}

/** "2026年10月16日" */
export function longDate(date: string) {
  const { y, m, d } = parse(date);
  return `${y}年${m}月${d}日`;
}

/** "10月16日" */
export function shortDate(date: string) {
  const { m, d } = parse(date);
  return `${m}月${d}日`;
}

/** "2026-10" 加减月份 */
export function addMonths(month: string, delta: number) {
  const [y, m] = month.split("-").map(Number);
  const total = y * 12 + (m - 1) + delta;
  return `${Math.floor(total / 12)}-${pad((total % 12) + 1)}`;
}

/** "2026-10" → "/2026/10/" */
export function monthUrl(month: string) {
  return `/${month.replace("-", "/")}/`;
}

export type Cell = { date: string; day: number } | null;

/** 一个月的格子，周一开头，前后用 null 补齐整周 */
export function monthCells(month: string): Cell[] {
  const [y, m] = month.split("-").map(Number);
  const lead = (new Date(Date.UTC(y, m - 1, 1)).getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
  const cells: Cell[] = Array(lead).fill(null);
  for (let d = 1; d <= days; d++) cells.push({ date: ymd(y, m, d), day: d });
  while (cells.length % 7) cells.push(null);
  return cells;
}
