import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const outputDir = path.join(rootDir, "dist", "public");

dotenv.config({ path: path.join(rootDir, ".env.local") });
dotenv.config({ path: path.join(rootDir, ".env") });

const fallbackSiteUrl = "https://bocra-website-gilt.vercel.app";
const siteUrl = new URL(process.env.VITE_SITE_URL || fallbackSiteUrl);
const baseUrl = siteUrl.toString().replace(/\/$/, "");

const staticRoutes = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/services", changefreq: "weekly", priority: "0.9" },
  { path: "/services/spectrum", changefreq: "monthly", priority: "0.7" },
  { path: "/services/licensing", changefreq: "weekly", priority: "0.8" },
  { path: "/services/complaints", changefreq: "weekly", priority: "0.8" },
  { path: "/services/domain-registry", changefreq: "monthly", priority: "0.7" },
  { path: "/services/broadcasting", changefreq: "monthly", priority: "0.7" },
  { path: "/services/cybersecurity", changefreq: "monthly", priority: "0.7" },
  { path: "/news", changefreq: "daily", priority: "0.9" },
  { path: "/publications", changefreq: "weekly", priority: "0.8" },
  { path: "/consultations", changefreq: "weekly", priority: "0.8" },
  { path: "/contact", changefreq: "monthly", priority: "0.7" },
];

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function buildUrlEntry({ path: routePath, changefreq, priority, lastmod }) {
  const lines = [
    "  <url>",
    `    <loc>${escapeXml(`${baseUrl}${routePath}`)}</loc>`,
  ];

  if (lastmod) {
    lines.push(`    <lastmod>${escapeXml(lastmod)}</lastmod>`);
  }

  lines.push(`    <changefreq>${changefreq}</changefreq>`);
  lines.push(`    <priority>${priority}</priority>`);
  lines.push("  </url>");

  return lines.join("\n");
}

async function fetchDynamicRoutes() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return [];
  }

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  const [newsResult, consultationsResult] = await Promise.allSettled([
    supabase
      .from("news")
      .select("slug, published_at")
      .eq("published", true),
    supabase
      .from("consultations")
      .select("id, created_at")
      .order("end_date", { ascending: true }),
  ]);

  const routes = [];

  if (newsResult.status === "fulfilled" && !newsResult.value.error) {
    routes.push(
      ...newsResult.value.data.map((item) => ({
        path: `/news/${item.slug}`,
        changefreq: "monthly",
        priority: "0.7",
        lastmod: item.published_at
          ? new Date(item.published_at).toISOString()
          : undefined,
      }))
    );
  }

  if (
    consultationsResult.status === "fulfilled" &&
    !consultationsResult.value.error
  ) {
    routes.push(
      ...consultationsResult.value.data.map((item) => ({
        path: `/consultations/${item.id}`,
        changefreq: "weekly",
        priority: "0.7",
        lastmod: item.created_at
          ? new Date(item.created_at).toISOString()
          : undefined,
      }))
    );
  }

  return routes;
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });

  const dynamicRoutes = await fetchDynamicRoutes();
  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  const robots = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin",
    "Disallow: /portal",
    `Sitemap: ${baseUrl}/sitemap.xml`,
    "",
  ].join("\n");

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allRoutes.map((route) => buildUrlEntry(route)),
    "</urlset>",
    "",
  ].join("\n");

  fs.writeFileSync(path.join(outputDir, "robots.txt"), robots, "utf-8");
  fs.writeFileSync(path.join(outputDir, "sitemap.xml"), sitemap, "utf-8");

  console.log(
    JSON.stringify(
      {
        siteUrl: baseUrl,
        staticRoutes: staticRoutes.length,
        dynamicRoutes: dynamicRoutes.length,
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
