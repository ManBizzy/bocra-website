import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");

dotenv.config({ path: path.join(rootDir, ".env.local") });
dotenv.config({ path: path.join(rootDir, ".env") });

const DEFAULT_BASE_URL = "https://www.bocra.org.bw/documents%26legislation";
const DEFAULT_MAX_PAGE = 20;
const STORAGE_BUCKET = "publications";
const STORAGE_PREFIX = "bocra-documents";
const STORAGE_ALLOWED_MIME_TYPES = ["application/pdf"];
const STORAGE_FILE_SIZE_LIMIT = 50 * 1024 * 1024;

const CATEGORY_DESCRIPTIONS = {
  acts_and_bills:
    "Legislation, bills, regulations, and other statutory reference documents.",
  annual_reports:
    "Annual reporting, performance reporting, and formal institutional disclosures.",
  consultations_and_drafts:
    "Draft documents, consultations, and discussion material published for stakeholder review.",
  forms_and_applications:
    "Application forms, submission forms, and related filing templates.",
  general_publications:
    "General-purpose BOCRA publication imported from the Documents & Legislation archive.",
  guidelines:
    "Guidelines, advisory material, and operational compliance references.",
  licensing_and_type_approval:
    "Licensing, licence application, and type-approval related reference material.",
  policies_and_frameworks:
    "Policy documents, frameworks, and formal strategic reference material.",
  presentations_and_workshops:
    "Presentations, workshop material, and event-related reference documents.",
  procedures_and_directives:
    "Procedures, directives, rulings, determinations, and process documents.",
  registers_and_lists:
    "Reference lists, registers, allocation lists, and published operator or product indexes.",
  reports_and_studies:
    "Reports, studies, market reviews, surveys, and analytical publications.",
  strategies_and_plans:
    "Strategies, plans, roadmaps, and long-range reference documents.",
  standards_and_specifications:
    "Standards, specifications, numbering plans, technical requirements, and codes.",
};

function parseArgs(argv) {
  const args = {
    apply: false,
    out: null,
    maxPage: DEFAULT_MAX_PAGE,
    concurrency: 5,
  };

  for (const value of argv) {
    if (value === "--apply") {
      args.apply = true;
      continue;
    }

    if (value.startsWith("--out=")) {
      args.out = value.slice("--out=".length);
      continue;
    }

    if (value.startsWith("--max-page=")) {
      args.maxPage = Number.parseInt(value.slice("--max-page=".length), 10);
      continue;
    }

    if (value.startsWith("--concurrency=")) {
      args.concurrency = Number.parseInt(
        value.slice("--concurrency=".length),
        10
      );
    }
  }

  return args;
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
}

