import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, FlaskConical, ShieldCheck } from "lucide-react";
import { useDemoView } from "@/lib/analytics";

export function LabShell({
  demo,
  eyebrow,
  title,
  intro,
  notice,
  children,
}: {
  demo?: string;
  eyebrow: string;
  title: string;
  intro: string;
  notice?: string;
  children: ReactNode;
}) {
  useDemoView(demo);


  return (
    <main className="pt-28 sm:pt-36 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Link
          to="/labs"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-luxury"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All demos
        </Link>

        <div className="mt-6 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary">
            <FlaskConical className="h-3 w-3" /> {eyebrow}
          </div>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl leading-[1.05] text-foreground">
            {title}
          </h1>
          <p className="mt-5 text-base text-muted-foreground">{intro}</p>
          {notice && (
            <p className="mt-4 rounded-2xl glass px-4 py-3 text-xs text-muted-foreground">
              {notice}
            </p>
          )}
        </div>

        <div className="mt-10">{children}</div>
      </div>
    </main>
  );
}
