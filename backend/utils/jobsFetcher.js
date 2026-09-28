// backend/utils/universalJobsFetcher.js
import * as cheerio from "cheerio";

/* ---------------------------------------------------------
   SIMPLE IN-MEMORY CACHE
   Job boards don't change second-to-second — cache each
   lookup for a while so repeat requests are instant. Swap
   this Map for Redis if you run more than one server process.
--------------------------------------------------------- */

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 minutes
const cache = new Map();

const getCached = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.value;
};

const setCached = (key, value) => {
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
};

/* ---------------------------------------------------------
   URL-BASED ATS DETECTION
   If we already have the careers URL, parse it directly —
   far more reliable than guessing a slug from the company
   name, and skips straight to the right provider.
--------------------------------------------------------- */

const detectProviderFromUrl = (careersUrl) => {
  let url;
  try {
    url = new URL(careersUrl);
  } catch {
    return null;
  }

  const host = url.hostname;
  const segments = url.pathname.split("/").filter(Boolean);

  // Greenhouse: boards.greenhouse.io/{slug} or job-boards.greenhouse.io/{slug}
  if (host.includes("greenhouse.io") && segments[0]) {
    return { provider: "greenhouse", slug: segments[0] };
  }

  // Lever: jobs.lever.co/{slug}
  if (host.includes("lever.co") && segments[0]) {
    return { provider: "lever", slug: segments[0] };
  }

  // Ashby: jobs.ashbyhq.com/{slug}
  if (host.includes("ashbyhq.com") && segments[0]) {
    return { provider: "ashby", slug: segments[0] };
  }

  // SmartRecruiters: careers.smartrecruiters.com/{slug}
  if (host.includes("smartrecruiters.com") && segments[0]) {
    return { provider: "smartrecruiters", slug: segments[0] };
  }

  // Workday: {tenant}.{region}.myworkdayjobs.com/{site}
  // e.g. nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite
  const workdayMatch = host.match(/^([^.]+)\.(wd\d+)\.myworkdayjobs\.com$/);
  if (workdayMatch && segments.length > 0) {
    const [, tenant, region] = workdayMatch;
    // Skip an optional locale prefix like /en-US/
    const site = segments.find((s) => !/^[a-z]{2}-[A-Z]{2}$/.test(s));
    if (site) return { provider: "workday", tenant, region, site };
  }

  return null;
};

/* ---------------------------------------------------------
   SLUG GUESSING (fallback when there's no careers URL yet)
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

/* ---------------------------------------------------------
   PROVIDER FETCHERS
--------------------------------------------------------- */

const fetchGreenhouse = async (slug) => {
  const res = await fetch(
    `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.jobs || []).map((j) => normalize("greenhouse", j));
};

const fetchLever = async (slug) => {
  const res = await fetch(`https://api.lever.co/v0/postings/${slug}?mode=json`);
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data.map((j) => normalize("lever", j)) : [];
};

const fetchAshby = async (slug) => {
  const res = await fetch(`https://api.ashbyhq.com/posting-api/job-board/${slug}`);
  if (!res.ok) return [];
  const data = await res.json();
  return (data.jobs || []).map((j) => normalize("ashby", j));
};

const fetchSmartRecruiters = async (slug) => {
  const res = await fetch(
    `https://api.smartrecruiters.com/v1/companies/${slug}/postings`
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.content || []).map((j) => normalize("smartrecruiters", j));
};

// Workday's public CXS API. Same shape for every *.myworkdayjobs.com tenant —
// this is the endpoint the career page's own search box calls in the browser.
const fetchWorkday = async ({ tenant, region, site }, maxResults = 100) => {
  const baseUrl = `https://${tenant}.${region}.myworkdayjobs.com/wday/cxs/${tenant}/${site}/jobs`;
  const limit = 20; // Workday rejects requests for more than 20 per page
  let offset = 0;
  let total = Infinity;
  const jobs = [];

  while (offset < total && jobs.length < maxResults) {
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        appliedFacets: {},
        limit,
        offset,
        searchText: "",
      }),
    });

    if (!res.ok) break;

    const data = await res.json();
    total = data.total ?? 0;

    (data.jobPostings || []).forEach((job) => {
      jobs.push({
        title: job.title,
        location: job.locationsText || null,
        department: null, // not exposed at list level; needs the per-job detail endpoint
        url: `https://${tenant}.${region}.myworkdayjobs.com/${site}/${job.externalPath}`,
        postedAt: job.postedOn || null, // often a relative label like "Posted 3 Days Ago"
        source: "workday",
      });
    });

    offset += limit;
    if (!data.jobPostings || data.jobPostings.length < limit) break;
  }

  return jobs;
};

