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

const LINKEDIN_URL = "https://www.linkedin.com/company/bta_3/";
const NEWS_MEDIA_BUCKET = "news-media";
const NEWS_MEDIA_PREFIX = "linkedin";
const MAX_LINKEDIN_POSTS = 12;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36";

const VACANCY_SOURCES = [
  {
    title: "Vacancy: Information Technology Officers",
    sourceUrl:
      "https://www.bocra.org.bw/sites/default/files/Job%20adverts/IT_Officers_vacancy.pdf",
    excerpt:
      "Official BOCRA vacancy notice for Information Technology Officers.",
  },
  {
    title: "Vacancy: UASF Board of Trustees Advert",
    sourceUrl:
      "https://www.bocra.org.bw/sites/default/files/Job%20adverts/UASF-BOARD_OF_TRUSTEES_ADVERT.pdf",
    excerpt:
      "Official BOCRA vacancy notice for members of the UASF Board of Trustees.",
  },
];

const LINKEDIN_OVERRIDES = {
  "7441053140172365825": {
    title:
      "BOCRA thanks participants for registering for the Web Development Hackathon",
    excerpt:
      "BOCRA shared a registration update confirming that qualified hackathon participants should check their inboxes for access details.",
    category: "announcement",
    content:
      "BOCRA thanked everyone who registered for the Web Development Hackathon and advised qualified participants to check their inboxes and spam folders for their access links.",
  },
  "7440050103127732224": {
    title: "BOCRA extends the Web Development Hackathon registration deadline",
    excerpt:
      "BOCRA announced an extension to the hackathon registration deadline to accommodate strong demand.",
    category: "announcement",
    content:
      "BOCRA announced that the Web Development Hackathon registration deadline had been extended due to high demand, giving applicants more time to complete their submissions.",
  },
  "7439915949236965376": {
    title: "Join the BOCRA Web Development Hackathon",
    excerpt:
      "BOCRA invited teams to enter the Web Development Hackathon and compete for prizes.",
    category: "announcement",
    content:
      "BOCRA invited teams to join the Web Development Hackathon, collaborate on web solutions, and compete for prizes.",
  },
  "7440034389264105472": {
    title: "Final hours to register for the BOCRA Web Development Hackathon",
    excerpt:
      "BOCRA issued a final call for participants to register for the Web Development Hackathon before the deadline.",
    category: "announcement",
    content:
      "BOCRA shared a final registration reminder for the Web Development Hackathon and directed interested teams to complete their entries before the stated deadline.",
  },
  "7440019272438939648": {
    title: "Time is running out to join the BOCRA Web Development Hackathon",
    excerpt:
      "BOCRA reminded developers that hackathon registration was nearing the deadline and encouraged final submissions.",
    category: "announcement",
    content:
      "BOCRA reminded prospective participants that registration for the Web Development Hackathon was closing soon and encouraged teams to complete their submissions.",
  },
  "7440004165235503105": {
    title: "The BOCRA Web Development Hackathon countdown begins",
    excerpt:
      "BOCRA launched a countdown update for the Web Development Hackathon and urged teams to secure their place early.",
    category: "announcement",
    content:
      "BOCRA published a countdown update for the Web Development Hackathon, encouraging interested teams to register early and prepare for the competition.",
  },
  "7439981433223475200": {
    title: "BOCRA invites developers to bring their creativity to the hackathon",
    excerpt:
      "BOCRA encouraged developers to bring their creativity and ideas to the Web Development Hackathon.",
    category: "announcement",
    content:
      "BOCRA encouraged developers to bring their creativity to the Web Development Hackathon and take part in building practical web solutions.",
  },
  "7439904271652839424": {
    title: "Register for the BOCRA Web Development Hackathon",
    excerpt:
      "BOCRA invited participants to register for the Web Development Hackathon and follow the shared registration link for entry details.",
    category: "announcement",
    content:
      "BOCRA published a LinkedIn registration call for the Web Development Hackathon, directing interested participants to the official registration link.",
  },
  "7439656469320368128": {
    title: "BOCRA and BDIH invite developers to the Web Development Hackathon",
    excerpt:
      "BOCRA promoted the Web Development Hackathon as an opportunity to test skills, creativity, and innovation.",
    category: "announcement",
    content:
      "BOCRA, in partnership with the Botswana Digital and Innovation Hub, invited developers to take part in the Web Development Hackathon as an opportunity to test skills, creativity, and innovation.",
  },
  "7438547823140319232": {
    title: "BOCRA concludes its Goodhope District community outreach",
    excerpt:
      "BOCRA wrapped up a week-long community outreach in Goodhope District with cyber safety guidance for school communities.",
    category: "update",
    content:
      "BOCRA concluded its week-long community outreach in Goodhope District at Goodhope Senior School, where officials shared information about BOCRA services, cyber threats, and practical online safety measures. The engagement included participation from the Ministry of Communications and Innovation, UNICEF, and guest speaker Ms. Sadi Dikgaka, who encouraged responsible digital behaviour and awareness of cyber scams and cyberbullying.",
  },
};

