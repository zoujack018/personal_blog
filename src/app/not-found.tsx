import { PageShell } from "@/components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <div className="notfound">
        <p className="kicker">404</p>
        <h1>这一页还是空白</h1>
        <p>可能这一天没有文章，也可能地址写错了。</p>
        <p>
          <a href="/">回到今天</a>　·　<a href="/calendar/">翻翻月历</a>
        </p>
      </div>
    </PageShell>
  );
}
