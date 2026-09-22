function configuredUrl(value: string | undefined, variable: string): URL {
  if (!value?.trim()) {
    throw new Error(`${variable} is required. Set it in the UI environment before building or starting the app.`);
  }

  let url: URL;
  try {
    url = new URL(value.trim());
  } catch {
    throw new Error(`${variable} must be an absolute HTTP or HTTPS URL.`);
  }

  if (!['http:', 'https:'].includes(url.protocol) || !url.hostname || url.username || url.password) {
    throw new Error(`${variable} must be an absolute HTTP or HTTPS URL without credentials.`);
  }

  return url;
}

export function requireSiteOrigin(value: string | undefined): string {
  const url = configuredUrl(value, "NEXT_PUBLIC_SITE_URL");
  if (url.pathname.replace(/\/+$/, "") !== "" || url.search || url.hash) {
    throw new Error("NEXT_PUBLIC_SITE_URL must contain only the canonical site origin, with no path, query, or fragment.");
  }

  return url.origin;
}

export function requireApiBaseUrl(value: string | undefined, variable: string): string {
  const url = configuredUrl(value, variable);
  if (url.search || url.hash) {
    throw new Error(`${variable} must not contain a query string or fragment.`);
  }

  const path = url.pathname.replace(/\/+$/, "");
  return `${url.origin}${path}`;
}

export type UmamiConfig =
  | { enabled: false }
  | { enabled: true; websiteId: string; scriptUrl: string };

export function getUmamiConfig(websiteIdValue: string | undefined, scriptUrlValue: string | undefined): UmamiConfig {
  const websiteId = websiteIdValue?.trim() ?? "";
  const scriptUrl = scriptUrlValue?.trim() ?? "";

  if (!websiteId && !scriptUrl) return { enabled: false };
  if (!websiteId || !scriptUrl) {
    throw new Error("Umami requires both NEXT_PUBLIC_UMAMI_WEBSITE_ID and NEXT_PUBLIC_UMAMI_SCRIPT_URL; leave both empty to disable it.");
  }
  if (!/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/i.test(websiteId)) {
    throw new Error("NEXT_PUBLIC_UMAMI_WEBSITE_ID must be a UUID from the Umami website settings.");
  }

  const url = configuredUrl(scriptUrl, "NEXT_PUBLIC_UMAMI_SCRIPT_URL");
  if (url.search || url.hash || url.pathname === "/") {
    throw new Error("NEXT_PUBLIC_UMAMI_SCRIPT_URL must point directly to the Umami tracker JavaScript file.");
  }

  return { enabled: true, websiteId, scriptUrl: url.href };
}