const RECORD_OVERRIDES = {
  "linkedin-7439656469320368128": {
    title: "BOCRA and BDIH invite developers to the Web Development Hackathon",
    excerpt:
      "BOCRA promoted the Web Development Hackathon as an opportunity to test skills, creativity, and innovation.",
    content:
      "BOCRA, in partnership with the Botswana Digital and Innovation Hub, invited developers to take part in the Web Development Hackathon as an opportunity to test skills, creativity, and innovation.",
    category: "announcement",
  },
  "linkedin-7438547823140319232": {
    title: "BOCRA concludes its Goodhope District community outreach",
    excerpt:
      "BOCRA wrapped up a week-long community outreach in Goodhope District with cyber safety guidance for school communities.",
    content:
      "BOCRA concluded its week-long community outreach in Goodhope District at Goodhope Senior School, where officials shared information about BOCRA services, cyber threats, and practical online safety measures. The engagement included participation from the Ministry of Communications and Innovation, UNICEF, and guest speaker Ms. Sadi Dikgaka, who encouraged responsible digital behaviour and awareness of cyber scams and cyberbullying.",
    category: "update",
  },
};

function parseArgs(argv) {
  const args = {
    apply: false,
    out: null,
    limit: MAX_LINKEDIN_POSTS,
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

    if (value.startsWith("--limit=")) {
      args.limit = Number.parseInt(value.slice("--limit=".length), 10);
    }
  }

  return args;
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
    .replace(/&nbsp;/g, " ");
}

function normalizeWhitespace(value) {
  return value.replace(/\s+/g, " ").trim();
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
      .replace(/^-+|-+$/g, "") || "image"
  );
}

function extractActivityIdFromUrl(value) {
  const match = value.match(/activity-(\d+)/);
  return match?.[1] ?? null;
}

