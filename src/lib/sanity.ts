// ─── Sanity Client ───────────────────────────────────────────────────────────
// Safe wrapper — if Sanity is not configured, all queries return empty data
// and the site falls back to its built-in demo content. No blank pages.

export type SanityImage = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number };
  alt?: string;
};

export type PortableTextBlock = {
  _type: "block";
  children: { _type: "span"; text: string; marks?: string[] }[];
  markDefs?: unknown[];
  style?: string;
};

const PROJECT_ID = import.meta.env.VITE_SANITY_PROJECT_ID;
const DATASET    = import.meta.env.VITE_SANITY_DATASET ?? "production";
const API_VER    = import.meta.env.VITE_SANITY_API_VERSION ?? "2024-01-01";

// Only connect if a real project ID is supplied
const isSanityConfigured =
  typeof PROJECT_ID === "string" &&
  PROJECT_ID.length > 0 &&
  PROJECT_ID !== "YOUR_PROJECT_ID";

// ── Lightweight fetch-based client (no npm package required) ─────────────────
export async function sanityFetch<T>(query: string, params: Record<string, string> = {}): Promise<T | null> {
  if (!isSanityConfigured) return null;

  const encoded = encodeURIComponent(query);
  const paramStr = Object.entries(params)
    .map(([k, v]) => `&$${k}=${encodeURIComponent(JSON.stringify(v))}`)
    .join("");

  const url = `https://${PROJECT_ID}.api.sanity.io/v${API_VER}/data/query/${DATASET}?query=${encoded}${paramStr}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json() as { result: T };
    return json.result ?? null;
  } catch {
    return null;
  }
}

// ── Image URL builder (no npm package required) ───────────────────────────────
export function urlFor(source: SanityImage | null | undefined): { url: () => string } {
  if (!source?.asset?._ref || !isSanityConfigured) {
    return { url: () => "/placeholder.svg" };
  }

  // Parse the Sanity asset reference: image-<id>-<width>x<height>-<format>
  const ref  = source.asset._ref;
  const parts = ref.replace("image-", "").split("-");
  const fmt   = parts.pop() ?? "jpg";
  const dims  = parts.pop() ?? "800x600";
  const id    = parts.join("-");

  return {
    url: (w?: number, h?: number) => {
      const base = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${fmt}`;
      const params: string[] = ["auto=format"];
      if (w) params.push(`w=${w}`);
      if (h) params.push(`h=${h}`);
      return `${base}?${params.join("&")}`;
    },
  } as unknown as { url: () => string };
}

// Convenience: urlFor(img).width(600).height(400).url()
export function imageUrl(source: SanityImage | null | undefined) {
  let _w: number | undefined;
  let _h: number | undefined;

  const builder = {
    width:  (w: number) => { _w = w; return builder; },
    height: (h: number) => { _h = h; return builder; },
    url: () => {
      if (!source?.asset?._ref || !isSanityConfigured) return "/placeholder.svg";
      const ref   = source.asset._ref;
      const parts = ref.replace("image-", "").split("-");
      const fmt   = parts.pop() ?? "jpg";
      const dims  = parts.pop() ?? "800x600";
      const id    = parts.join("-");
      const base  = `https://cdn.sanity.io/images/${PROJECT_ID}/${DATASET}/${id}-${dims}.${fmt}`;
      const ps: string[] = ["auto=format"];
      if (_w) ps.push(`w=${_w}`);
      if (_h) ps.push(`h=${_h}`);
      return `${base}?${ps.join("&")}`;
    },
  };
  return builder;
}
