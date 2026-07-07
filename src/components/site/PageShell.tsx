import type { ReactNode } from "react";

export function PageShell({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <main className="pt-28 sm:pt-36 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {eyebrow && (
            <div className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs uppercase tracking-[0.2em] text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> {eyebrow}
            </div>
          )}
          <h1 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl leading-[1.05] text-foreground">
            {title}
          </h1>
          {intro && <p className="mt-6 text-base sm:text-lg text-muted-foreground max-w-2xl">{intro}</p>}
        </div>
        <div className="mt-12">{children}</div>
      </div>
    </main>
  );
}
