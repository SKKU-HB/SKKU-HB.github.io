import type { Artifact, ArtifactItem, Level, Purpose } from "@/data/artifacts";
import { classify } from "./classifier";

const NVD_BASE = "https://services.nvd.nist.gov/rest/json/cves/2.0";

interface NvdCveRef {
  url: string;
  source: string;
}

interface NvdCveCpeMatch {
  vulnerable: boolean;
  criteria: string;
}

interface NvdCveNode {
  operator: string;
  negate: boolean;
  cpeMatch: NvdCveCpeMatch[];
}

interface NvdCveConfiguration {
  nodes: NvdCveNode[];
}

interface NvdCvssEntry {
  cvssData: { baseScore: number; baseSeverity?: string };
  baseSeverity?: string;
}

interface NvdCveMetrics {
  cvssMetricV31?: NvdCvssEntry[];
  cvssMetricV30?: NvdCvssEntry[];
  cvssMetricV2?: NvdCvssEntry[];
}

interface NvdCveWeakness {
  description: Array<{ lang: string; value: string }>;
}

export interface NvdCve {
  id: string;
  published: string;
  lastModified: string;
  vulnStatus: string;
  descriptions: Array<{ lang: string; value: string }>;
  metrics?: NvdCveMetrics;
  weaknesses?: NvdCveWeakness[];
  configurations?: NvdCveConfiguration[];
  references: NvdCveRef[];
}

interface NvdResponse {
  totalResults: number;
  vulnerabilities: Array<{ cve: NvdCve }>;
}

function toNvdDate(d: Date): string {
  // NVD API expects ISO-8601 without trailing Z, millisecond precision.
  return d.toISOString().replace("Z", "");
}

export async function fetchRecentCves(limit = 10, daysBack = 30): Promise<NvdCve[]> {
  const url = new URL(NVD_BASE);
  url.searchParams.set("resultsPerPage", String(Math.min(limit, 50)));
  const end = new Date();
  const start = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000);
  url.searchParams.set("lastModStartDate", toNvdDate(start));
  url.searchParams.set("lastModEndDate", toNvdDate(end));

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error(`NVD API responded ${res.status} ${res.statusText}`);
  const data = (await res.json()) as NvdResponse;
  return data.vulnerabilities.map((v) => v.cve).slice(0, limit);
}

function pickDescription(cve: NvdCve): string {
  const en = cve.descriptions.find((d) => d.lang === "en")?.value;
  return en ?? cve.descriptions[0]?.value ?? cve.id;
}

function parseCpeName(criteria: string): string {
  // cpe:2.3:part:vendor:product:version:update:edition:lang:sw_edition:target_sw:target_hw:other
  const parts = criteria.split(":");
  if (parts.length < 6) return criteria;
  const vendor = parts[3] === "*" ? "" : parts[3];
  const product = parts[4] === "*" ? "" : parts[4];
  const version = parts[5] === "*" ? "" : ` ${parts[5]}`;
  const name = [vendor, product].filter(Boolean).join(" ");
  return (name + version).trim() || criteria;
}

function extractCvssScore(cve: NvdCve): number | null {
  return (
    cve.metrics?.cvssMetricV31?.[0]?.cvssData.baseScore ??
    cve.metrics?.cvssMetricV30?.[0]?.cvssData.baseScore ??
    cve.metrics?.cvssMetricV2?.[0]?.cvssData.baseScore ??
    null
  );
}

function extractCvssSeverity(cve: NvdCve): string | null {
  const v31 = cve.metrics?.cvssMetricV31?.[0];
  const v30 = cve.metrics?.cvssMetricV30?.[0];
  const v2 = cve.metrics?.cvssMetricV2?.[0];
  return v31?.cvssData.baseSeverity ?? v30?.cvssData.baseSeverity ?? v2?.baseSeverity ?? null;
}

function extractCwes(cve: NvdCve): string {
  return (
    cve.weaknesses
      ?.flatMap((w) => w.description.map((d) => d.value))
      .filter((v, i, a) => a.indexOf(v) === i)
      .join(", ") ?? ""
  );
}

function levelFromCvss(score: number | null): Level {
  if (score === null) return "중급자";
  if (score < 4) return "입문자";
  if (score < 7) return "중급자";
  return "전문가";
}

function extractArtifactItems(cve: NvdCve, behavior: string): ArtifactItem[] {
  const items: ArtifactItem[] = [];
  const seen = new Set<string>();
  for (const config of cve.configurations ?? []) {
    for (const node of config.nodes) {
      for (const match of node.cpeMatch) {
        if (!match.vulnerable) continue;
        if (seen.has(match.criteria)) continue;
        seen.add(match.criteria);
        items.push({
          name: parseCpeName(match.criteria),
          behavior: behavior || "영향 제품/버전",
          path: match.criteria,
        });
        if (items.length >= 5) return items;
      }
    }
  }
  if (items.length === 0) {
    items.push({
      name: cve.id,
      behavior: behavior || "취약점 항목",
      path: "CPE 정보 없음",
    });
  }
  return items;
}

export async function cveToArtifact(cve: NvdCve): Promise<Artifact> {
  const description = pickDescription(cve);
  const cvss = extractCvssScore(cve);
  const severity = extractCvssSeverity(cve);
  const cwes = extractCwes(cve);

  let classifiedPurpose: Purpose | null = null;
  let classifiedLevel: Level | null = null;
  try {
    const result = await classify(description);
    classifiedPurpose = result.purpose?.label ?? null;
    classifiedLevel = result.level?.label ?? null;
  } catch (e) {
    console.warn(`[nvd] classify failed for ${cve.id}, falling back:`, e);
  }

  const behavior = cwes ? `CWE: ${cwes}` : "영향 제품/버전";
  const artifacts = extractArtifactItems(cve, behavior);

  const toolsBits = [
    cvss !== null ? `CVSS ${cvss.toFixed(1)}` : null,
    severity,
  ].filter(Boolean);

  const refs = cve.references.slice(0, 3).map((r) => r.url);

  return {
    id: `cve_${cve.id.toLowerCase()}`,
    category: "NIST CVE",
    purpose: classifiedPurpose ?? "침해사고 대응",
    level: classifiedLevel ?? levelFromCvss(cvss),
    artifacts,
    tools: toolsBits.length ? toolsBits.join(" · ") : null,
    dataNeeded: refs.length ? refs.join("\n") : null,
    summary: description,
  };
}

export interface CveFetchProgress {
  stage: "fetching" | "classifying" | "done";
  current: number;
  total: number;
}

export async function fetchAndClassifyCves(
  limit = 10,
  onProgress?: (p: CveFetchProgress) => void,
): Promise<Artifact[]> {
  onProgress?.({ stage: "fetching", current: 0, total: limit });
  const cves = await fetchRecentCves(limit);
  const results: Artifact[] = [];
  for (let i = 0; i < cves.length; i++) {
    onProgress?.({ stage: "classifying", current: i, total: cves.length });
    try {
      results.push(await cveToArtifact(cves[i]));
    } catch (e) {
      console.error(`[nvd] transform failed for ${cves[i].id}:`, e);
    }
  }
  onProgress?.({ stage: "done", current: results.length, total: results.length });
  return results;
}
