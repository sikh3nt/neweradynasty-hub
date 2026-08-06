import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Download, FileText, Plus, Trash2, Wand2 } from "lucide-react";
import { LabShell } from "@/components/labs/LabShell";
import {
  buildCvHtml,
  buildCvWordDocument,
  cvFileName,
  emptyCv,
  sampleCv,
  type CvData,
  type CvTemplate,
} from "@/lib/cv-document";

export const Route = createFileRoute("/labs/cv-builder")({
  head: () => ({
    meta: [
      { title: "Free CV builder — make a résumé online | New Era Dynasty" },
      { name: "description", content: "Build a professional CV in minutes: fill in a guided form, pick a template and download it as a PDF or Word file. Free, no sign-in." },
      { property: "og:title", content: "Free CV / résumé builder" },
      { property: "og:description", content: "Guided form, three templates, instant PDF or Word download. Built by Tozamile Sikhenjana." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { property: "og:url", content: "https://neweradynasty-hub.lovable.app/labs/cv-builder" },
    ],
    links: [{ rel: "canonical", href: "https://neweradynasty-hub.lovable.app/labs/cv-builder" }],
  }),
  component: CvBuilderDemo,
});

const templates: { id: CvTemplate; name: string; blurb: string }[] = [
  { id: "dynasty", name: "Dynasty", blurb: "Gold accents, modern sans" },
  { id: "classic", name: "Classic", blurb: "Centred serif, formal" },
  { id: "minimal", name: "Minimal", blurb: "Quiet, lots of white space" },
];

const fieldClass =
  "w-full rounded-xl border border-border bg-black/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary transition-luxury";

function Label({ children }: { children: string }) {
  return <span className="mb-1.5 block text-xs uppercase tracking-[0.15em] text-muted-foreground">{children}</span>;
}

function CvBuilderDemo() {
  const [data, setData] = useState<CvData>(emptyCv);
  const [template, setTemplate] = useState<CvTemplate>("dynasty");

  const html = useMemo(() => buildCvHtml(data, template), [data, template]);

  const update = <K extends keyof CvData>(key: K, value: CvData[K]): void => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const downloadPdf = (): void => {
    const frame = document.createElement("iframe");
    frame.style.position = "fixed";
    frame.style.right = "100%";
    frame.style.width = "0";
    frame.style.height = "0";
    frame.srcdoc = html;
    frame.onload = () => {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
      window.setTimeout(() => frame.remove(), 1000);
    };
    document.body.appendChild(frame);
  };

  const downloadWord = (): void => {
    const blob = new Blob([buildCvWordDocument(data, template)], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = cvFileName(data.fullName, "doc");
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <LabShell
      eyebrow="Live demo · Career tool"
      title="CV / résumé builder."
      intro="Fill in the form, choose a template and download a polished CV as a PDF or an editable Word file. No design skills needed."
      notice="Nothing is saved. Your details live only in this browser tab and disappear when you close it."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="glass-strong rounded-3xl p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-2xl text-foreground">Your details</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setData(sampleCv)}
                className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-luxury"
              >
                <Wand2 className="h-3.5 w-3.5" /> Load example
              </button>
              <button
                type="button"
                onClick={() => setData(emptyCv)}
                className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-luxury"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label>
              <Label>Full name</Label>
              <input className={fieldClass} value={data.fullName} onChange={(e) => update("fullName", e.target.value)} placeholder="Lindiwe Mbeki" />
            </label>
            <label>
              <Label>Job title</Label>
              <input className={fieldClass} value={data.jobTitle} onChange={(e) => update("jobTitle", e.target.value)} placeholder="Operations Coordinator" />
            </label>
            <label>
              <Label>Email</Label>
              <input className={fieldClass} type="email" value={data.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.co.za" />
            </label>
            <label>
              <Label>Phone</Label>
              <input className={fieldClass} value={data.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+27 82 000 0000" />
            </label>
            <label className="sm:col-span-2">
              <Label>Location</Label>
              <input className={fieldClass} value={data.location} onChange={(e) => update("location", e.target.value)} placeholder="Gqeberha, Eastern Cape" />
            </label>
            <label className="sm:col-span-2">
              <Label>Profile summary</Label>
              <textarea className={`${fieldClass} min-h-24`} value={data.summary} onChange={(e) => update("summary", e.target.value)} placeholder="Two or three sentences about who you are and what you do well." />
            </label>
            <label className="sm:col-span-2">
              <Label>Skills (separate with commas)</Label>
              <input className={fieldClass} value={data.skills} onChange={(e) => update("skills", e.target.value)} placeholder="Stock control, Excel, Customer service" />
            </label>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-foreground">Experience</h3>
              <button
                type="button"
                onClick={() => update("experience", [...data.experience, { role: "", company: "", period: "", detail: "" }])}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-3 py-1.5 text-xs text-primary hover:bg-primary/20 transition-luxury"
              >
                <Plus className="h-3.5 w-3.5" /> Add role
              </button>
            </div>
            <div className="mt-4 grid gap-4">
              {data.experience.map((item, index) => (
                <div key={index} className="rounded-2xl border border-border p-4 grid gap-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className={fieldClass} value={item.role} placeholder="Job title" onChange={(e) => update("experience", data.experience.map((row, i) => (i === index ? { ...row, role: e.target.value } : row)))} />
                    <input className={fieldClass} value={item.company} placeholder="Company" onChange={(e) => update("experience", data.experience.map((row, i) => (i === index ? { ...row, company: e.target.value } : row)))} />
                  </div>
                  <input className={fieldClass} value={item.period} placeholder="03/2023 – present" onChange={(e) => update("experience", data.experience.map((row, i) => (i === index ? { ...row, period: e.target.value } : row)))} />
                  <textarea className={`${fieldClass} min-h-20`} value={item.detail} placeholder="What you were responsible for and what you achieved." onChange={(e) => update("experience", data.experience.map((row, i) => (i === index ? { ...row, detail: e.target.value } : row)))} />
                  {data.experience.length > 1 && (
                    <button
                      type="button"
                      onClick={() => update("experience", data.experience.filter((_, i) => i !== index))}
                      className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-luxury"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove role
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg text-foreground">Education</h3>
              <button
                type="button"
                onClick={() => update("education", [...data.education, { qualification: "", institution: "", period: "" }])}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-3 py-1.5 text-xs text-primary hover:bg-primary/20 transition-luxury"
              >
                <Plus className="h-3.5 w-3.5" /> Add qualification
              </button>
            </div>
            <div className="mt-4 grid gap-4">
              {data.education.map((item, index) => (
                <div key={index} className="rounded-2xl border border-border p-4 grid gap-3">
                  <input className={fieldClass} value={item.qualification} placeholder="Qualification" onChange={(e) => update("education", data.education.map((row, i) => (i === index ? { ...row, qualification: e.target.value } : row)))} />
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input className={fieldClass} value={item.institution} placeholder="Institution" onChange={(e) => update("education", data.education.map((row, i) => (i === index ? { ...row, institution: e.target.value } : row)))} />
                    <input className={fieldClass} value={item.period} placeholder="2018 – 2020" onChange={(e) => update("education", data.education.map((row, i) => (i === index ? { ...row, period: e.target.value } : row)))} />
                  </div>
                  {data.education.length > 1 && (
                    <button
                      type="button"
                      onClick={() => update("education", data.education.filter((_, i) => i !== index))}
                      className="inline-flex w-fit items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-luxury"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <label className="mt-8 block">
            <Label>References</Label>
            <input className={fieldClass} value={data.references} onChange={(e) => update("references", e.target.value)} placeholder="Available on request." />
          </label>
        </div>

        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="glass-strong rounded-3xl p-6 md:p-8">
            <h2 className="font-display text-2xl text-foreground">Template & preview</h2>

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {templates.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id)}
                  className={`rounded-2xl border px-3 py-3 text-left transition-luxury ${
                    template === t.id ? "border-primary/60 bg-primary/10" : "border-border hover:border-primary/40"
                  }`}
                >
                  <span className={`block text-sm ${template === t.id ? "text-primary" : "text-foreground"}`}>{t.name}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">{t.blurb}</span>
                </button>
              ))}
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-white">
              <iframe title="CV preview" srcDoc={html} className="h-[640px] w-full" />
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={downloadPdf}
                className="inline-flex items-center gap-2 rounded-full bg-[image:var(--gradient-royal)] px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-glow-gold hover:brightness-110 transition-luxury"
              >
                <FileText className="h-4 w-4" /> Download PDF
              </button>
              <button
                type="button"
                onClick={downloadWord}
                className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/30 px-5 py-2.5 text-sm text-primary hover:bg-primary/20 transition-luxury"
              >
                <Download className="h-4 w-4" /> Download Word
              </button>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              PDF opens your browser's print dialog — choose "Save as PDF" as the destination.
            </p>
          </div>
        </div>
      </div>
    </LabShell>
  );
}
