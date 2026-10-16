"use client";

import { useEffect, useState } from "react";

const WEEKDAY = "日一二三四五六";

/**
 * 站点是静态生成的，"今天"只能在读者的浏览器里算：
 * 页眉写上今天的日期，所有带 data-date 的元素按今天标上 is-today / is-future。
 */
export function Today() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const d = new Date();
    setNow(d);
    const today = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    document.querySelectorAll<HTMLElement>("[data-date]").forEach((el) => {
      const date = el.dataset.date!;
      if (date === today) {
        el.classList.add("is-today");
        if (el.hasAttribute("data-today-label")) el.textContent = "今天";
      } else if (date > today) {
        el.classList.add("is-future");
      }
    });
  }, []);

  return (
    <p className="today">
      {now && (
        <>
          <b>
            {now.getMonth() + 1}月{now.getDate()}日
          </b>
          　星期{WEEKDAY[now.getDay()]}
        </>
      )}
    </p>
  );
}
