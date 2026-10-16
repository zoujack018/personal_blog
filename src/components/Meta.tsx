/** 用 · 隔开的一行小字；每一段不在中间断行 */
export function Meta({ items }: { items: (string | false | undefined)[] }) {
  const parts = items.filter(Boolean) as string[];
  return (
    <p className="meta">
      {parts.map((part, i) => (
        <span key={i}>
          {i > 0 && " · "}
          <span className="nowrap">{part}</span>
        </span>
      ))}
    </p>
  );
}
