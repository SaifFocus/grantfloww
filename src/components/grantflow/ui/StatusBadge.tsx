type Status = "drafting" | "submitted" | "approved" | "rejected" | "waitlisted";

const STYLES: Record<Status, { dot: string; text: string; bg: string; label: string }> = {
  drafting:   { dot: "bg-[hsl(262_70%_56%)]", text: "text-[hsl(262_70%_40%)]", bg: "bg-[hsl(262_70%_56%/0.12)]", label: "Drafting" },
  submitted:  { dot: "bg-[hsl(220_80%_60%)]", text: "text-[hsl(220_80%_40%)]", bg: "bg-[hsl(220_80%_60%/0.12)]", label: "Submitted" },
  approved:   { dot: "bg-[hsl(142_70%_45%)]", text: "text-[hsl(142_70%_30%)]", bg: "bg-[hsl(142_70%_45%/0.12)]", label: "Approved" },
  rejected:   { dot: "bg-[hsl(0_80%_60%)]",   text: "text-[hsl(0_80%_45%)]",   bg: "bg-[hsl(0_80%_60%/0.12)]",   label: "Rejected" },
  waitlisted: { dot: "bg-[hsl(38_90%_55%)]",  text: "text-[hsl(38_90%_40%)]",  bg: "bg-[hsl(38_90%_55%/0.12)]",  label: "Waitlisted" },
};

const StatusBadge = ({ status }: { status: Status }) => {
  const s = STYLES[status] ?? STYLES.drafting;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {s.label}
    </span>
  );
};

export default StatusBadge;
