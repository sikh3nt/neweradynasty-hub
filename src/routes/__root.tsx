import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/jetbrains-mono/400.css";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Toaster } from "sonner";
import { ChatWidget } from "@/components/site/ChatWidget";
import { supabase } from "@/integrations/supabase/client";

function NotFoundComponent() {
  return (
    <div className="flex min-h-dvh items-center justify-center hero-bg px-4">
      <div className="max-w-md text-center glass-strong rounded-3xl p-10">
        <div className="font-display text-7xl text-gold-gradient">404</div>
        <h2 className="mt-4 text-xl font-semibold">Lost in the Dynasty</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-[image:var(--gradient-royal)] px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow-gold">
          Return home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-dvh items-center justify-center hero-bg px-4">
      <div className="max-w-md text-center glass-strong rounded-3xl p-10">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">A momentary disruption. Try again or head home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-full bg-[image:var(--gradient-royal)] px-4 py-2 text-sm font-medium text-primary-foreground">Try again</button>
          <a href="/" className="rounded-full border border-border px-4 py-2 text-sm">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Tozamile Sikhenjana — Founder & CEO of New Era Dynasty" },
      { name: "description", content: "Multidisciplinary entrepreneur from Motherwell, Gqeberha. Technology, business, community. Founder of New Era Dynasty, WireNet, and Blackstyle Barbershop." },
      { name: "author", content: "Tozamile Sikhenjana" },
      { name: "theme-color", content: "#0b0d14" },
      { property: "og:title", content: "Tozamile Sikhenjana — Founder & CEO of New Era Dynasty" },
      { property: "og:description", content: "Multidisciplinary entrepreneur from Motherwell, Gqeberha. Technology, business, community. Founder of New Era Dynasty, WireNet, and Blackstyle Barbershop." },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "New Era Dynasty" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Tozamile Sikhenjana — Founder & CEO of New Era Dynasty" },
      { name: "twitter:description", content: "Multidisciplinary entrepreneur from Motherwell, Gqeberha. Technology, business, community. Founder of New Era Dynasty, WireNet, and Blackstyle Barbershop." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/u913eolSbhc9BrWB2vOXu4D8g0k2/social-images/social-1783476624226-03_New_Era_Dynasty.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/u913eolSbhc9BrWB2vOXu4D8g0k2/social-images/social-1783476624226-03_New_Era_Dynasty.webp" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://neweradynasty-hub.lovable.app/#organization",
              name: "New Era Dynasty",
              url: "https://neweradynasty-hub.lovable.app/",
              logo: "https://storage.googleapis.com/gpt-engineer-file-uploads/u913eolSbhc9BrWB2vOXu4D8g0k2/social-images/social-1783476624226-03_New_Era_Dynasty.webp",
              founder: { "@id": "https://neweradynasty-hub.lovable.app/about#person" },
              areaServed: "ZA",
              email: "tozamilesikh3njana@proton.me",
              telephone: "+27650570489",
              address: { "@type": "PostalAddress", addressLocality: "Motherwell, Gqeberha", addressRegion: "Eastern Cape", addressCountry: "ZA" },
              sameAs: [],
            },
            {
              "@type": "WebSite",
              "@id": "https://neweradynasty-hub.lovable.app/#website",
              url: "https://neweradynasty-hub.lovable.app/",
              name: "New Era Dynasty",
              publisher: { "@id": "https://neweradynasty-hub.lovable.app/#organization" },
            },
          ],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function AppFrame() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const inPortal = pathname.startsWith("/portal") || pathname.startsWith("/admin");
  return (
    <>
      {!inPortal && <Header />}
      <Outlet />
      {!inPortal && <Footer />}
      <Toaster theme="dark" position="top-right" richColors />
    </>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      router.invalidate();
      if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
    });
    return () => sub.subscription.unsubscribe();
  }, [queryClient, router]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppFrame />
    </QueryClientProvider>
  );
}
