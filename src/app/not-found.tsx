export default function NotFound() {
  return (
    <main className="lost">
      <h1 className="display">
        404<span aria-hidden="true">.</span>
      </h1>
      <p>这一页不在看板上。可能那天没有写，也可能地址错了。</p>
      <p>
        <a className="btn" href="/">
          回到看板
        </a>
      </p>
    </main>
  );
}
