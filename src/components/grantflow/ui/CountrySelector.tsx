import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const COUNTRIES = [
  { code: "Sweden", flag: "🇸🇪", label: "Sweden" },
  { code: "Denmark", flag: "🇩🇰", label: "Denmark" },
  { code: "Norway", flag: "🇳🇴", label: "Norway" },
  { code: "United Kingdom", flag: "🇬🇧", label: "United Kingdom" },
  { code: "United States", flag: "🇺🇸", label: "United States" },
  { code: "Spain", flag: "🇪🇸", label: "Spain" },
  { code: "Other", flag: "🌍", label: "Other / specify" },
];

export const flagFor = (country?: string | null) => COUNTRIES.find((c) => c.code === country)?.flag ?? "🌍";

interface Props {
  value?: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}

const CountrySelector = ({ value, onChange, placeholder = "Select country", className }: Props) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={`glass-subtle border-white/60 rounded-2xl ${className ?? ""}`}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="rounded-2xl">
        {COUNTRIES.map((c) => (
          <SelectItem key={c.code} value={c.code}>
            <span className="mr-2">{c.flag}</span>{c.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelector;
