import { SITE } from "@/lib/site";
import { ArrowLeft, ArrowRight } from "./Icons";
import { PrintButton } from "./PrintButton";

type Neighbor = { href: string; date: string; title: string };

type Props = {
  back: { href: string; label: string };
  /** 页眉右侧，比如 "2026年10月16日 星期五" */
  running: string;
  kicker?: string;
  title: string;
  meta?: string;
  html: string;
  words: number;
  prev?: Neighbor;
  next?: Neighbor;
};

/** 像在 Word 里打开一份文档：灰色桌面上一张 A4 纸 */
export function DocSheet({ back, running, kicker, title, meta, html, words, prev, next }: Props) {
  return (
    <div className="desk">
      <a className="skip" href="#doc">
        跳到正文
      </a>

      <header className="doc-bar">
        <a className="doc-back" href={back.href}>
          <ArrowLeft />
          {back.label}
        </a>
        <p className="doc-name">{title}</p>
        <PrintButton />
      </header>

      <main id="doc">
        <article className="sheet">
          <header className="sheet-head">
            <span>{SITE.title}</span>
            <span>{running}</span>
          </header>

          <div className="sheet-title">
            {kicker && <p className="kicker">{kicker}</p>}
            <h1>{title}</h1>
            {meta && <p className="sheet-meta">{meta}</p>}
          </div>

          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

          <footer className="sheet-foot">— 1 —</footer>
        </article>

        {(prev || next) && (
          <nav className="doc-nav" aria-label="翻页">
            {prev && (
              <a className="prev" href={prev.href}>
                <span className="lbl">
                  <ArrowLeft size={14} />
                  {prev.date}
                </span>
                <span className="tt">{prev.title}</span>
              </a>
            )}
            {next && (
              <a className="next" href={next.href}>
                <span className="lbl">
                  {next.date}
                  <ArrowRight size={14} />
                </span>
                <span className="tt">{next.title}</span>
              </a>
            )}
          </nav>
        )}
      </main>

      {/* Word 底部的状态栏 */}
      <footer className="status" aria-hidden="true">
        <span>第 1 页，共 1 页</span>
        <span>{words.toLocaleString("en-US")} 字</span>
        <span className="status-zoom">100%</span>
      </footer>
    </div>
  );
}
