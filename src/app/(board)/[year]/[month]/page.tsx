import { MonthBoard } from "@/components/MonthBoard";
import { getMonthRange } from "@/lib/posts";
import type { Metadata } from "next";

type Params = { params: { year: string; month: string } };

export function generateStaticParams() {
  return getMonthRange().map((m) => ({ year: m.slice(0, 4), month: m.slice(5) }));
}

export function generateMetadata({ params }: Params): Metadata {
  return { title: `${params.year}年${Number(params.month)}月` };
}

export default function MonthPage({ params }: Params) {
  return <MonthBoard month={`${params.year}-${params.month}`} />;
}
