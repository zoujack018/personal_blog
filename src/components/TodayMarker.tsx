"use client";

import { localToday } from "@/lib/dates";
import { useEffect } from "react";

/** 看板是构建那天生成的静态页；打开时按读者所在的时区，重新标出今天和还没到的日子 */
export function TodayMarker() {
  useEffect(() => {
    const today = localToday();
    document.querySelectorAll<HTMLElement>(".grid [data-date]").forEach((cell) => {
      const date = cell.dataset.date ?? "";
      cell.classList.toggle("is-today", date === today);
      cell.classList.toggle("is-future", date > today);
    });
  }, []);
  return null;
}
