// 线性图标，颜色跟随文字
type Props = { size?: number };

function Svg({ size = 16, d }: Props & { d: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export const ArrowLeft = (p: Props) => <Svg {...p} d="M13 8H3m4-4L3 8l4 4" />;
export const ArrowRight = (p: Props) => <Svg {...p} d="M3 8h10M9 4l4 4-4 4" />;
export const Printer = (p: Props) => <Svg {...p} d="M4.5 6V2.5h7V6m-7 5.5h-2v-5h11v5h-2m-7-2h7v4h-7z" />;
