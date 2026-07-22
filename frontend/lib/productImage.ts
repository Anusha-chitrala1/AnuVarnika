const PLACEHOLDER =
  "https://placehold.co/800x600/E7D8C3/5A3A1B?text=AnuVarnika+Saree";

/** Resolve product image URLs from DB (supports legacy local paths). */
export function productImageUrl(imageUrl: string): string {
  if (!imageUrl) return PLACEHOLDER;
  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  const slug = imageUrl.replace(/^\/categories\//, "").replace(/\.jpg$/i, "");
  const label = encodeURIComponent(slug.replace(/-/g, " ") || "Saree");
  return `https://placehold.co/800x600/E7D8C3/5A3A1B?text=${label}`;
}
