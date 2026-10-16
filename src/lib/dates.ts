import { Solar } from "lunar-javascript";

// 日期一律用 "YYYY-MM-DD" 字符串在各处传递，按 UTC 计算，避免时区把日期挪一天

export const WEEK_HEAD = ["一", "二", "三", "四", "五", "六", "日"]; // 周一开头
const WEEKDAY = ["日", "一", "二", "三", "四", "五", "六"]; // getUTCDay() 的顺序
const MONTH = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

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

export function todayUtc() {
  const now = new Date();
  return ymd(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate());
}

/** "五" */
export function weekday(date: string) {
  return WEEKDAY[utc(date).getUTCDay()];
}

/** "十月" */
export function monthName(m: number) {
  return MONTH[m - 1];
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

/** "2026-10" → "2026年10月" */
export function monthTitle(month: string) {
  const [y, m] = month.split("-").map(Number);
  return `${y}年${m}月`;
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

// lunar-javascript 还带了很多国际纪念日（世界住房日、万圣节前夜……），台历上只留这些公历节日
const SOLAR_FESTIVALS: Record<string, string> = {
  元旦节: "元旦",
  妇女节: "妇女节",
  劳动节: "劳动节",
  青年节: "青年节",
  儿童节: "儿童节",
  教师节: "教师节",
  国庆节: "国庆节",
  圣诞节: "圣诞节",
};

export function lunar(date: string) {
  const { y, m, d } = parse(date);
  const solar = Solar.fromYmd(y, m, d);
  const l = solar.getLunar();
  const month = `${l.getMonthInChinese()}月`;
  const day = l.getDayInChinese();
  const festival = l.getFestivals()[0] ?? solar.getFestivals().map((f) => SOLAR_FESTIVALS[f]).find(Boolean) ?? "";
  const term = l.getJieQi();
  const mark = festival || term;
  return {
    /** "九月初七" */
    date: `${month}${day}`,
    /** "丙午马年" */
    year: `${l.getYearInGanZhi()}${l.getYearShengXiao()}年`,
    /** 节日或节气，没有则为空 */
    mark,
    /** 日历格子里的小字：节日、节气优先，初一写月份，其余写农历日 */
    cell: mark || (day === "初一" ? month : day),
  };
}
