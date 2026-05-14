import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(3, "Please enter your email")
  .max(255, "Email too long")
  .email("Please enter a valid email");

interface WaitlistFormProps {
  source?: "page" | "popup";
  onSuccess?: () => void;
  className?: string;
}

const WaitlistForm = ({ source = "page", onSuccess, className }: WaitlistFormProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

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
      // Unique violation = already on the list — treat as success
      if (error.code === "23505") {
        toast.success("You're already on the list — see you at launch!");
        setDone(true);
        onSuccess?.();
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      toast.success("You're on the waitlist! We'll email you at launch.");
      setDone(true);
      onSuccess?.();
    }
    setLoading(false);
  };

  if (done) {
    return (
      <div className={`glass-subtle rounded-full px-5 py-3 text-sm text-foreground/80 text-center ${className ?? ""}`}>
        Thanks! We'll be in touch when we launch.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`flex flex-col sm:flex-row gap-2 ${className ?? ""}`}>
      <Input
        type="email"
        required
        placeholder="you@email.com"
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
            Join waitlist
            <ArrowRight className="w-4 h-4 ml-1" />
          </>
        )}
      </Button>
    </form>
  );
};

export default WaitlistForm;
