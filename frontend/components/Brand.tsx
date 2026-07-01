import { cx } from "@/lib/utils";

export function Brand({ className }: { className?: string }) {
  return (
    <span className={cx("inline-flex items-baseline gap-1.5 font-display", className)}>
      <span className="text-bone">ToDo,</span>
      <span
        className="relative text-stamp"
        style={{ transform: "rotate(-2deg)", display: "inline-block" }}
      >
        John.
      </span>
    </span>
  );
}
