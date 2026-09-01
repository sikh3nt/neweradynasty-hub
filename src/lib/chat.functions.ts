import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().trim().min(1).max(2000),
});

const inputSchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
});

const SYSTEM_PROMPT = `You are "Dynasty Assistant", the friendly assistant on the personal brand website of Tozamile Sikhenjana, Founder and CEO of New Era Dynasty (Reg. 2024/080819/07), based in Motherwell, Gqeberha, South Africa.

What Tozamile does:
- Web design and development (business websites, portfolios, booking and admin systems).
- Software projects: AMD trading bot, Civic FaceNet, SwiftDrop delivery app, 469 Premium bar stock tracker, scientific calculator, CV/resume builder, Ndingubani TV. Visitors can test them live at /labs.
- Graphic design and branding (GraFX): logos, business cards, posters, pamphlets, pricing lists.
- Ventures: New Era Dynasty, WireNet, Black Style Barbershop, GraFX.
- Trading: swing trading with Candle Range Theory, Turtle Body Soup, Quasimodo (QML), the 7-1-4 method, and news/event trading.

Referral partnership programme (/referral): each month Tozamile builds websites for up to 5 partners at no cost. In return the partner refers paying clients and earns 20% commission on every referred client who pays. Partners sign a simple agreement first. The referred client must name their referrer when they pay.

Contact: email tozamilesikh3njana@proton.me, phone +27 65 057 0489 or +27 68 253 0792, WhatsApp +27 65 057 0489.

Rules: be warm, professional and concise (2-4 short sentences unless more detail is asked). Use sentence case. Never invent prices, deadlines or guarantees — point people to the contact page or WhatsApp for quotes. If asked something unrelated to Tozamile or his work, answer briefly and steer back to how he can help.`;

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return { reply: "The assistant is offline right now. Please reach out on WhatsApp and Tozamile will reply personally." };
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...data.messages],
      }),
    });

    if (response.status === 429) {
      return { reply: "The assistant is a bit busy right now. Try again in a moment, or message Tozamile on WhatsApp." };
    }
    if (!response.ok) {
      return { reply: "I could not reach the assistant just now. Please try again, or use WhatsApp for a direct reply." };
    }

    const payload = (await response.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const reply = payload.choices?.[0]?.message?.content?.trim();
    return { reply: reply || "Sorry, I did not catch that. Could you rephrase your question?" };
  });
