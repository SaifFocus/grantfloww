import { useEffect, useState } from "react";
import { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  value: number;
  label: string;
}

const StatsCard = ({ icon: Icon, value, label }: Props) => {
  const [n, setN] = useState(0);

  useEffect(() => {
    const start = performance.now();
    const dur = 800;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      setN(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <div className="glass-subtle rounded-2xl p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-primary grid place-items-center shadow-md shrink-0">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-bold leading-tight">{n}</div>
        <div className="text-xs text-muted-foreground">{label}</div>
      </div>
    </div>
  );
};

export default StatsCard;
