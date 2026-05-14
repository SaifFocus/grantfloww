import { useState } from "react";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

interface WaitlistFormProps {
  source?: "page" | "popup";
  onSuccess?: () => void;
  className?: string;
}

const WaitlistForm = ({ source = "page", onSuccess, className }: WaitlistFormProps) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const emailSchema = z
    .string()
    .trim()
    .toLowerCase()
    .min(3, t("waitlist.invalidEmail"))
    .max(255, t("waitlist.invalidEmail"))
    .email(t("waitlist.invalidEmail"));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase
      .from("waitlist_signups")
      .insert({ email: parsed.data, source });

    if (error) {
      if (error.code === "23505") {
        toast.success(t("waitlist.alreadyToast"));
        setDone(true);
        onSuccess?.();
      } else {
        toast.error(t("waitlist.errorToast"));
      }
    } else {
      toast.success(t("waitlist.successToast"));
      setDone(true);
      onSuccess?.();
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className={`glass-subtle rounded-full px-5 py-3 text-sm text-foreground/80 text-center ${className ?? ""}`}>
        {t("waitlist.thanks")}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 ${className ?? ""}`}>
      <Input
        type="email"
        required
        placeholder={t("waitlist.emailPlaceholder")}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
        maxLength={255}
        className="h-12 rounded-full px-5 bg-background/70 border-white/60 backdrop-blur"
        aria-label="Email address"
      />
      <Button
        type="submit"
        size="lg"
        disabled={loading}
        className="h-12 rounded-full bg-gradient-primary text-white border-0 hover:opacity-95 px-6 shadow-lg shadow-primary/20"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
          <>
            {t("waitlist.submit")}
            <ArrowRight className="w-4 h-4 ml-1 rtl:rotate-180" />
          </>
        )}
      </Button>
    </form>
  );
};

export default WaitlistForm;
