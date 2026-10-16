import { MonthView } from "@/components/MonthView";
import { PageShell } from "@/components/PageShell";
import { monthTitle } from "@/lib/dates";
import { getMonthRange } from "@/lib/posts";
import type { Metadata } from "next";

type Params = { params: { year: string; month: string } };

export const dynamicParams = false;

export function generateStaticParams() {
  return getMonthRange().map((m) => ({ year: m.slice(0, 4), month: m.slice(5) }));
}

export function generateMetadata({ params }: Params): Metadata {
  return { title: monthTitle(`${params.year}-${params.month}`) };
}

export default function MonthPage({ params }: Params) {
  const month = `${params.year}-${params.month}`;
  return (
    <PageShell active="calendar" month={month} wide>
      <MonthView month={month} />
    </PageShell>
  );
}
