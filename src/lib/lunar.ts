import { Solar } from "lunar-javascript";
import { addMonths, monthCells, parse } from "./dates";

// 只在构建时用。lunar-javascript 很大，不进浏览器。

// lunar-javascript 还带了很多国际纪念日（世界住房日、万圣节前夜……），日历上只留这些公历节日
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
  const festival = l.getFestivals()[0] ?? solar.getFestivals().map((f) => SOLAR_FESTIVALS[f]).find(Boolean) ?? "";
  return {
    /** "九月初七" */
    date: `${l.getMonthInChinese()}月${l.getDayInChinese()}`,
    /** 节日或节气，没有则为空 */
    mark: festival || l.getJieQi(),
  };
}

/** 看板格子角上的小字：只有节日和节气，按日期索引。from、to 是 "2026-10" 这样的月份，含两端 */
export function marksBetween(from: string, to: string) {
  const marks: Record<string, string> = {};
  for (let month = from; month <= to; month = addMonths(month, 1)) {
    for (const cell of monthCells(month)) {
      if (!cell) continue;
      const { mark } = lunar(cell.date);
      if (mark) marks[cell.date] = mark;
    }
  }
  return marks;
}
