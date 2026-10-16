"use client";

import { Printer } from "./Icons";

export function PrintButton() {
  return (
    <button type="button" className="doc-tool" onClick={() => window.print()}>
      <Printer />
      <span>打印</span>
    </button>
  );
}
