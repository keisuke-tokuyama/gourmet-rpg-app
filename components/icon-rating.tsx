"use client";

import { cn } from "@/lib/utils";

export const RATING_ICONS = { 味: "🍖", 値段: "💰", 雰囲気: "✨", 総合: "★" } as const;

export type RatingSubject = keyof typeof RATING_ICONS;

export interface RatingItem {
  subject: RatingSubject;
  value: number;
}

interface IconRatingProps {
  data: RatingItem[];
  editable?: boolean;
  onChange?: (subject: RatingSubject, value: number) => void;
}

const ICON_MAP: Record<string, string> = {
  味: "🍖",
  値段: "💰",
  雰囲気: "✨",
  総合: "★",
};

function RatingRow({
  icon,
  value,
  subject,
  editable,
  onChange,
}: {
  icon: string;
  value: number;
  subject: string;
  editable?: boolean;
  onChange?: (subject: RatingSubject, value: number) => void;
}) {
  const filledCount = Math.round(Math.min(5, Math.max(0, value)));

  const handleClick = (index: number) => {
    if (editable && onChange) {
      onChange(subject as RatingSubject, index + 1);
    }
  };

  return (
    <div className="flex items-center gap-5 py-3 border-b border-border/30 last:border-0">
      <span className="text-[11px] text-muted-foreground w-14 flex-shrink-0 tracking-[0.12em] font-medium">
        {subject}
      </span>
      <div
        className="flex items-center gap-1"
        aria-label={`${subject}: ${value}点/5点`}
        role={editable ? "group" : undefined}
      >
        {Array.from({ length: 5 }).map((_, i) =>
          editable ? (
            <button
              key={i}
              type="button"
              onClick={() => handleClick(i)}
              className={cn(
                "text-lg leading-none transition-all duration-200 cursor-pointer hover:opacity-100 hover:grayscale-0",
                i < filledCount ? "opacity-100" : "opacity-[0.18] grayscale"
              )}
              aria-pressed={i < filledCount}
              aria-label={`${i + 1}点`}
            >
              {icon}
            </button>
          ) : (
            <span
              key={i}
              className={cn(
                "text-lg leading-none transition-all duration-200",
                i < filledCount ? "opacity-100" : "opacity-[0.18] grayscale"
              )}
            >
              {icon}
            </span>
          )
        )}
      </div>
    </div>
  );
}

export function IconRating({ data, editable, onChange }: IconRatingProps) {
  return (
    <div className="space-y-0 py-2">
      {data.map((item) => (
        <RatingRow
          key={item.subject}
          icon={ICON_MAP[item.subject] ?? "★"}
          value={item.value}
          subject={item.subject}
          editable={editable}
          onChange={onChange}
        />
      ))}
    </div>
  );
}
