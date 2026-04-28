import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles, Hammer, RotateCcw } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useLatestGeneratorInput } from "./generatorContext";

type Msg = { role: "user" | "assistant"; content: string };

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/bob-chat`;
const ANON = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

const SUGGESTED = [
  "What is GrantFlow AI?",
  "How do I write a grant application?",
  "Walk me through the generator",
  "What contracts do I need?",
];

const INITIAL_MESSAGES: Msg[] = [
  {
    role: "assistant",
    content:
      "Hey, I'm **Bob The Builder** 🛠️ — I help you understand GrantFlow AI and turn your idea into a fundable plan. Ask me anything about the app, grants, or your roadmap.",
  },
];

const BobChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>(INITIAL_MESSAGES);

  const resetChat = () => {
    if (loading) return;
    setMessages(INITIAL_MESSAGES);
    setInput("");
    toast.success("Started a new chat");
  };
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setInput("");
    const userMsg: Msg = { role: "user", content };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);

    let acc = "";
    let assistantStarted = false;
    const upsert = (chunk: string) => {
      acc += chunk;
      setMessages((prev) => {
        if (!assistantStarted) {
          assistantStarted = true;
          return [...prev, { role: "assistant", content: acc }];
        }
        return prev.map((m, i) =>
          i === prev.length - 1 ? { ...m, content: acc } : m,
        );
      });
    };

    try {
      const resp = await fetch(CHAT_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ANON}`,
        },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) toast.error("Bob is busy — try again in a moment.");
        else if (resp.status === 402) toast.error("AI credits exhausted. Add funds to continue.");
        else toast.error("Bob couldn't respond right now.");
        setLoading(false);
        return;
      }
      if (!resp.body) throw new Error("No stream");

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let done = false;

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buffer += decoder.decode(value, { stream: true });
        let idx: number;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line || line.startsWith(":")) continue;
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) upsert(delta);
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open Bob The Builder chat"
        className="fixed bottom-6 right-6 z-50 group"
      >
        <span className="absolute inset-0 rounded-full bg-gradient-primary blur-xl opacity-60 group-hover:opacity-90 transition-opacity" />
        <span className="relative flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary text-white shadow-glass-lg border border-white/40 transition-transform group-hover:scale-105">
          {open ? <X className="w-6 h-6" /> : <Hammer className="w-6 h-6" />}
        </span>
        {!open && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent border-2 border-background animate-pulse" />
        )}
      </button>

      {/* Chat window */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[min(420px,calc(100vw-2rem))] origin-bottom-right transition-all duration-300 ${
          open ? "scale-100 opacity-100 pointer-events-auto" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="glass-strong rounded-3xl overflow-hidden flex flex-col h-[min(620px,calc(100vh-8rem))]">
          {/* Header */}
          <div className="px-5 py-4 border-b border-white/40 flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-2xl bg-gradient-primary flex items-center justify-center shadow-md">
                <Hammer className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-serif text-lg leading-tight">Bob The Builder</div>
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-primary" /> GrantFlow AI assistant
              </div>
            </div>
            <button
              onClick={resetChat}
              disabled={loading || messages.length <= 1}
              className="h-8 px-2.5 rounded-full hover:bg-white/60 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Start new chat"
              title="Start new chat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New chat</span>
            </button>
            <button
              onClick={() => setOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/60 flex items-center justify-center text-muted-foreground"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-gradient-primary text-white rounded-br-md shadow-md"
                      : "glass-subtle rounded-bl-md text-foreground"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-strong:text-foreground">
                      <ReactMarkdown>{m.content}</ReactMarkdown>
                    </div>
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            ))}
            {loading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="glass-subtle rounded-2xl rounded-bl-md px-4 py-3 inline-flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            {messages.length === 1 && !loading && (
              <div className="pt-2 space-y-2">
                <p className="text-xs text-muted-foreground px-1">Try asking:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs px-3 py-1.5 rounded-full glass-subtle hover:bg-white/70 transition-colors text-foreground"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-white/40">
            <form
              onSubmit={(e) => { e.preventDefault(); send(); }}
              className="flex items-center gap-2 glass-subtle rounded-2xl pl-4 pr-1.5 py-1.5"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Bob about GrantFlow AI…"
                className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim() || loading}
                className="rounded-xl bg-gradient-primary text-white border-0 hover:opacity-95 w-9 h-9"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
            <p className="text-[10px] text-muted-foreground text-center mt-2">
              Bob only answers questions about GrantFlow AI.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default BobChat;
