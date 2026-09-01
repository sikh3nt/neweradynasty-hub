import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { chatWithAssistant } from "@/lib/chat.functions";
import { SITE } from "@/lib/site";

type ChatMessage = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What services do you offer?",
  "How does the referral programme work?",
  "Can I test your apps?",
];

const GREETING: ChatMessage = {
  role: "assistant",
  content:
    "Hi, I'm the Dynasty assistant. Ask me anything about Tozamile's work — websites, apps, branding or the referral partnership.",
};

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const askAssistant = useServerFn(chatWithAssistant);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  const send = async (text: string) => {
    const content = text.trim().slice(0, 2000);
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const { reply } = await askAssistant({
        data: { messages: next.filter((m) => m !== GREETING).slice(-12) },
      });
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Something went wrong. Please try again or message Tozamile on WhatsApp." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const whatsappUrl = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(
    "Hi Tozamile, I found your website and I'd like to chat about a project.",
  )}`;

  return (
    <>
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        {open && (
          <div className="glass-strong w-[min(92vw,22rem)] overflow-hidden rounded-3xl border border-border shadow-elegant">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-[image:var(--gradient-royal)] text-primary-foreground">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-semibold text-gold-gradient">Dynasty assistant</div>
                  <div className="text-[10px] text-muted-foreground">Usually replies instantly</div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close chat" className="rounded-lg p-1.5 text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div ref={scrollRef} className="max-h-80 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm ${
                    m.role === "user"
                      ? "ml-auto bg-primary/15 text-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {loading && <div className="rounded-2xl bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">Typing…</div>}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => void send(s)}
                      className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-luxury"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send(input);
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <label htmlFor="chat-input" className="sr-only">Message the assistant</label>
              <input
                id="chat-input"
                value={input}
                maxLength={2000}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question…"
                className="flex-1 rounded-full bg-muted px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="grid h-9 w-9 place-items-center rounded-full bg-[image:var(--gradient-royal)] text-primary-foreground disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="grid h-12 w-12 place-items-center rounded-full bg-[#25D366] text-black shadow-elegant hover:brightness-110 transition-luxury"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
              <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.22 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.26.48 1.69.62.71.22 1.36.19 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35zM12.04 2C6.55 2 2.1 6.45 2.1 11.94c0 1.75.46 3.46 1.34 4.97L2 22l5.23-1.37a9.9 9.9 0 0 0 4.81 1.23h.01c5.48 0 9.94-4.45 9.94-9.94A9.88 9.88 0 0 0 12.04 2z" />
            </svg>
          </a>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close assistant" : "Open assistant"}
            className="grid h-12 w-12 place-items-center rounded-full bg-[image:var(--gradient-royal)] text-primary-foreground shadow-glow-gold hover:brightness-110 transition-luxury"
          >
            {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </>
  );
}
