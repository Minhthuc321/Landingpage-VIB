export function sanitizeHtmlText(input: string): string {
  if (!input) return "";

  let clean = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
    .replace(/on\w+="[^"]*"/gi, "")
    .replace(/on\w+='[^']*'/gi, "")
    .replace(/javascript:[^\s"']+/gi, "#");

  return clean;
}

export function validateSafeUrl(url: string): boolean {
  if (!url) return true;
  const trimmed = url.trim();

  if (trimmed.startsWith('#') || trimmed.startsWith('/')) return true;
  if (/^https?:\/\//i.test(trimmed)) return true;

  return false;
}

export function validateTrackingFormat(type: 'ga' | 'gtm' | 'pixel', id: string): boolean {
  if (!id || id.trim() === '') return true;
  const val = id.trim();

  if (type === 'ga') {
    return /^G-[A-Z0-9]+$/i.test(val);
  }
  if (type === 'gtm') {
    return /^GTM-[A-Z0-9]+$/i.test(val);
  }
  if (type === 'pixel') {
    return /^[0-9]+$/.test(val);
  }
  return false;
}
