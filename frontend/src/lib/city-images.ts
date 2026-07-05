// Curated stock photos for cities we're confident have a good match.
// Any city not listed here falls back to a generated gradient card
// (see CityThumb) rather than risking a broken/mismatched image.
export const cityPhotos: Record<string, string> = {
  "chiang-mai":
    "https://images.unsplash.com/photo-1598935818633-9c9a78d8b7b6?auto=format&fit=crop&w=1200&q=80",
  lisbon:
    "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?auto=format&fit=crop&w=1200&q=80",
  canggu:
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  "mexico-city":
    "https://images.unsplash.com/photo-1516410529446-2c777cb7366d?auto=format&fit=crop&w=1200&q=80",
  tbilisi:
    "https://images.unsplash.com/photo-1547147834-9088aab6fbf6?auto=format&fit=crop&w=1200&q=80",
  medellin:
    "https://images.unsplash.com/photo-1571072614024-9e9d0a3b1a22?auto=format&fit=crop&w=1200&q=80",
  "cape-town":
    "https://images.unsplash.com/photo-1576487248805-cf45f6bcc67f?auto=format&fit=crop&w=1200&q=80",
  bangkok:
    "https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80",
};

const gradients: [string, string][] = [
  ["from-forest to-emerald", "text-primary-foreground"],
  ["from-sunset to-terracotta", "text-white"],
  ["from-clay to-terracotta", "text-white"],
  ["from-emerald to-forest", "text-primary-foreground"],
];

export function cityGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return gradients[hash % gradients.length];
}
