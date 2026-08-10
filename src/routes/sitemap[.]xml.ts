import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

const BASE_URL = "https://neweradynasty-hub.lovable.app";

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const paths = ["/", "/about", "/portfolio", "/labs", "/labs/calculator", "/labs/cv-builder", "/labs/amd-bot", "/labs/ndingubani-tv", "/services", "/vision", "/gallery", "/blog", "/awards", "/testimonials", "/contact"];
        const urls = paths.map(p => `  <url><loc>${BASE_URL}${p}</loc><changefreq>weekly</changefreq></url>`).join("\n");
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" } });
      },
    },
  },
});
