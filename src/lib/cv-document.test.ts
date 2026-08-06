import { describe, expect, it } from "vitest";
import { buildCvHtml, cvFileName, sampleCv } from "./cv-document";

describe("buildCvHtml", () => {
  it("includes the person's details", () => {
    const html = buildCvHtml(sampleCv, "dynasty");
    expect(html).toContain("Lindiwe Mbeki");
    expect(html).toContain("Junior Operations Coordinator");
    expect(html).toContain("Baywest Retail Group");
  });

  it("splits skills into list items", () => {
    const html = buildCvHtml({ ...sampleCv, skills: "Excel, Rostering" }, "minimal");
    expect(html).toContain("<li>Excel</li>");
    expect(html).toContain("<li>Rostering</li>");
  });

  it("escapes user input", () => {
    const html = buildCvHtml({ ...sampleCv, fullName: "<script>bad</script>" }, "classic");
    expect(html).not.toContain("<script>bad");
    expect(html).toContain("&lt;script&gt;");
  });

  it("omits empty sections", () => {
    const html = buildCvHtml({ ...sampleCv, references: "" }, "dynasty");
    expect(html).not.toContain("References");
  });
});

describe("cvFileName", () => {
  it("slugifies the name", () => {
    expect(cvFileName("Lindiwe Mbeki", "pdf")).toBe("lindiwe-mbeki-cv.pdf");
  });

  it("falls back when the name is blank", () => {
    expect(cvFileName("   ", "doc")).toBe("curriculum-vitae-cv.doc");
  });
});
