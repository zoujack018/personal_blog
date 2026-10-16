import { MonthView } from "@/components/MonthView";
import { PageShell } from "@/components/PageShell";
import { getAllPosts, getMonthRange } from "@/lib/posts";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "月历" };

/** /calendar/ 直接显示最新一篇所在的月份 */
export default function CalendarPage() {
  const months = getMonthRange();
  const month = getAllPosts()[0]?.date.slice(0, 7) ?? months[months.length - 1];
  return (
    <PageShell active="calendar" month={month} wide>
      <MonthView month={month} />
    </PageShell>
  );
}
