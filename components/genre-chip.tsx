interface GenreChipProps {
  genre: string;
  isActive?: boolean;
}

export function GenreChip({ genre, isActive = false }: GenreChipProps) {
  return (
    <span
      className={`
        inline-block px-3 py-1 text-xs tracking-widest uppercase
        border transition-colors duration-200
        ${
          isActive
            ? "border-foreground bg-foreground text-background"
            : "border-border bg-transparent text-muted-foreground hover:border-foreground/50"
        }
      `}
    >
      {genre}
    </span>
  );
}
