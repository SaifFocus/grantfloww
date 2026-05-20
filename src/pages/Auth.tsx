import { useState, FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Loader2, Sparkles, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Blobs from "@/components/grantflow/Blobs";
import { useAuth } from "@/contexts/AuthContext";
import { lovable } from "@/integrations/lovable/index";

const GoogleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.61z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/>
  </svg>
);

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("signin");
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({ fullName: "", email: "", password: "", confirm: "" });

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || "/dashboard";

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(signInData.email, signInData.password);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    }
  };

  const handleSignUp = async (e: FormEvent) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (signUpData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const { error } = await signUp(signUpData.email, signUpData.password, signUpData.fullName);
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Account created! Welcome to GrantFlow.");
      navigate(from, { replace: true });
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/dashboard",
    });
    if (result.error) {
      toast.error(result.error.message || "Google sign-in failed");
      setLoading(false);
      return;
    }
    if (result.redirected) return;
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen relative grid place-items-center px-4 py-12">
      <Helmet>
        <title>Sign in or create your account — GrantFlow AI</title>
        <meta name="description" content="Sign in to GrantFlow AI or create a free account to match your idea against real grants and draft tailored applications." />
        <link rel="canonical" href="https://grantfloww.lovable.app/auth" />
        <meta property="og:title" content="Sign in or create your account — GrantFlow AI" />
        <meta property="og:description" content="Sign in to GrantFlow AI or create a free account to match your idea against real grants and draft tailored applications." />
        <meta property="og:url" content="https://grantfloww.lovable.app/auth" />
        <meta name="robots" content="noindex,follow" />
      </Helmet>
      <Blobs />
      <Link to="/" className="absolute top-6 left-6 text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back home
      </Link>

      <div className="relative w-full max-w-md">
        <div className="absolute -inset-1 bg-gradient-primary rounded-[2.25rem] opacity-20 blur-xl" />
        <div className="relative glass-strong rounded-[2rem] p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" strokeWidth={2.5} />
              </span>
              <span className="font-semibold tracking-tight">GrantFlow <span className="gradient-text-brand">AI</span></span>
            </div>
            <h1 className="font-serif text-3xl">Welcome</h1>
            <p className="text-sm text-muted-foreground">Sign in to find and apply for grants</p>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="grid grid-cols-2 w-full glass-subtle rounded-full p-1">
              <TabsTrigger value="signin" className="rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Sign in</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full data-[state=active]:bg-gradient-primary data-[state=active]:text-white">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="space-y-4 mt-5">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="si-email">Email</Label>
                  <Input id="si-email" type="email" required value={signInData.email}
                    onChange={(e) => setSignInData({ ...signInData, email: e.target.value })}
                    className="glass-subtle border-white/60 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="si-password">Password</Label>
                  <Input id="si-password" type="password" required value={signInData.password}
                    onChange={(e) => setSignInData({ ...signInData, password: e.target.value })}
                    className="glass-subtle border-white/60 rounded-2xl" />
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-primary text-white border-0 hover:opacity-95 h-11">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="space-y-4 mt-5">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="su-name">Full name</Label>
                  <Input id="su-name" required value={signUpData.fullName}
                    onChange={(e) => setSignUpData({ ...signUpData, fullName: e.target.value })}
                    className="glass-subtle border-white/60 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-email">Email</Label>
                  <Input id="su-email" type="email" required value={signUpData.email}
                    onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                    className="glass-subtle border-white/60 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-password">Password</Label>
                  <Input id="su-password" type="password" required minLength={6} value={signUpData.password}
                    onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                    className="glass-subtle border-white/60 rounded-2xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-confirm">Confirm password</Label>
                  <Input id="su-confirm" type="password" required minLength={6} value={signUpData.confirm}
                    onChange={(e) => setSignUpData({ ...signUpData, confirm: e.target.value })}
                    className="glass-subtle border-white/60 rounded-2xl" />
                </div>
                <Button type="submit" disabled={loading} className="w-full rounded-2xl bg-gradient-primary text-white border-0 hover:opacity-95 h-11">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-3">
            <span className="flex-1 h-px bg-white/60" />
            <span className="text-xs text-muted-foreground">or</span>
            <span className="flex-1 h-px bg-white/60" />
          </div>

          <div className="relative rounded-2xl p-[1px] bg-gradient-primary">
            <button onClick={handleGoogle} disabled={loading}
              className="w-full rounded-2xl bg-white/90 backdrop-blur h-11 flex items-center justify-center gap-2 text-sm font-medium hover:bg-white transition-colors">
              <GoogleIcon /> Continue with Google
            </button>
          </div>

          <div className="text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Continue as guest →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
