"use client";

import { localToday, parse, weekday } from "@/lib/dates";
import { SITE } from "@/lib/site";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "看板" },
  { href: "/archive/", label: "归档" },
  { href: "/about/", label: "关于" },
];

/** 左侧的窄边栏；手机上变成顶部一条 */
export function Rail() {
  const path = usePathname();
  // 今天按读者的时区算，所以只在浏览器里填
  const [today, setToday] = useState<string | null>(null);
  useEffect(() => setToday(localToday()), []);

  return (
    <nav className="rail" aria-label="主导航">
      <a className="rail-mark" href="/" aria-label={`${SITE.title}，回到看板`}>
        {SITE.title[0]}
        <span>.</span>
      </a>

      <ul className="rail-nav">
        {NAV.map(({ href, label }) => {
          // 看板包括首页和每个月的页面 /2026/10/
          const active = href === "/" ? path === "/" || /^\/\d{4}\/\d{2}\/?$/.test(path) : path.startsWith(href);
          return (
            <li key={href}>
              <a href={href} aria-current={active ? "page" : undefined}>
                {label}
              </a>
            </li>
          );
        })}
      </ul>

      <div className="rail-foot">
        {today && (
          <p className="rail-today" aria-label={`今天 ${parse(today).m}月${parse(today).d}日`}>
            <b>{parse(today).d}</b>
            <span>周{weekday(today)}</span>
          </p>
        )}
        <a className="rail-rss" href="/feed.xml">
          RSS
        </a>
      </div>
    </nav>
  );
}
