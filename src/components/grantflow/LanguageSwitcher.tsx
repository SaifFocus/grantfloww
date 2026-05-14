import { Check, Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SUPPORTED_LANGUAGES } from "@/i18n";

interface LanguageSwitcherProps {
  variant?: "navbar" | "ghost";
}

const LanguageSwitcher = ({ variant = "navbar" }: LanguageSwitcherProps) => {
  const { i18n, t } = useTranslation();
  const current =
    SUPPORTED_LANGUAGES.find((l) => l.code === i18n.resolvedLanguage) ??
    SUPPORTED_LANGUAGES[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={t("nav.language")}
        className={
          variant === "navbar"
            ? "inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors px-2 h-9 rounded-full"
            : "inline-flex items-center gap-1.5 text-sm hover:opacity-80 transition-opacity"
        }
      >
        <Globe className="w-4 h-4" />
        <span className="font-medium">{current.short}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-strong border-white/60 rounded-2xl min-w-[160px]">
        {SUPPORTED_LANGUAGES.map((l) => {
          const active = l.code === current.code;
          return (
            <DropdownMenuItem
              key={l.code}
              onSelect={() => i18n.changeLanguage(l.code)}
              className="rounded-xl cursor-pointer flex items-center justify-between gap-3"
            >
              <span>{l.label}</span>
              {active && <Check className="w-4 h-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
