interface ReviewSectionProps {
  companions: string;
  dishes: string;
  review: string;
  visitDate: string;
  amount?: string;
}

export function ReviewSection({
  companions,
  dishes,
  review,
  visitDate,
  amount,
}: ReviewSectionProps) {
  const metadataParts = [visitDate, companions];
  if (amount) {
    metadataParts.push(amount);
  }
  const metadataLine = metadataParts.join(" / ");

  return (
    <article className="space-y-4">
      <div className="space-y-2">
        <p className="text-xs italic text-muted-foreground/70 tracking-wide">
          {metadataLine}
        </p>
        <p className="text-sm italic text-muted-foreground/80 leading-relaxed">
          {dishes}
        </p>
      </div>
      
      <div className="pt-2">
        <p className="text-base leading-[1.9] tracking-wide text-foreground/90 text-pretty">
          {review}
        </p>
      </div>
    </article>
  );
}
