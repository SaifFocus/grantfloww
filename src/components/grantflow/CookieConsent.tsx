import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "gf_cookie_consent";

export type CookieChoice = "accepted" | "rejected";

export const getCookieConsent = (): CookieChoice | null => {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === "accepted" || v === "rejected" ? v : null;
};

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!getCookieConsent()) {
      // Slight delay so it doesn't fight the hero animation
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const decide = (choice: CookieChoice) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60] w-[min(680px,calc(100%-1.5rem))]"
    >
      <div className="glass-strong rounded-2xl px-5 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-start gap-3 flex-1">
          <span className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-md shrink-0">
            <Cookie className="w-4 h-4 text-white" />
          </span>
          <p className="text-sm text-foreground/85 leading-snug">
            We use cookies to improve your experience and measure traffic. You can change your mind at any time.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 w-full sm:w-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => decide("rejected")}
            className="rounded-full hover:bg-foreground/5 flex-1 sm:flex-initial"
          >
            Reject
          </Button>
          <Button
            size="sm"
            onClick={() => decide("accepted")}
            className="rounded-full bg-gradient-primary text-white border-0 hover:opacity-95 px-5 flex-1 sm:flex-initial"
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