function decodeHtmlEntities(value) {
  return value
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([\da-f]+);/gi, (_, code) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    )
    .replace(/&amp;/g, "&")
    .replace(/&apos;|&#39;|&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&nbsp;/g, " ")
    .replace(/&ndash;/g, "-")
    .replace(/&mdash;/g, "-");
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function shortHash(value) {
  return crypto.createHash("sha1").update(value).digest("hex").slice(0, 8);
}

function sanitizeFileName(value) {
  return (
    slugify(value)
      .slice(0, 120)
      .replace(/^-+|-+$/g, "") || "document"
  );
}

function classifyCategory(title, fileUrl) {
  const haystack = `${title} ${fileUrl}`.toLowerCase();

  if (
    /\bact\b|\bbill\b|\bregulations?\b|\blegislation\b|\bstatutory\b|\bamendment\b/.test(
      haystack
    )
  ) {
    return "acts_and_bills";
  }

  if (/\bannual report\b|\bannual reports\b/.test(haystack)) {
    return "annual_reports";
  }

  if (
    /\bconsultation\b|\bdraft\b|\bdiscussion paper\b|\bdiscussion\b|\binvitation to apply\b|\bcomment\b/.test(
      haystack
    )
  ) {
    return "consultations_and_drafts";
  }

  if (
    /\bform\b|\bapplication\b|\bkyc\b|\bregister\b|\bregistration\b/.test(
      haystack
    )
  ) {
    return "forms_and_applications";
  }

  if (
    /\bguideline\b|\bguidelines\b|\badvisory\b|\brequirements\b/.test(
      haystack
    )
  ) {
    return "guidelines";
  }

  if (
    /\blicen[cs]e\b|\blicensing\b|\btype approval\b|\bfrequency\b|\bspectrum\b/.test(
      haystack
    )
  ) {
    return "licensing_and_type_approval";
  }

  if (
    /\bpolicy\b|\bpolicies\b|\bframework\b|\bframeworks\b/.test(haystack)
  ) {
    return "policies_and_frameworks";
  }

  if (/\bstrategy\b|\bstrategies\b|\bplan\b|\bplans\b|\bvision\b|\broadmap\b/.test(haystack)) {
    return "strategies_and_plans";
  }

  if (
    /\bprocedure\b|\bprocedures\b|\bdirective\b|\bdirectives\b|\bruling\b|\brulings\b|\bjudgment\b|\bjudgement\b|\bprocess\b|\bdetermination\b|\bassessment procedure\b/.test(
      haystack
    )
  ) {
    return "procedures_and_directives";
  }

  if (
    /\blist of\b|\boperators\b|\boperator\b|\bproviders\b|\bprovider\b|\bproducts and services\b|\bapproved products\b|\bnumbers allocated\b|\blicensed vans\b|\ballocations and assignments\b/.test(
      haystack
    )
  ) {
    return "registers_and_lists";
  }

  if (
    /\bstandard\b|\bstandards\b|\bspecification\b|\bspecifications\b|\bnumbering plan\b|\bcode\b|\btechnical\b|\bequipment\b|\bdevices\b|\bdevice\b|\bhandsets\b|\bhandset\b|\bbase stations\b|\bbase station\b|\breceiver\b|\breceivers\b|\bwifi\b|\bbluetooth\b|\bwimax\b|\blte\b|\bumts\b|\bisdn\b|\bpstn\b|\bsdh\b|\bpmr\b|\bvsat\b|\bamateur radio\b/.test(
      haystack
    )
  ) {
    return "standards_and_specifications";
  }

  if (
    /\bpresentation\b|\bworkshop\b|\bhackathon\b|\bpitso\b|\bbriefing\b/.test(
      haystack
    )
  ) {
    return "presentations_and_workshops";
  }

  if (
    /\breport\b|\breports\b|\bstudy\b|\bstudies\b|\bsurvey\b|\bstatistics\b|\bmarket\b|\breview\b|\bstate of icts\b/.test(
      haystack
    )
  ) {
    return "reports_and_studies";
  }

  return "general_publications";
}

function buildDescription(category) {
  return `Imported from BOCRA's Documents & Legislation archive. ${CATEGORY_DESCRIPTIONS[category]}`;
}

function parseRows(html, page) {
  const rows = [];
  const trMatches = html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);

  for (const trMatch of trMatches) {
    const row = trMatch[0];
    const titleMatch = row.match(/views-field-title[^>]*>([\s\S]*?)<\/td>/i);

    if (!titleMatch) {
      continue;
    }

    const rawTitle = titleMatch[1].replace(/<[^>]+>/g, " ");
    const title = normalizeWhitespace(decodeHtmlEntities(rawTitle));

    if (!title || title === "Document Name") {
      continue;
    }

    const linkMatches = row.matchAll(/<a href="([^"]+)"/gi);

    for (const linkMatch of linkMatches) {
      const href = linkMatch[1].trim();

      if (!href) {
        continue;
      }

      const fileUrl = href.startsWith("http")
        ? href.trim()
        : `https://www.bocra.org.bw${href}`.trim();

      const cleanPath = fileUrl.split("?")[0].trim();
      const extension = path.extname(cleanPath).slice(1).toLowerCase() || "pdf";
      const category = classifyCategory(title, fileUrl);
      const baseSlug = slugify(title) || "publication";
      const slug = `${baseSlug}-${shortHash(fileUrl)}`;

      rows.push({
        page,
        title,
        slug,
        source_url: fileUrl,
        description: buildDescription(category),
        file_url: fileUrl,
        file_type: extension,
        category,
        published: true,
      });
    }
  }

  return rows;
}

