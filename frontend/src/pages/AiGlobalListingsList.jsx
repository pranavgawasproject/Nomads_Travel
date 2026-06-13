import React, { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  TbArrowLeft,
  TbSearch,
  TbMapPin,
  TbBuilding,
  TbCoffee,
  TbHome,
  TbBriefcase,
  TbSparkles,
  TbArrowRight,
  TbLayoutGrid,
  TbList,
  TbFilter,
  TbChevronDown,
  TbStar,
  TbWifi,
  TbCoin,
  TbClock,
  TbUsers,
} from "react-icons/tb";
import { getListings, getListingsContinents } from "../services/supabaseService";

/* ────────────── Data ────────────── */

const categories = [
  { id: "all", label: "All", icon: TbLayoutGrid },
  { id: "coworking", label: "Coworking", icon: TbBriefcase },
  { id: "coliving", label: "Coliving", icon: TbHome },
  { id: "cafe", label: "Cafes", icon: TbCoffee },
  { id: "hostel", label: "Hostels", icon: TbBuilding },
  { id: "workation", label: "Workation", icon: TbSparkles },
];

const defaultRegions = [
  "All Regions",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Africa",
  "Oceania",
];

const priceRanges = [
  "Any Price",
  "Under $100/mo",
  "$100 - $200/mo",
  "$200 - $400/mo",
  "$400+/mo",
];

/* ── Gradient picker based on type ── */
const typeGradients = {
  coworking: "from-cyan-500/30 to-blue-600/30",
  coliving: "from-green-500/30 to-emerald-600/30",
  cafe: "from-amber-500/30 to-orange-600/30",
  hostel: "from-pink-500/30 to-rose-600/30",
  workation: "from-violet-500/30 to-purple-600/30",
  meetingroom: "from-yellow-500/30 to-amber-600/30",
  privatestay: "from-teal-500/30 to-cyan-600/30",
};

/* ────────────── Component ────────────── */

