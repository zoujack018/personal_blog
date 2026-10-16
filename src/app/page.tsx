import { DateTile } from "@/components/DateTile";
import { Meta } from "@/components/Meta";
import { PageShell } from "@/components/PageShell";
import { PostEntry } from "@/components/PostEntry";
import { longDate } from "@/lib/dates";
import { getAllPosts } from "@/lib/posts";

const RECENT = 12;

export default function Home() {
  const [latest, ...rest] = getAllPosts();

  return (
    <PageShell active="home">
      {latest ? (
        <section className="feature">
          <DateTile date={latest.date} size="lg" />
          <div className="feature-body">
            <p className="kicker" data-date={latest.date} data-today-label>
              最新一篇
            </p>
            <h1 className="feature-title">
              <a href={latest.url}>{latest.title}</a>
            </h1>
            <p className="feature-excerpt">{latest.excerpt}</p>
            <Meta items={[longDate(latest.date), `阅读约 ${latest.readingMinutes} 分钟`]} />
            <a className="read-link" href={latest.url}>
              开始阅读 <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>
      ) : (
        <p className="empty">日历还是空的。第一篇文章放进 _posts/ 之后，会出现在这里。</p>
      )}

      {rest.length > 0 && (
        <section className="recent">
          <h2 className="section-title">往日</h2>
          {rest.slice(0, RECENT).map((post) => (
            <PostEntry key={post.date} post={post} />
          ))}
          {rest.length > RECENT && (
            <p className="more">
              <a href="/archive/">全部文章 →</a>
            </p>
          )}
        </section>
      )}
    </PageShell>
  );
}
