import { MapPin, Clock, Calendar } from "lucide-react";

interface RestaurantInfoProps {
  name: string;
  closedDays: string;
  hours: string;
  address: string;
}

export function RestaurantInfo({
  name,
  closedDays,
  hours,
  address,
}: RestaurantInfoProps) {
  return (
    <div className="flex flex-col justify-end h-full">
      <h1 className="text-2xl font-medium leading-tight tracking-tight text-foreground mb-4 text-balance">
        {name}
      </h1>
      <div className="space-y-2">
        <div className="flex items-start gap-2 text-muted-foreground">
          <Calendar className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <span className="text-xs leading-relaxed">{closedDays}</span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground">
          <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <span className="text-xs leading-relaxed">{hours}</span>
        </div>
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" strokeWidth={1.5} />
          <span className="text-xs leading-relaxed">{address}</span>
        </div>
      </div>
    </div>
  );
}