const AiGlobalListingsList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeCategory, setActiveCategory] = useState("all");
  const [activeRegion, setActiveRegion] = useState("All Regions");
  const [activePriceRange, setActivePriceRange] = useState("Any Price");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showPriceDropdown, setShowPriceDropdown] = useState(false);

  // ── Data from Supabase ──
  const [listings, setListings] = useState([]);
  const [regions, setRegions] = useState(defaultRegions);
  const [loading, setLoading] = useState(true);

  // Fetch listings from Supabase
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [listingsData, continentsData] = await Promise.all([
          getListings(),
          getListingsContinents(),
        ]);
        setListings(listingsData);
        if (continentsData.length > 0) {
          setRegions(["All Regions", ...continentsData]);
        }
      } catch (err) {
        console.error('Failed to fetch listings:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Parse URL params for initial destination
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const country = params.get("country");
    if (country) {
      setSearchQuery(country);
    }
  }, [location.search]);

  const filteredListings = useMemo(() => {
    let results = [...listings];

    if (activeCategory !== "all") {
      results = results.filter((l) => (l.company_type || l.type) === activeCategory);
    }

    if (activeRegion !== "All Regions") {
      results = results.filter((l) => (l.continent || l.region) === activeRegion);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (l) =>
          (l.company_name || l.name || '').toLowerCase().includes(q) ||
          (l.city || '').toLowerCase().includes(q) ||
          (l.country || '').toLowerCase().includes(q) ||
          (l.state || '').toLowerCase().includes(q) ||
          ((l.tags && l.tags.some) ? l.tags.some((t) => t.toLowerCase().includes(q)) : false)
      );
    }

    return results;
  }, [listings, activeCategory, activeRegion, activePriceRange, searchQuery]);

  const handleListingClick = (listing) => {
    const name = listing.company_name || listing.name;
    const type = listing.company_type || listing.type;
    navigate(`/ai-listings/${encodeURIComponent(name)}`, {
      state: { companyId: listing.id || listing.business_id, type },
    });
  };

  return (
    <div className="min-h-full bg-surface animate-fade-in">
      <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {/* ── Top bar: Back + Search ── */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <TbArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline text-sm font-medium">Back</span>
          </button>

          <div className="flex-1 relative">
            <TbSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search spaces, cities, countries..."
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-50 border border-glass-border text-gray-200 placeholder-gray-500 text-sm outline-none focus:border-accent/50 focus:shadow-glow-sm transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                &times;
              </button>
            )}
          </div>

          {/* Region filter dropdown */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => { setShowRegionDropdown(!showRegionDropdown); setShowPriceDropdown(false); }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-50 border border-glass-border text-sm text-gray-300 hover:text-white hover:border-white/20 transition-all"
            >
              <TbMapPin className="w-4 h-4" />
              {activeRegion}
              <TbChevronDown className={`w-3.5 h-3.5 transition-transform ${showRegionDropdown ? "rotate-180" : ""}`} />
            </button>
            {showRegionDropdown && (
              <div className="absolute top-full right-0 z-50 mt-2 w-48 glass-card p-2 animate-fade-in">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => { setActiveRegion(region); setShowRegionDropdown(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activeRegion === region
                        ? "bg-accent/20 text-accent"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Price filter */}
          <div className="relative hidden md:block">
            <button
              onClick={() => { setShowPriceDropdown(!showPriceDropdown); setShowRegionDropdown(false); }}
              className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-50 border border-glass-border text-sm text-gray-300 hover:text-white hover:border-white/20 transition-all"
            >
              <TbCoin className="w-4 h-4" />
              {activePriceRange}
              <TbChevronDown className={`w-3.5 h-3.5 transition-transform ${showPriceDropdown ? "rotate-180" : ""}`} />
            </button>
            {showPriceDropdown && (
              <div className="absolute top-full right-0 z-50 mt-2 w-48 glass-card p-2 animate-fade-in">
                {priceRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => { setActivePriceRange(range); setShowPriceDropdown(false); }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                      activePriceRange === range
                        ? "bg-accent/20 text-accent"
                        : "text-gray-300 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* View toggle */}
          <div className="hidden lg:flex items-center gap-1 bg-surface-50 rounded-xl border border-glass-border p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-accent/20 text-accent" : "text-gray-500 hover:text-white"}`}
            >
              <TbLayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-accent/20 text-accent" : "text-gray-500 hover:text-white"}`}
            >
              <TbList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Heading ── */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <TbSparkles className="w-5 h-5 text-accent" />
            <span className="text-accent text-xs font-semibold tracking-widest uppercase">Explore Spaces</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
            Find your perfect workspace worldwide
          </h1>
          <p className="mt-3 text-gray-400 text-sm sm:text-base max-w-2xl">
            Browse curated coworking spaces, coliving hubs, cafes, and offices in top nomad destinations.
          </p>
        </div>

        {/* ── Category Tabs ── */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-8">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.id;
            const count = cat.id === "all"
              ? listings.length
              : listings.filter((l) => (l.company_type || l.type) === cat.id).length;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? "bg-accent/20 border border-accent/40 text-accent"
                    : "bg-surface-50/50 border border-glass-border text-gray-400 hover:text-white hover:border-white/20"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
                <span className={`text-xs px-1.5 py-0.5 rounded-md ${isActive ? "bg-accent/20" : "bg-white/5"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Results count ── */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-400 text-sm">
            <span className="text-white font-semibold">{filteredListings.length}</span> spaces found
            {activeRegion !== "All Regions" && <span className="text-gray-500 ml-1">in {activeRegion}</span>}
          </p>
          {(activeRegion !== "All Regions" || activeCategory !== "all") && (
            <button
              onClick={() => { setActiveRegion("All Regions"); setActiveCategory("all"); }}
              className="text-xs text-accent hover:text-white transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ── Loading State ── */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
            <span className="ml-3 text-gray-400 text-sm">Loading spaces...</span>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredListings.map((listing) => (
              <button
                key={listing.id || listing.business_id}
                onClick={() => handleListingClick(listing)}
                className="glass-card-hover overflow-hidden text-left group cursor-pointer"
              >
                {/* Header gradient */}
                <div className={`relative h-32 bg-gradient-to-br ${listing.gradient || typeGradients[listing.company_type || listing.type] || typeGradients.coworking} overflow-hidden`}>
                  <div className="absolute inset-0 bg-surface/40" />

                  {/* Type badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-surface/80 backdrop-blur-sm border border-glass-border">
                    <span className="text-[11px] font-medium text-gray-300 capitalize">{listing.company_type || listing.type}</span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-surface/80 backdrop-blur-sm border border-glass-border">
                    <TbStar className="w-3 h-3 text-yellow-400" />
                    <span className="text-xs font-medium text-gray-200">{listing.ratings || listing.rating || 0}</span>
                  </div>

                  {/* Name overlay */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <h3 className="text-white font-bold text-base drop-shadow-lg truncate">{listing.company_name || listing.name}</h3>
                    <p className="text-white/70 text-sm">
                      {listing.city}, {listing.country}
                    </p>
                  </div>

                  {/* Hover shine */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
                </div>

                {/* Info */}
                <div className="p-4 space-y-3">
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {(listing.tags || []).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[11px] font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <TbCoin className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      <span className="text-gray-300 truncate">{listing.cost || listing.starting_price || listing.price}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TbWifi className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      <span className="text-gray-300 truncate">{listing.wifi_speed || listing.wifi}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TbClock className="w-3.5 h-3.5 text-accent flex-shrink-0" />
                      <span className="text-gray-300 truncate">{listing.open_hours || listing.hours}</span>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-1 text-accent text-xs font-medium group-hover:gap-2 transition-all duration-200 pt-1">
                    View details <TbArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          /* ── List View ── */
          <div className="space-y-3">
            {filteredListings.map((listing) => (
              <button
                key={listing.id || listing.business_id}
                onClick={() => handleListingClick(listing)}
                className="w-full glass-card-hover flex items-center gap-4 p-4 text-left group cursor-pointer"
              >
                {/* Mini gradient */}
                <div className={`hidden sm:flex w-20 h-20 rounded-xl bg-gradient-to-br ${listing.gradient || typeGradients[listing.company_type || listing.type] || typeGradients.coworking} items-center justify-center flex-shrink-0`}>
                  <span className="text-white/80 text-2xl font-bold">{(listing.company_name || listing.name || '?').charAt(0)}</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-gray-200 font-semibold text-sm truncate">{listing.company_name || listing.name}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 text-[10px] font-medium capitalize">{listing.company_type || listing.type}</span>
                  </div>
                  <p className="text-gray-400 text-xs mb-2">{listing.city}, {listing.country}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(listing.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-md bg-white/5 text-gray-500 text-[10px]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right side info */}
                <div className="hidden md:flex flex-col items-end gap-2 flex-shrink-0">
                  <div className="flex items-center gap-1">
                    <TbStar className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-200">{listing.ratings || listing.rating || 0}</span>
                    <span className="text-gray-500 text-xs">({listing.total_reviews || listing.reviews || 0})</span>
                  </div>
                  <span className="text-accent text-sm font-semibold">{listing.cost || listing.starting_price || listing.price}</span>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><TbWifi className="w-3 h-3" />{listing.wifi_speed || listing.wifi}</span>
                    <span className="flex items-center gap-1"><TbClock className="w-3 h-3" />{listing.open_hours || listing.hours}</span>
                  </div>
                </div>

                <TbArrowRight className="w-4 h-4 text-gray-600 group-hover:text-accent group-hover:translate-x-1 transition-all flex-shrink-0" />
              </button>
            ))}
          </div>
        )}

        {/* ── Empty state ── */}
        {filteredListings.length === 0 && (
          <div className="text-center py-16">
            <TbFilter className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-gray-300 text-lg font-medium mb-2">No spaces found</h3>
            <p className="text-gray-500 text-sm mb-4">Try adjusting your filters or search query</p>
            <button
              onClick={() => {
                setActiveCategory("all");
                setActiveRegion("All Regions");
                setActivePriceRange("Any Price");
                setSearchQuery("");
              }}
              className="btn-primary text-sm py-2 px-6"
            >
              Clear all filters
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AiGlobalListingsList;
