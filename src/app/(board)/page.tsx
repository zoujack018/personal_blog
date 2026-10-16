import { MonthBoard } from "@/components/MonthBoard";
import { todayUtc } from "@/lib/dates";

/** 首页就是本月的看板 */
export default function Home() {
  return <MonthBoard month={todayUtc().slice(0, 7)} />;
}
