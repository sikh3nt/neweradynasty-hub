export type CvTemplate = "dynasty" | "classic" | "minimal";

export type CvExperience = {
  role: string;
  company: string;
  period: string;
  detail: string;
};

export type CvEducation = {
  qualification: string;
  institution: string;
  period: string;
};

export type CvData = {
  fullName: string;
  jobTitle: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  skills: string;
  experience: CvExperience[];
  education: CvEducation[];
  references: string;
};

export const emptyCv: CvData = {
  fullName: "",
  jobTitle: "",
  email: "",
  phone: "",
  location: "",
  summary: "",
  skills: "",
  experience: [{ role: "", company: "", period: "", detail: "" }],
  education: [{ qualification: "", institution: "", period: "" }],
  references: "",
};

export const sampleCv: CvData = {
  fullName: "Lindiwe Mbeki",
  jobTitle: "Junior Operations Coordinator",
  email: "lindiwe.mbeki@example.co.za",
  phone: "+27 82 000 0000",
  location: "Gqeberha, Eastern Cape",
  summary:
    "Detail-focused coordinator with three years of experience keeping busy retail operations running on time and on budget. Comfortable owning stock counts, supplier follow-ups and weekly reporting.",
  skills:
    "Stock control, Supplier liaison, Microsoft Excel, Rostering, Customer service, Report writing",
  experience: [
    {
      role: "Operations Assistant",
      company: "Baywest Retail Group",
      period: "03/2023 – present",
      detail:
        "Run daily stock counts across four departments, resolve supplier shortfalls and prepare the weekly variance report for the store manager.",
    },
    {
      role: "Floor Supervisor",
      company: "Motherwell Trading Co.",
      period: "01/2021 – 02/2023",
      detail:
        "Supervised a team of six, built the weekly roster and cut stock losses by a quarter over two trading seasons.",
    },
  ],
  education: [
    {
      qualification: "National Diploma in Business Management",
      institution: "Nelson Mandela University",
      period: "2018 – 2020",
    },
    {
      qualification: "National Senior Certificate",
      institution: "Ndzondelelo High School",
      period: "2017",
    },
  ],
  references: "Available on request.",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function templateStyles(template: CvTemplate): string {
  const shared = `
    * { box-sizing: border-box; }
    body { margin: 0; padding: 40px; font-size: 12pt; line-height: 1.5; color: #14181f; background: #fff; }
    h1 { margin: 0; font-size: 26pt; letter-spacing: -0.5px; }
    h2 { margin: 26px 0 10px; font-size: 12pt; text-transform: uppercase; letter-spacing: 2px; }
    p { margin: 0 0 8px; }
    ul { margin: 0; padding-left: 18px; }
    .title { font-size: 13pt; margin-top: 4px; }
    .contact { font-size: 10pt; margin-top: 8px; }
    .item { margin-bottom: 14px; }
    .item-head { display: flex; justify-content: space-between; gap: 16px; font-weight: 600; }
    .period { font-weight: 400; white-space: nowrap; }
    .muted { color: #5b6472; }
    @page { margin: 16mm; }
  `;

  if (template === "classic") {
    return `${shared}
      body { font-family: Georgia, "Times New Roman", serif; }
      header { text-align: center; border-bottom: 2px solid #14181f; padding-bottom: 14px; }
      h2 { border-bottom: 1px solid #c9ced6; padding-bottom: 4px; }
    `;
  }

  if (template === "minimal") {
    return `${shared}
      body { font-family: Helvetica, Arial, sans-serif; }
      header { padding-bottom: 12px; }
      h1 { font-weight: 500; }
      h2 { color: #5b6472; letter-spacing: 3px; }
    `;
  }

  return `${shared}
    body { font-family: Helvetica, Arial, sans-serif; }
    header { border-left: 5px solid #b8892b; padding: 4px 0 12px 16px; }
    h1 { color: #14181f; }
    .title { color: #b8892b; font-weight: 600; }
    h2 { color: #b8892b; border-bottom: 1px solid #e3d5ba; padding-bottom: 4px; }
  `;
}

/** Builds a standalone, print-ready HTML document for the CV. */
export function buildCvHtml(data: CvData, template: CvTemplate): string {
  const skills = data.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  const experience = data.experience.filter((item) => item.role || item.company);
  const education = data.education.filter((item) => item.qualification || item.institution);

  const contactLine = [data.email, data.phone, data.location]
    .filter(Boolean)
    .map(escapeHtml)
    .join(" · ");

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8" />
<title>${escapeHtml(data.fullName || "Curriculum Vitae")}</title>
<style>${templateStyles(template)}</style>
</head><body>
<header>
  <h1>${escapeHtml(data.fullName || "Your name")}</h1>
  ${data.jobTitle ? `<div class="title">${escapeHtml(data.jobTitle)}</div>` : ""}
  ${contactLine ? `<div class="contact muted">${contactLine}</div>` : ""}
</header>
${data.summary ? `<h2>Profile</h2><p>${escapeHtml(data.summary)}</p>` : ""}
${skills.length ? `<h2>Skills</h2><ul>${skills.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>` : ""}
${
  experience.length
    ? `<h2>Experience</h2>${experience
        .map(
          (item) => `<div class="item">
    <div class="item-head"><span>${escapeHtml(item.role)}${item.company ? ` — ${escapeHtml(item.company)}` : ""}</span><span class="period muted">${escapeHtml(item.period)}</span></div>
    ${item.detail ? `<p class="muted">${escapeHtml(item.detail)}</p>` : ""}
  </div>`,
        )
        .join("")}`
    : ""
}
${
  education.length
    ? `<h2>Education</h2>${education
        .map(
          (item) => `<div class="item">
    <div class="item-head"><span>${escapeHtml(item.qualification)}${item.institution ? ` — ${escapeHtml(item.institution)}` : ""}</span><span class="period muted">${escapeHtml(item.period)}</span></div>
  </div>`,
        )
        .join("")}`
    : ""
}
${data.references ? `<h2>References</h2><p>${escapeHtml(data.references)}</p>` : ""}
</body></html>`;
}

/**
 * Builds a Word-compatible document. Word ignores flexbox and most modern CSS,
 * so the layout is rebuilt with tables and inline styles it understands.
 */
export function buildCvWordDocument(data: CvData, template: CvTemplate): string {
  const serif = template === "classic";
  const bodyFont = serif ? "Georgia, 'Times New Roman', serif" : "Calibri, Arial, sans-serif";
  const accent = template === "dynasty" ? "#b8892b" : template === "minimal" ? "#5b6472" : "#14181f";
  const centered = serif;

  const skills = data.skills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);
  const experience = data.experience.filter((item) => item.role || item.company);
  const education = data.education.filter((item) => item.qualification || item.institution);
  const contactLine = [data.email, data.phone, data.location]
    .filter(Boolean)
    .map(escapeHtml)
    .join(" &#183; ");

  const heading = (label: string): string =>
    `<p style="margin:18pt 0 6pt;font-size:11pt;font-weight:bold;letter-spacing:1pt;text-transform:uppercase;color:${accent};border-bottom:1pt solid ${accent};">${label}</p>`;

  const row = (left: string, right: string): string =>
    `<table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin:0 0 2pt;"><tr>
      <td style="font-size:11pt;font-weight:bold;vertical-align:top;">${left}</td>
      <td width="130" align="right" style="font-size:10pt;color:#5b6472;vertical-align:top;white-space:nowrap;">${right}</td>
    </tr></table>`;

  const align = centered ? "center" : "left";

  return `<!DOCTYPE html>
<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8" />
<title>${escapeHtml(data.fullName || "Curriculum Vitae")}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
@page { size: 21cm 29.7cm; margin: 2cm; }
body { font-family: ${bodyFont}; font-size: 11pt; line-height: 1.4; color: #14181f; }
p { margin: 0 0 6pt; }
ul { margin: 0 0 6pt 18pt; padding: 0; }
li { font-size: 11pt; margin: 0 0 3pt; }
</style>
</head><body>
<p style="margin:0;font-size:24pt;font-weight:bold;text-align:${align};">${escapeHtml(data.fullName || "Your name")}</p>
${data.jobTitle ? `<p style="margin:2pt 0 0;font-size:13pt;color:${accent};text-align:${align};">${escapeHtml(data.jobTitle)}</p>` : ""}
${contactLine ? `<p style="margin:4pt 0 0;font-size:10pt;color:#5b6472;text-align:${align};">${contactLine}</p>` : ""}
<p style="margin:8pt 0 0;border-bottom:2pt solid ${accent};font-size:1pt;">&nbsp;</p>
${data.summary ? `${heading("Profile")}<p>${escapeHtml(data.summary)}</p>` : ""}
${skills.length ? `${heading("Skills")}<ul>${skills.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ul>` : ""}
${
  experience.length
    ? `${heading("Experience")}${experience
        .map(
          (item) =>
            `${row(
              `${escapeHtml(item.role)}${item.company ? ` &#8212; ${escapeHtml(item.company)}` : ""}`,
              escapeHtml(item.period),
            )}${item.detail ? `<p style="font-size:10.5pt;color:#5b6472;margin:0 0 10pt;">${escapeHtml(item.detail)}</p>` : `<p style="margin:0 0 8pt;font-size:1pt;">&nbsp;</p>`}`,
        )
        .join("")}`
    : ""
}
${
  education.length
    ? `${heading("Education")}${education
        .map(
          (item) =>
            `${row(
              `${escapeHtml(item.qualification)}${item.institution ? ` &#8212; ${escapeHtml(item.institution)}` : ""}`,
              escapeHtml(item.period),
            )}<p style="margin:0 0 8pt;font-size:1pt;">&nbsp;</p>`,
        )
        .join("")}`
    : ""
}
${data.references ? `${heading("References")}<p>${escapeHtml(data.references)}</p>` : ""}
</body></html>`;
}


/** Turns a person's name into a safe download file name. */
export function cvFileName(fullName: string, extension: string): string {
  const base = fullName
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${base || "curriculum-vitae"}-cv.${extension}`;
}
