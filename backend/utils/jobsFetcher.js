// backend/utils/jobsFetcher.js
import * as cheerio from "cheerio";

/* ---------------------------------------------------------
   SLUG GUESSING
   ATS "slugs" often aren't the display name verbatim
   (e.g. "Notion Labs" -> "notion"). This gives reasonable
   guesses, but a stored/confirmed slug per company is far
   more reliable than guessing every time.
--------------------------------------------------------- */

const slugify = (name) =>
  name
    .toLowerCase()
    .replace(/\b(inc|ltd|llc|corp|corporation|co)\b\.?/gi, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const guessSlugs = (companyName) => {
  const base = slugify(companyName);
  const noSpaces = base.replace(/-/g, "");
  return [...new Set([base, noSpaces])];
};

/* ---------------------------------------------------------
   NORMALIZED JOB SHAPE
   Every provider returns a different shape — normalize to:
   { title, location, department, url, postedAt, source }
--------------------------------------------------------- */

const normalize = (source, job) => {
  switch (source) {
    case "greenhouse":
      return {
        title: job.title,
        location: job.location?.name || null,
        department: job.departments?.[0]?.name || null,
        url: job.absolute_url,
        postedAt: job.updated_at || null,
        source,
      };
    case "lever":
      return {
        title: job.text,
        location: job.categories?.location || null,
        department: job.categories?.team || null,
        url: job.hostedUrl,
        postedAt: job.createdAt ? new Date(job.createdAt).toISOString() : null,
        source,
      };
    case "ashby":
      return {
        title: job.title,
        location: job.location || null,
        department: job.department || null,
        url: job.jobUrl,
        postedAt: job.publishedAt || null,
        source,
      };
    case "smartrecruiters":
      return {
        title: job.name,
        location: job.location?.city || null,
        department: job.department?.label || null,
        url: job.ref || job.applyUrl,
        postedAt: job.releasedDate || null,
        source,
      };
    default:
      return job;
  }
};

const tryGreenhouse = async (slug) => {
  const res = await fetch(
    `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.jobs || []).map((j) => normalize("greenhouse", j));
};

const tryLever = async (slug) => {
  const res = await fetch(`https://api.lever.co/v0/postings/${slug}?mode=json`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.map((j) => normalize("lever", j)) : [];
};

const tryAshby = async (slug) => {
  const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${slug}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.jobs || []).map((j) => normalize("ashby", j));
};

const trySmartRecruiters = async (slug) => {
  const res = await fetch(
    `https://api.smartrecruiters.com/v1/companies/${slug}/postings`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.content || []).map((j) => normalize("smartrecruiters", j));
};

const PROVIDERS = [tryGreenhouse, tryLever, tryAshby, trySmartRecruiters];

export const fetchJobsByCompanyName = async (companyName) => {
  const slugs = guessSlugs(companyName);

  for (const slug of slugs) {
    for (const provider of PROVIDERS) {
      try {
        const jobs = await provider(slug);
        if (jobs.length > 0) return { jobs, matchedSlug: slug };
      } catch {
        // this provider/slug combo didn't work — try the next one
      }
    }
  }

  return { jobs: [], matchedSlug: null };
};

export const fetchJobsFromCareersPage = async (careersUrl) => {
  const res = await fetch(careersUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; JobFetcherBot/1.0)" },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch careers page (${res.status})`);
  }

  const html = await res.text();
  const $ = cheerio.load(html);

  const jobs = [];

  $('script[type="application/ld+json"]').each((_, el) => {
    try {
      const parsed = JSON.parse($(el).html());
      const entries = Array.isArray(parsed) ? parsed : [parsed];

      entries.forEach((entry) => {
        if (entry["@type"] === "JobPosting") {
          jobs.push({
            title: entry.title,
            location:
              entry.jobLocation?.address?.addressLocality ||
              entry.jobLocation?.address?.addressRegion ||
              null,
            department: entry.industry || null,
            url: entry.url || careersUrl,
            postedAt: entry.datePosted || null,
            source: "json-ld",
          });
        }
      });
    } catch {
      // not valid/relevant JSON-LD — skip this script tag
    }
  });

  return jobs;
};