function cleanLinkedInText(value) {
  return normalizeWhitespace(
    decodeHtmlEntities(value)
      .replace(/\\n/g, "\n")
      .replace(/\s+#/g, " #")
      .replace(/(^|\s)#(?=\s|$)/g, " ")
      .replace(/\s{2,}/g, " ")
  );
}

function containsMojibake(value) {
  return value.includes("ð") || value.includes("Ã") || value.includes("â");
}

function deriveCategory(title, content) {
  const haystack = `${title} ${content}`.toLowerCase();

  if (/\bvacanc(y|ies)\b|\bhiring\b|\brecruit(ment|ing)?\b|\bcareer(s)?\b/.test(haystack)) {
    return "vacancy";
  }

  if (/\bconsultation\b|\bpublic notice\b|\bstakeholder\b|\bcomment\b/.test(haystack)) {
    return "consultation";
  }

  if (/\bregulation\b|\bregulatory\b|\bact\b|\bframework\b|\bpolicy\b|\bdirective\b/.test(haystack)) {
    return "regulation";
  }

  if (/\bhackathon\b|\bdeadline\b|\bregister\b|\bthank you\b|\blaunch\b|\binvite\b|\bcompetition\b|\bevent\b/.test(haystack)) {
    return "announcement";
  }

  return "update";
}

function deriveTitle(activityId, postUrl, text) {
  const override = LINKEDIN_OVERRIDES[activityId];

  if (override?.title) {
    return override.title;
  }

  const normalizedText = cleanLinkedInText(text);

  if (
    /register now/i.test(normalizedText) &&
    /hackathon/i.test(`${normalizedText} ${postUrl}`)
  ) {
    return "Register for the BOCRA Web Development Hackathon";
  }

  if (/hackathon/i.test(`${normalizedText} ${postUrl}`)) {
    return "BOCRA Web Development Hackathon Update";
  }

  if (/deadline/i.test(normalizedText) && /extend/i.test(normalizedText)) {
    return "BOCRA Deadline Extension Notice";
  }

  const firstSentence = normalizedText
    .split(/(?<=[.!?])\s+/)
    .find((sentence) => sentence.trim().length > 24);

  if (firstSentence) {
    return firstSentence.slice(0, 110).trim();
  }

  return "BOCRA Social Update";
}

function deriveExcerpt(activityId, title, text) {
  const override = LINKEDIN_OVERRIDES[activityId];

  if (override?.excerpt) {
    return override.excerpt;
  }

  if (title === "Register for the BOCRA Web Development Hackathon") {
    return "BOCRA invited participants to register for the Web Development Hackathon and follow the shared registration link for entry details.";
  }

  if (title === "Join the BOCRA Web Development Hackathon") {
    return "BOCRA encouraged teams to join the Web Development Hackathon and compete for prizes.";
  }

  const normalizedText = cleanLinkedInText(text);

  if (
    !normalizedText ||
    normalizedText === "# # #" ||
    containsMojibake(normalizedText)
  ) {
    return `${title}. Follow BOCRA on LinkedIn for the full update and visual post.`;
  }

  return normalizedText.slice(0, 200).trim();
}

function buildContent(activityId, title, text, sourceUrl) {
  const override = LINKEDIN_OVERRIDES[activityId];
  const normalizedText = cleanLinkedInText(text);
  const fallbackBody =
    title === "Register for the BOCRA Web Development Hackathon"
      ? "BOCRA published a LinkedIn registration call for the Web Development Hackathon, directing interested participants to the official registration link."
      : title === "Join the BOCRA Web Development Hackathon"
        ? "BOCRA published a LinkedIn call inviting teams to join the Web Development Hackathon and compete for prizes."
        : `${title}. BOCRA shared this update on LinkedIn. See the original post for the full visual update and any external registration or reference links.`;
  const body =
    override?.content ||
    (normalizedText && !containsMojibake(normalizedText)
      ? normalizedText
      : fallbackBody);

  return body;
}

async function fetchHtml(url) {
  const response = await fetch(url, {
    headers: {
      "user-agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }

  return response.text();
}

function extractLinkedInMetadata(html) {
  const posts = new Map();
  const pattern = /\{"@context":"http:\/\/schema\.org","@type":"DiscussionForumPosting".*?"datePublished":"([^"]+)".*?"mainEntityOfPage":"([^"]+)".*?"text":"(.*?)".*?"url":"([^"]+)"\}/gs;

  for (const match of html.matchAll(pattern)) {
    const [, datePublished, mainEntityOfPage, rawText] = match;
    const activityId = extractActivityIdFromUrl(mainEntityOfPage);

    if (!activityId) {
      continue;
    }

    posts.set(activityId, {
      activityId,
      sourceUrl: mainEntityOfPage,
      publishedAt: datePublished,
      text: cleanLinkedInText(rawText),
    });
  }

  return posts;
}

function extractLinkedInImages(html) {
  const images = new Map();
  const activityIds = [];

  for (const match of html.matchAll(/data-activity-urn="urn:li:activity:(\d+)"/g)) {
    const activityId = match[1];

    if (!activityIds.includes(activityId)) {
      activityIds.push(activityId);
    }
  }

  for (const activityId of activityIds) {
    const start = html.indexOf(`data-activity-urn="urn:li:activity:${activityId}"`);

    if (start === -1) {
      continue;
    }

    const end = html.indexOf("</article>", start);
    const block = html.slice(start, end === -1 ? start + 16000 : end);
    const mediaUrls = [...block.matchAll(/https:\/\/media\.licdn\.com[^"']+/g)]
      .map((match) => decodeHtmlEntities(match[0]))
      .filter((url) => !url.includes("company-logo"));

    if (mediaUrls.length > 0) {
      images.set(activityId, mediaUrls[0]);
    }
  }

  return images;
}

function buildLinkedInPosts(html, limit) {
  const metadata = extractLinkedInMetadata(html);
  const imageMap = extractLinkedInImages(html);
  const combined = [...metadata.values()]
    .map((item) => ({
      ...item,
      imageUrl: imageMap.get(item.activityId) ?? null,
    }))
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
    )
    .slice(0, limit);

  return combined.map((post) => {
    const title = deriveTitle(post.activityId, post.sourceUrl, post.text);
    const excerpt = deriveExcerpt(post.activityId, title, post.text);
    const content = buildContent(
      post.activityId,
      title,
      post.text,
      post.sourceUrl
    );
    const override = LINKEDIN_OVERRIDES[post.activityId];
    const category =
      override?.category ?? deriveCategory(title, `${excerpt} ${content}`);

    return {
      source: "linkedin",
      title,
      slug: `linkedin-${post.activityId}`,
      excerpt,
      content,
      category,
      featuredImageUrl: post.imageUrl,
      publishedAt: post.publishedAt,
      sourceUrl: post.sourceUrl,
      sourceLabel: "LinkedIn",
    };
  });
}

async function fetchLastModified(url) {
  try {
    const response = await fetch(url, {
      method: "HEAD",
      headers: {
        "user-agent": USER_AGENT,
      },
    });

    if (!response.ok) {
      return null;
    }

    const lastModified = response.headers.get("last-modified");
    return lastModified ? new Date(lastModified).toISOString() : null;
  } catch {
    return null;
  }
}

async function buildVacancyPosts() {
  const posts = [];

  for (const vacancy of VACANCY_SOURCES) {
    const publishedAt = (await fetchLastModified(vacancy.sourceUrl)) ?? new Date().toISOString();
      posts.push({
        source: "vacancy",
        title: vacancy.title,
        slug: `vacancy-${shortHash(vacancy.sourceUrl)}`,
        excerpt: vacancy.excerpt,
        content: vacancy.excerpt,
        category: "vacancy",
        featuredImageUrl: null,
        publishedAt,
        sourceUrl: vacancy.sourceUrl,
        sourceLabel: "Official BOCRA PDF",
      });
  }

  return posts;
}

async function ensureNewsMediaBucket(supabase) {
  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    throw error;
  }

  const exists = (buckets ?? []).some((bucket) => bucket.id === NEWS_MEDIA_BUCKET);

  if (exists) {
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(
    NEWS_MEDIA_BUCKET,
    {
      public: true,
      fileSizeLimit: "10MB",
      allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    }
  );

  if (createError && !createError.message.toLowerCase().includes("already")) {
    throw createError;
  }
}

function buildImageStoragePath(record) {
  const sourceUrl = new URL(record.featuredImageUrl);
  const pathname = sourceUrl.pathname;
  const extension = path.extname(pathname).slice(1).toLowerCase() || "jpg";
  return `${NEWS_MEDIA_PREFIX}/${record.source}-${record.slug}-${sanitizeFileName(record.title)}.${extension}`;
}

async function mirrorImageToStorage(supabase, record) {
  if (!record.featuredImageUrl) {
    return record;
  }

  await ensureNewsMediaBucket(supabase);
  const storagePath = buildImageStoragePath(record);
  const {
    data: { publicUrl },
  } = supabase.storage.from(NEWS_MEDIA_BUCKET).getPublicUrl(storagePath);

  const existing = await fetch(publicUrl, { method: "HEAD" });

  if (existing.ok) {
    return {
      ...record,
      featuredImageUrl: publicUrl,
    };
  }

  const response = await fetch(record.featuredImageUrl, {
    headers: {
      "user-agent": USER_AGENT,
    },
  });

  if (!response.ok) {
    return record;
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get("content-type") || "image/jpeg";
  const normalizedType = ["image/jpeg", "image/png", "image/webp"].includes(
    contentType
  )
    ? contentType
    : "image/jpeg";

  const { error } = await supabase.storage
    .from(NEWS_MEDIA_BUCKET)
    .upload(storagePath, buffer, {
      contentType: normalizedType,
      upsert: true,
      cacheControl: "31536000",
    });

  if (error) {
    return record;
  }

  return {
    ...record,
    featuredImageUrl: publicUrl,
  };
}

async function buildRecords(limit) {
  const linkedinHtml = await fetchHtml(LINKEDIN_URL);
  const linkedinPosts = buildLinkedInPosts(linkedinHtml, limit);
  const vacancyPosts = await buildVacancyPosts();

  return [...linkedinPosts, ...vacancyPosts]
    .map((record) => ({
      ...record,
      ...(RECORD_OVERRIDES[record.slug] ?? {}),
    }))
    .sort(
      (left, right) =>
        new Date(right.publishedAt).getTime() - new Date(left.publishedAt).getTime()
    );
}

async function applyToSupabase(records) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Missing VITE_SUPABASE_URL and SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY"
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false },
  });

  const mirroredRecords = [];

  for (const record of records) {
    mirroredRecords.push(await mirrorImageToStorage(supabase, record));
  }

  const payload = mirroredRecords.map((record) => ({
    title: record.title,
    slug: record.slug,
    excerpt: record.excerpt,
    content: record.content,
    category: record.category,
    featured_image_url: record.featuredImageUrl,
    source_url: record.sourceUrl,
    source_label: record.sourceLabel,
    published: true,
    published_at: record.publishedAt,
  }));

  const { error } = await supabase.from("news").upsert(payload, {
    onConflict: "slug",
  });

  if (error) {
    throw error;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const records = await buildRecords(args.limit);

  if (args.out) {
    const outputPath = path.resolve(rootDir, args.out);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(records, null, 2));
  }

  if (args.apply) {
    await applyToSupabase(records);
  }

  const categoryCounts = records.reduce((counts, record) => {
    counts[record.category] = (counts[record.category] || 0) + 1;
    return counts;
  }, {});

  console.log(
    JSON.stringify(
      {
        records: records.length,
        categories: categoryCounts,
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
