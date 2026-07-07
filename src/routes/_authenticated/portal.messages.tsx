import { createFileRoute } from "@tanstack/react-router";
import { PortalShell } from "@/components/portal/PortalShell";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send } from "lucide-react";

type Msg = { id: string; sender_id: string; recipient_id: string | null; body: string; created_at: string; };

export const Route = createFileRoute("/_authenticated/portal/messages")({
  head: () => ({ meta: [{ title: "Messages — Client Portal" }, { name: "robots", content: "noindex" }] }),
  component: Messages,
});

function Messages() {
  const [uid, setUid] = useState<string>("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const [adminId, setAdminId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return;
      setUid(u.user.id);
      const { data: admins } = await supabase.from("user_roles").select("user_id").eq("role", "admin").limit(1);
      setAdminId(admins?.[0]?.user_id ?? null);
      const { data } = await supabase.from("messages").select("*")
        .or(`sender_id.eq.${u.user.id},recipient_id.eq.${u.user.id}`)
        .order("created_at");
      setMsgs((data ?? []) as Msg[]);
      await supabase.from("messages").update({ read_at: new Date().toISOString() }).eq("recipient_id", u.user.id).is("read_at", null);
    })();
  }, []);

  useEffect(() => { listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }); }, [msgs]);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    const { data, error } = await supabase.from("messages").insert({
      sender_id: uid, recipient_id: adminId, body: text.trim(),
    }).select().single();
    if (error) return toast.error(error.message);
    setMsgs(m => [...m, data as Msg]);
    setText("");
  }

  return (
    <PortalShell>
      <h1 className="font-display text-4xl">Messages</h1>
      <p className="mt-2 text-sm text-muted-foreground">Secure conversation with Tozamile & the team.</p>
      <div className="mt-8 glass-strong rounded-3xl p-4 sm:p-6 grid grid-rows-[1fr_auto] h-[70vh]">
        <div ref={listRef} className="overflow-y-auto pr-2 grid gap-3 content-start">
          {msgs.length === 0 && <div className="text-center text-sm text-muted-foreground py-16">Start the conversation.</div>}
          {msgs.map(m => {
            const mine = m.sender_id === uid;
            return (
              <div key={m.id} className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${mine ? "ml-auto bg-[image:var(--gradient-royal)] text-primary-foreground" : "glass"}`}>
                {m.body}
                <div className={`mt-1 text-[10px] ${mine ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{new Date(m.created_at).toLocaleString("en-GB")}</div>
              </div>
            );
          })}
        </div>
        <form onSubmit={send} className="mt-4 flex items-center gap-2 rounded-full glass px-1.5 py-1.5">
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Type your message…" className="flex-1 bg-transparent px-4 py-2 text-sm focus:outline-none" />
          <button className="inline-flex items-center gap-1.5 rounded-full bg-[image:var(--gradient-royal)] px-4 py-2 text-sm font-medium text-primary-foreground"><Send className="h-3.5 w-3.5" /> Send</button>
        </form>
      </div>
    </PortalShell>
  );
}
