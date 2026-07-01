"use client";

import { cx } from "@/lib/utils";

interface StampCheckboxProps {
  checked: boolean;
  onToggle: () => void;
  label: string;
  size?: "sm" | "md";
}

export function StampCheckbox({ checked, onToggle, label, size = "md" }: StampCheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label}
      onClick={onToggle}
      className={cx(
        "stamp-box",
        checked && "is-done",
        size === "sm" ? "!h-6 !w-6" : "",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber",
      )}
    >
      <svg
        width={size === "sm" ? 12 : 15}
        height={size === "sm" ? 12 : 15}
        viewBox="0 0 16 16"
        fill="none"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8.5L6.2 12L13 4" />
      </svg>
    </button>
  );
}
