import { Rail } from "@/components/Rail";

export default function BoardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <a className="skip" href="#main">
        跳到正文
      </a>
      <Rail />
      <main id="main" className="stage">
        {children}
      </main>
    </>
  );
}
