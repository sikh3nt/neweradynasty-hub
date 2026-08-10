import { jsPDF } from "jspdf";
import type { CvData, CvTemplate } from "./cv-document";

type Theme = {
  font: "helvetica" | "times";
  accent: [number, number, number];
  centerHeader: boolean;
  rule: boolean;
};

const themes: Record<CvTemplate, Theme> = {
  dynasty: { font: "helvetica", accent: [184, 137, 43], centerHeader: false, rule: true },
  classic: { font: "times", accent: [20, 24, 31], centerHeader: true, rule: true },
  minimal: { font: "helvetica", accent: [91, 100, 114], centerHeader: false, rule: false },
};

const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const MARGIN = 16;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

/** Renders the CV as a real, multi-page PDF file. */
export function buildCvPdf(data: CvData, template: CvTemplate): Blob {
  const theme = themes[template];
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  let y = MARGIN;

  const ensureSpace = (needed: number): void => {
    if (y + needed > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  const text = (
    value: string,
    options: { size: number; style?: "normal" | "bold" | "italic"; color?: [number, number, number]; align?: "left" | "center"; width?: number; x?: number },
  ): void => {
    doc.setFont(theme.font, options.style ?? "normal");
    doc.setFontSize(options.size);
    const color = options.color ?? [20, 24, 31];
    doc.setTextColor(color[0], color[1], color[2]);
    const width = options.width ?? CONTENT_WIDTH;
    const lines = doc.splitTextToSize(value, width) as string[];
    const lineHeight = options.size * 0.45;
    ensureSpace(lines.length * lineHeight);
    const x = options.x ?? (options.align === "center" ? PAGE_WIDTH / 2 : MARGIN);
    doc.text(lines, x, y + lineHeight * 0.8, { align: options.align ?? "left" });
    y += lines.length * lineHeight;
  };

  const heading = (label: string): void => {
    ensureSpace(14);
    y += 5;
    text(label.toUpperCase(), { size: 11, style: "bold", color: theme.accent });
    if (theme.rule) {
      doc.setDrawColor(theme.accent[0], theme.accent[1], theme.accent[2]);
      doc.setLineWidth(0.3);
      doc.line(MARGIN, y + 1.2, PAGE_WIDTH - MARGIN, y + 1.2);
    }
    y += 4;
  };

  const align = theme.centerHeader ? "center" : "left";

  text(data.fullName || "Your name", { size: 24, style: "bold", align });
  if (data.jobTitle) {
    y += 1;
    text(data.jobTitle, { size: 13, color: theme.accent, align });
  }
  const contact = [data.email, data.phone, data.location].filter(Boolean).join("  ·  ");
  if (contact) {
    y += 1;
    text(contact, { size: 10, color: [91, 100, 114], align });
  }
  y += 2;
  doc.setDrawColor(theme.accent[0], theme.accent[1], theme.accent[2]);
  doc.setLineWidth(0.6);
  doc.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 2;

  if (data.summary) {
    heading("Profile");
    text(data.summary, { size: 10.5 });
  }

  const skills = data.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  if (skills.length) {
    heading("Skills");
    const columnWidth = CONTENT_WIDTH / 2 - 4;
    for (let i = 0; i < skills.length; i += 2) {
      const rowTop = y;
      text(`•  ${skills[i]}`, { size: 10.5, width: columnWidth });
      const leftBottom = y;
      if (skills[i + 1]) {
        y = rowTop;
        text(`•  ${skills[i + 1]}`, {
          size: 10.5,
          width: columnWidth,
          x: MARGIN + CONTENT_WIDTH / 2,
        });
      }
      y = Math.max(leftBottom, y);
    }
  }

  const experience = data.experience.filter((item) => item.role || item.company);
  if (experience.length) {
    heading("Experience");
    experience.forEach((item) => {
      ensureSpace(16);
      const title = [item.role, item.company].filter(Boolean).join(" — ");
      const top = y;
      text(title, { size: 11, style: "bold", width: CONTENT_WIDTH - 40 });
      if (item.period) {
        const bottom = y;
        y = top;
        doc.setFont(theme.font, "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(91, 100, 114);
        doc.text(item.period, PAGE_WIDTH - MARGIN, y + 4, { align: "right" });
        y = bottom;
      }
      if (item.detail) {
        text(item.detail, { size: 10, color: [91, 100, 114] });
      }
      y += 3;
    });
  }

  const education = data.education.filter((item) => item.qualification || item.institution);
  if (education.length) {
    heading("Education");
    education.forEach((item) => {
      ensureSpace(12);
      const title = [item.qualification, item.institution].filter(Boolean).join(" — ");
      const top = y;
      text(title, { size: 11, style: "bold", width: CONTENT_WIDTH - 40 });
      if (item.period) {
        const bottom = y;
        y = top;
        doc.setFont(theme.font, "normal");
        doc.setFontSize(9.5);
        doc.setTextColor(91, 100, 114);
        doc.text(item.period, PAGE_WIDTH - MARGIN, y + 4, { align: "right" });
        y = bottom;
      }
      y += 3;
    });
  }

  if (data.references) {
    heading("References");
    text(data.references, { size: 10.5 });
  }

  return doc.output("blob");
}
