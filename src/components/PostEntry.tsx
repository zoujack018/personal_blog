import { lunar } from "@/lib/dates";
import type { Post } from "@/lib/posts";
import { DateTile } from "./DateTile";
import { Meta } from "./Meta";

export function PostEntry({ post }: { post: Post }) {
  return (
    <article className="entry">
      <DateTile date={post.date} />
      <div className="entry-body">
        <h2>
          <a href={post.url}>{post.title}</a>
        </h2>
        <p className="excerpt">{post.excerpt}</p>
        <Meta items={[`农历${lunar(post.date).date}`, `阅读约 ${post.readingMinutes} 分钟`]} />
      </div>
    </article>
  );
}