const PROVIDER_FETCHERS = {
  greenhouse: (target) => fetchGreenhouse(target.slug),
  lever: (target) => fetchLever(target.slug),
  ashby: (target) => fetchAshby(target.slug),
  smartrecruiters: (target) => fetchSmartRecruiters(target.slug),
  workday: (target) => fetchWorkday(target),
};

/* ---------------------------------------------------------
   TIER 3 FALLBACK — schema.org JobPosting JSON-LD scraping
   For custom-built career pages that still embed structured
   data for Google for Jobs SEO. Fast (no browser needed).
--------------------------------------------------------- */

const scrapeJsonLd = async (careersUrl) => {
  const res = await fetch(careersUrl, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; JobFetcherBot/1.0)" },
  });
  if (!res.ok) return [];

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
      // not relevant/valid JSON-LD — skip this script tag
    }
  });

  return jobs;
};

/* ---------------------------------------------------------
   PUBLIC ENTRY POINT
   Give it a company name and/or a careers URL — it tries the
   fastest, most precise path first and falls back from there.
--------------------------------------------------------- */

export const fetchCompanyJobs = async ({ companyName, careersUrl }) => {
  const cacheKey = `jobs:${companyName || ""}:${careersUrl || ""}`;
  const cached = getCached(cacheKey);
  if (cached) return { ...cached, cached: true };

  // Tier 1: we know the URL — detect the exact provider from it directly
  if (careersUrl) {
    const detected = detectProviderFromUrl(careersUrl);
    if (detected) {
      const jobs = await PROVIDER_FETCHERS[detected.provider](detected);
      if (jobs.length > 0) {
        const result = { jobs, matchedProvider: detected.provider, cached: false };
        setCached(cacheKey, result);
        return result;
      }
    }
  }

  // Tier 2: no URL, or URL wasn't a recognized ATS — guess slugs from the name
  if (companyName) {
    for (const slug of guessSlugs(companyName)) {
      for (const [provider, fetcher] of Object.entries(PROVIDER_FETCHERS)) {
        if (provider === "workday") continue; // Workday needs tenant+region, can't guess from name alone
        try {
          const jobs = await fetcher({ slug });
          if (jobs.length > 0) {
            const result = { jobs, matchedProvider: provider, cached: false };
            setCached(cacheKey, result);
            return result;
          }
        } catch {
          // this provider/slug combo failed — try the next one
        }
      }
    }
  }

  // Tier 3: fall back to scraping JSON-LD off the given careers page
  if (careersUrl) {
    try {
      const jobs = await scrapeJsonLd(careersUrl);
      const result = { jobs, matchedProvider: jobs.length ? "json-ld" : null, cached: false };
      setCached(cacheKey, result);
      return result;
    } catch {
      // fall through to the empty result below
    }
  }

  const empty = { jobs: [], matchedProvider: null, cached: false };
  setCached(cacheKey, empty);
  return empty;
};

export const fetchJobsForSources = async (data, { concurrency = 5 } = {}) => {
    const {sources, companyname} = data;
    const results = new Array(sources.length);
    let next = 0;

    const worker = async () => {
        while (next < sources.length) {
            const index = next++;
            const { source, careersUrl } = sources[index];

            try {
                const { jobs, matchedProvider, cached } = await fetchCompanyJobs({
                    companyName: companyname,
                    careersUrl,
                });

                results[index] = {
                    source,
                    companyname,
                    careersUrl,
                    matchedProvider,
                    cached,
                    jobs: jobs.map((job) => ({ ...job, sourceName: source })),
                    error: null,
                };
            } catch (err) {
                results[index] = {
                    source,
                    careersUrl,
                    matchedProvider: null,
                    cached: false,
                    jobs: [],
                    error: err.message || "Failed to fetch jobs",
                };
            }
        }
    };

    await Promise.all(
        Array.from({ length: Math.min(concurrency, sources.length) }, worker)
    );

    return results;
};