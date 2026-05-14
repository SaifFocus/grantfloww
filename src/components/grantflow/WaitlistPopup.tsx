import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import WaitlistForm from "./WaitlistForm";

const STORAGE_KEY = "gf_waitlist_seen";
const DELAY_MS = 15_000;

const WaitlistPopup = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY)) return;
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const remember = () => {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) remember();
      }}
    >
      <DialogContent className="glass-strong border-white/60 sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl md:text-3xl leading-tight">
            {t("waitlist.title1")} <span className="gradient-text-brand italic">{t("waitlist.title2")}</span>
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {t("waitlist.popupSubtitle")}
          </DialogDescription>
        </DialogHeader>
        <WaitlistForm
          source="popup"
          onSuccess={() => {
            remember();
            setTimeout(() => setOpen(false), 1500);
          }}
        />
      </DialogContent>
    </Dialog>
  );
};

export default WaitlistPopup;