async function scrapeArchive(maxPage) {
  const publications = [];

  for (let page = 0; page <= maxPage; page += 1) {
    const url = page === 0 ? DEFAULT_BASE_URL : `${DEFAULT_BASE_URL}?page=${page}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }

    const html = await response.text();
    publications.push(...parseRows(html, page));
  }

  return publications;
}

async function mapWithConcurrency(items, concurrency, mapper) {
  const results = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (true) {
      const index = cursor;
      cursor += 1;

      if (index >= items.length) {
        return;
      }

      results[index] = await mapper(items[index], index);
    }
  }

  const workerCount = Math.min(Math.max(concurrency, 1), items.length || 1);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
  return results;
}

function summarizeCategories(publications) {
  const counts = new Map();

  for (const publication of publications) {
    counts.set(
      publication.category,
      (counts.get(publication.category) || 0) + 1
    );
  }

  return [...counts.entries()]
    .sort((left, right) => right[1] - left[1])
    .map(([category, count]) => ({ category, count }));
}

function buildStoragePath(publication) {
  const sourceUrl = new URL(publication.source_url);
  const decodedName = decodeURIComponent(
    path.basename(sourceUrl.pathname) || `${publication.slug}.pdf`
  );
  const extension =
    path.extname(decodedName).slice(1).toLowerCase() ||
    publication.file_type ||
    "pdf";
  const baseName = sanitizeFileName(
    path.basename(decodedName, path.extname(decodedName)) || publication.title
  );

  return `${STORAGE_PREFIX}/${shortHash(publication.source_url)}-${baseName}.${extension}`;
}

async function ensureStorageBucket(supabase) {
  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    throw error;
  }

  const existingBucket = buckets.find((bucket) => bucket.id === STORAGE_BUCKET);

  if (existingBucket) {
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(
    STORAGE_BUCKET,
    {
      public: true,
      allowedMimeTypes: STORAGE_ALLOWED_MIME_TYPES,
      fileSizeLimit: STORAGE_FILE_SIZE_LIMIT,
    }
  );

  if (createError) {
    throw createError;
  }
}

async function fetchExistingPublicationMap(supabase) {
  const existing = new Map();
  const pageSize = 1000;
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("publications")
      .select("source_url, file_url, storage_bucket, storage_path")
      .range(from, from + pageSize - 1);

    if (error) {
      throw error;
    }

    if (!data.length) {
      break;
    }

    for (const row of data) {
      if (row.source_url) {
        existing.set(row.source_url, row);
      }
    }

    if (data.length < pageSize) {
      break;
    }

    from += pageSize;
  }

  return existing;
}

async function mirrorPublicationToStorage(supabase, publication, existingMap) {
  const existing = existingMap.get(publication.source_url);
  const storagePath = buildStoragePath(publication);
  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

  if (
    existing?.storage_bucket === STORAGE_BUCKET &&
    existing?.storage_path &&
    existing?.file_url
  ) {
    return {
      ...publication,
      file_url: existing.file_url,
      storage_bucket: existing.storage_bucket,
      storage_path: existing.storage_path,
    };
  }

  const existingMirrorResponse = await fetch(publicUrl, { method: "HEAD" });

  if (existingMirrorResponse.ok) {
    return {
      ...publication,
      file_url: publicUrl,
      storage_bucket: STORAGE_BUCKET,
      storage_path: storagePath,
    };
  }

  const response = await fetch(publication.source_url);

  if (!response.ok) {
    throw new Error(
      `Failed to download ${publication.source_url}: ${response.status}`
    );
  }

  const contentType = response.headers.get("content-type") || "application/pdf";
  const buffer = Buffer.from(await response.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, buffer, {
      contentType: contentType.includes("pdf") ? contentType : "application/pdf",
      upsert: true,
      cacheControl: "31536000",
    });

  if (uploadError) {
    throw uploadError;
  }

  return {
    ...publication,
    file_url: publicUrl,
    storage_bucket: STORAGE_BUCKET,
    storage_path: storagePath,
  };
}

async function applyToSupabase(publications) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing VITE_SUPABASE_URL and a server-side Supabase key in .env.local"
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });
  const concurrency = Number.parseInt(
    process.env.BOCRA_PUBLICATIONS_SYNC_CONCURRENCY || "5",
    10
  );

  await ensureStorageBucket(supabase);
  const existingMap = await fetchExistingPublicationMap(supabase);
  const mirroredPublications = await mapWithConcurrency(
    publications,
    concurrency,
    (publication) =>
      mirrorPublicationToStorage(supabase, publication, existingMap)
  );

  const batchSize = 100;

  for (let start = 0; start < mirroredPublications.length; start += batchSize) {
    const batch = mirroredPublications.slice(start, start + batchSize).map((item) => ({
      title: item.title,
      slug: item.slug,
      description: item.description,
      file_url: item.file_url,
      file_type: item.file_type,
      category: item.category,
      published: item.published,
      source_url: item.source_url,
      storage_bucket: item.storage_bucket || STORAGE_BUCKET,
      storage_path: item.storage_path,
    }));

    const { error } = await supabase
      .from("publications")
      .upsert(batch, { onConflict: "source_url" });

    if (error) {
      throw error;
    }
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const publications = await scrapeArchive(args.maxPage);
  const categorySummary = summarizeCategories(publications);

  process.env.BOCRA_PUBLICATIONS_SYNC_CONCURRENCY = String(args.concurrency);

  if (args.out) {
    const outputPath = path.resolve(rootDir, args.out);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(publications, null, 2));
  }

  if (args.apply) {
    await applyToSupabase(publications);
  }

  console.log(
    JSON.stringify(
      {
        maxPage: args.maxPage,
        publications: publications.length,
        categories: categorySummary,
        wroteJson: args.out,
        applied: args.apply,
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
