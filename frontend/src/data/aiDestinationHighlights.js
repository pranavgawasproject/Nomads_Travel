export const DESTINATION_HIGHLIGHT_FILTERS = [
  { label: "Events", value: "annualevents" },
  { label: "Venues", value: "venues" },
  { label: "News", value: "news" },
  { label: "Blogs", value: "blogs" },
];

const fallbackImage = "/images/goa-image.jpg";

export const annualEvents = [
  {
    id: "goa-carnival",
    title: "Goa Carnival",
    location: "Panaji, Margao, Vasco, Mapusa",
    meta: "FEB",
    image: fallbackImage,
    category: "Cultural Festival",
    subtitle: "During the month of February",
    description:
      "Goa Carnival is a colourful annual celebration filled with parades, music, dance, costumes, and food across Goa's major towns.",
  },
  {
    id: "sunburn-festival",
    title: "Sunburn Festival",
    location: "Vagator",
    meta: "DEC",
    image: fallbackImage,
    category: "Music Festival",
    subtitle: "During the month of December",
    description:
      "A lively year-end music festival bringing artists and visitors together for several days of performances.",
  },
  {
    id: "sao-joao-festival",
    title: "Sao Joao Festival",
    location: "Anjuna",
    meta: "JUN",
    image: fallbackImage,
    category: "Cultural Festival",
    subtitle: "During the month of June",
    description:
      "A traditional monsoon celebration known for music, community gatherings, and colourful floral headgear.",
  },
  {
    id: "iffi",
    title: "IFFI",
    location: "Panaji",
    meta: "NOV",
    image: fallbackImage,
    category: "Film Festival",
    subtitle: "During the month of November",
    description:
      "The International Film Festival of India hosts screenings, conversations, and film professionals from around the world.",
  },
  {
    id: "serendipity",
    title: "Serendipity",
    location: "Panaji",
    meta: "DEC",
    image: fallbackImage,
    category: "Arts Festival",
    subtitle: "During the month of December",
    description:
      "A multidisciplinary arts festival presenting visual arts, performance, music, craft, and culinary experiences.",
  },
];

export const popularVenues = [
  {
    id: "palolem-beach",
    title: "Palolem Beach",
    location: "Canacona",
    meta: "4.9",
    image: fallbackImage,
    category: "Beach",
    address: "225G+83J, Mohanbagh, Palolem, Canacona, Goa 403702",
    region: "South Goa",
    description:
      "Palolem Beach is one of South Goa's most scenic beaches, known for its crescent-shaped shoreline, soft golden sand, swaying palm trees, and calm waters.",
  },
  {
    id: "aguada-fort",
    title: "Aguada Fort",
    location: "Candolim",
    meta: "4.9",
    image: fallbackImage,
    category: "Historic Fort",
    address: "Fort Aguada Road, Candolim, Goa",
    region: "North Goa",
    description:
      "A historic coastal fort with sweeping sea views and a lighthouse overlooking the Arabian Sea.",
  },
  {
    id: "dudhsagar-waterfalls",
    title: "Dudhsagar Waterfalls",
    location: "Mollem",
    meta: "4.9",
    image: fallbackImage,
    category: "Waterfall",
    address: "Mollem, Goa",
    region: "South Goa",
    description:
      "A dramatic four-tiered waterfall surrounded by forest and popular for scenic day trips.",
  },
  {
    id: "basilica-of-bom-jesus",
    title: "Basilica of Bom Jesus",
    location: "Old Goa",
    meta: "4.9",
    image: fallbackImage,
    category: "Heritage Site",
    address: "Old Goa Road, Goa",
    region: "North Goa",
    description:
      "A celebrated UNESCO-listed basilica and one of Goa's most recognisable heritage landmarks.",
  },
  {
    id: "fontainhas",
    title: "Fontainhas",
    location: "Panaji",
    meta: "4.9",
    image: fallbackImage,
    category: "Heritage Quarter",
    address: "Fontainhas, Panaji, Goa",
    region: "North Goa",
    description:
      "A colourful Latin Quarter known for narrow lanes, heritage homes, galleries, and local cafes.",
  },
];

export const popularNews = [
  "Govt to set up co-working space at Porvorim",
  "Work meets leisure: The rise of co-working in Goa",
  "Goa: From India's Escape to the World's Workstation",
  "WorkationGoa Vision Expands with New Hubs",
  "goSTOPS becomes the first-ever hostel chain to expand",
].map((title, index) => ({
  id: `news-${index + 1}`,
  title,
  image: fallbackImage,
  content:
    "This is placeholder news content for the destination. More verified local reporting and source information will be added here.",
  author: "RoamIQ News",
  source: "Publicly available information",
  date: "2026-06-11",
}));

export const popularBlogs = [
  "Digital Nomads in Goa: How Remote Work Is Reshaping Travel",
  "5 Co-Working Spaces in Goa with Beach Access for Digital Explorers",
  "Goa for Digital Nomads: Work Where You Vacation",
  "Popular Coworking Spaces in Goa | Top Ranking",
  "The Reality of Being a Digital Nomad in Goa, India",
].map((title, index) => ({
  id: `blog-${index + 1}`,
  title,
  image: fallbackImage,
  content:
    "This is placeholder blog content about living and working from the destination. Detailed recommendations and local insights will be added here.",
  author: "RoamIQ Blog",
  source: "RoamIQ",
  date: "2026-06-11",
}));

