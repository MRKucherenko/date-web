interface SanitizeOptions {
  /**
   * Pass true once the user is done editing (e.g. on blur). Also strips any
   * trailing "/", "?" or "#" segment from a plain handle. Left off (the
   * onChange case) that same trim would truncate "https://" while it's
   * still being typed/pasted character by character, before the
   * "instagram.com/" prefix has fully appeared.
   */
  final?: boolean;
}

/**
 * Reduces an Instagram handle down to a bare username — strips a full
 * profile URL (with or without protocol/www) and a leading "@".
 *
 *   sanitizeInstagram("https://www.instagram.com/anna.k/") -> "anna.k"
 *   sanitizeInstagram("instagram.com/anna.k")               -> "anna.k"
 *   sanitizeInstagram("@anna.k")                             -> "anna.k"
 *   sanitizeInstagram("anna.k")                              -> "anna.k"
 *   sanitizeInstagram("anna.k/", { final: true })            -> "anna.k"
 */
export function sanitizeInstagram(raw: string, { final = false }: SanitizeOptions = {}): string {
  const value = raw.trim();

  const urlMatch = value.match(/instagram\.com\/([^\s]+)/i);
  if (urlMatch) {
    return urlMatch[1].split(/[/?#]/)[0];
  }

  const withoutAt = value.startsWith("@") ? value.slice(1) : value;
  return final ? withoutAt.split(/[/?#]/)[0] : withoutAt;
}
