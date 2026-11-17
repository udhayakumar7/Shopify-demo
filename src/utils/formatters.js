/**
 * String and data formatting utilities.
 */

export function truncateText(text, maxLength = 100) {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

export function formatMetafieldKey(key) {
  if (!key) return "";
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function cleanDescription(htmlOrText) {
  if (!htmlOrText) return "";
  // Strip HTML tags if any exist
  return htmlOrText.replace(/<[^>]*>?/gm, "").trim();
}
