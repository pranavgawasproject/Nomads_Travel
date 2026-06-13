import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  TbArrowLeft,
  TbShare,
  TbHeart,
  TbHeartFilled,
  TbMapPin,
  TbStar,
  TbStarFilled,
  TbWifi,
  TbCoin,
  TbClock,
  TbSun,
  TbPhone,
  TbMail,
  TbExternalLink,
  TbChevronRight,
  TbCheck,
  TbPhoto,
  TbMessage,
  TbSend,
  TbBrandWhatsapp,
  TbBrandFacebook,
  TbBrandTwitter,
  TbBrandLinkedin,
  TbCopy,
  TbChevronDown,
  TbUsers,
  TbCalendar,
} from "react-icons/tb";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { FiShare2 } from "react-icons/fi";
import { ArrowLeft, Globe } from "lucide-react";
import Map from "../components/Map";
import { getListingById, getListingReviews } from "../services/supabaseService";

/* ────────────── Sample Data (used when API unavailable) ────────────── */

const sampleListing = {
  companyName: "Hub53 Coworking",
  companyTitle: "Hub53 Coworking — Your Digital Home in Bali",
  about:
    "Hub53 is Bali's premier coworking space designed for digital nomads, remote workers, and entrepreneurs. Located in the heart of Canggu, just minutes from the beach, Hub53 offers a perfect blend of productivity and tropical lifestyle. With high-speed fiber internet, ergonomic workstations, private offices, and a vibrant community of like-minded professionals, Hub53 is more than just a workspace — it's your launchpad for building meaningful connections and growing your career from paradise. Enjoy unlimited coffee, regular networking events, workshops, and sunset sessions that make work feel like play.",
  companyType: "coworking",
  country: "indonesia",
  state: "bali",
  city: "Canggu",
  continent: "Asia",
  ratings: 4.7,
  totalReviews: 128,
  reviewCount: 128,
  images: [
    { _id: "1", url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80" },
    { _id: "2", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80" },
    { _id: "3", url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=80" },
    { _id: "4", url: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=800&q=80" },
    { _id: "5", url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80" },
  ],
  logo: null,
  inclusions:
    "High-Speed WiFi, Ergonomic Chairs, Standing Desks, Private Phone Booths, Meeting Rooms, Unlimited Coffee & Tea, Printer & Scanner, Kitchen Access, Events & Workshops, Community Slack, Mail Handling, 24/7 Access, Bike Parking, Outdoor Terrace",
  latitude: -8.6523,
  longitude: 115.1388,
  googleMap: "https://maps.google.com/?q=-8.6523,115.1388",
  websiteTemplateLink: "https://hub53.co",
  poc: {
    name: "Ayu Sari",
    designation: "Community Manager",
  },
  isLiked: false,
  reviews: [
    {
      _id: "r1",
      name: "Sarah Mitchell",
      starCount: 5,
      description: "Absolutely love this place! The internet is blazing fast, the community is incredible, and the location right in Canggu is perfect. I've been here for 3 months and don't want to leave.",
      createdAt: "2025-12-15T10:00:00Z",
    },
    {
      _id: "r2",
      name: "Marcus Chen",
      starCount: 4,
      description: "Great coworking space with solid infrastructure. The standing desks and phone booths are a nice touch. Only wish they had more private office options available during peak season.",
      createdAt: "2025-11-20T10:00:00Z",
    },
    {
      _id: "r3",
      name: "Elena Rossi",
      starCount: 5,
      description: "Best coworking in Bali, period. The events they organize are amazing for networking. Met my co-founder here! The unlimited coffee is a nice bonus too ☕",
      createdAt: "2025-10-05T10:00:00Z",
    },
    {
      _id: "r4",
      name: "James Wilson",
      starCount: 4,
      description: "Solid workspace with everything you need. The 24/7 access is a game changer for those of us working across time zones. Community vibe is great.",
      createdAt: "2025-09-12T10:00:00Z",
    },
  ],
};

const sampleQuickStats = [
  { icon: TbWifi, label: "WiFi Speed", value: "250 Mbps", color: "text-cyan-400" },
  { icon: TbCoin, label: "Starting From", value: "$150/mo", color: "text-emerald-400" },
  { icon: TbClock, label: "Open Hours", value: "24/7 Access", color: "text-amber-400" },
  { icon: TbUsers, label: "Capacity", value: "120 Seats", color: "text-violet-400" },
  { icon: TbSun, label: "Weather", value: "28°C avg", color: "text-orange-400" },
  { icon: TbMapPin, label: "Location", value: "Canggu, Bali", color: "text-rose-400" },
];

/* ────────────── Helpers ────────────── */

const getCompanyTypeLabel = (type) => {
  const map = {
    coworking: "Co-Working",
    hostel: "Hostel",
    coliving: "Co-Living",
    meetingroom: "Meeting Room",
    cafe: "Cafe",
    workation: "Workation",
  };
  return map[type?.toLowerCase()] || type || "Space";
};

const getCompanyTypeEmoji = (type) => {
  const map = {
    coworking: "💼",
    hostel: "🛏️",
    coliving: "🏠",
    meetingroom: "🏛️",
    cafe: "☕",
    workation: "🏖️",
  };
  return map[type?.toLowerCase()] || "📍";
};

const formatRelativeTime = (dateStr) => {
  try {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days < 1) return "Today";
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  } catch {
    return "";
  }
};

/* ────────────── Component ────────────── */

const AiProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { company } = useParams();
  const locationState = location.state || {};

  const [companyDetails, setCompanyDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isAboutExpanded, setIsAboutExpanded] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [hasCopiedLink, setHasCopiedLink] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showEnquiryForm, setShowEnquiryForm] = useState(false);
  const [enquiryData, setEnquiryData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    message: "",
  });
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);

  // Try Supabase first, then API, then fall back to sample data
  useEffect(() => {
    let isMounted = true;
    const fetchCompany = async () => {
      try {
        // 1. Try Supabase by business_id or UUID
        const companyId = locationState.companyId;
        if (companyId) {
          const supabaseData = await getListingById(companyId);
          if (isMounted && supabaseData) {
            // Map Supabase fields to the format the component expects
            const mapped = {
              ...supabaseData,
              companyName: supabaseData.company_name || supabaseData.companyName,
              companyTitle: supabaseData.company_title || supabaseData.companyTitle,
              companyType: supabaseData.company_type || supabaseData.companyType,
              totalReviews: supabaseData.total_reviews || supabaseData.totalReviews || 0,
              reviewCount: supabaseData.total_reviews || supabaseData.reviewCount || 0,
              websiteTemplateLink: supabaseData.website_template_link || supabaseData.websiteTemplateLink,
              registeredEntityName: supabaseData.registered_entity_name || supabaseData.registeredEntityName,
              googleMap: supabaseData.google_map || supabaseData.googleMap,
              logoUrl: supabaseData.logo_url || supabaseData.logoUrl,
              wifiSpeed: supabaseData.wifi_speed || supabaseData.wifiSpeed,
              startingPrice: supabaseData.starting_price || supabaseData.startingPrice,
              openHours: supabaseData.open_hours || supabaseData.openHours,
              contactName: supabaseData.contact_name || supabaseData.contactName,
              contactDesignation: supabaseData.contact_designation || supabaseData.contactDesignation,
              contactEmail: supabaseData.contact_email || supabaseData.contactEmail,
              contactPhone: supabaseData.contact_phone || supabaseData.contactPhone,
              socialLinks: supabaseData.social_links || supabaseData.socialLinks,
              isPublic: supabaseData.is_public ?? supabaseData.isPublic ?? true,
              isRegistered: supabaseData.is_registered ?? supabaseData.isRegistered ?? false,
              isActive: supabaseData.is_active ?? supabaseData.isActive ?? true,
            };

            // Fetch reviews from Supabase
            const reviewsData = await getListingReviews(supabaseData.id);
            if (reviewsData && reviewsData.length > 0) {
              mapped.reviews = reviewsData.map((r) => ({
                _id: r.id,
                name: r.name,
                starCount: r.star_count,
                description: r.description,
                createdAt: r.created_at,
              }));
            }

            setCompanyDetails(mapped);
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('[AiProduct] Supabase fetch failed, trying API:', err.message || err);
      }

      try {
        // 2. Try REST API
        const axios = (await import("../utils/axios")).default;
        const params = new URLSearchParams();
        if (locationState.companyId) params.set("companyId", locationState.companyId);
        else if (company) params.set("companyName", company.trim());
        if (locationState.type) params.set("companyType", locationState.type);

        const response = await axios.get(`company/get-single-company-data?${params.toString()}`, {
          timeout: 5000,
        });
        if (isMounted && response?.data) {
          setCompanyDetails(response.data);
          setIsLoading(false);
          return;
        }
      } catch {
        // API unavailable
      }

      // 3. Fall back to sample data
      if (isMounted) {
        const customListing = {
          ...sampleListing,
          companyName: company ? company.replace(/-/g, " ") : sampleListing.companyName,
          companyTitle: company
            ? `${company.replace(/-/g, " ")} — Discover on RoamIQ`
            : sampleListing.companyTitle,
        };
        setCompanyDetails(customListing);
        setIsLoading(false);
      }
    };
    fetchCompany();
    return () => { isMounted = false; };
  }, [company, locationState.companyId, locationState.type]);

  useEffect(() => {
    if (companyDetails?.isLiked !== undefined) {
      setIsLiked(companyDetails.isLiked);
    }
  }, [companyDetails?.isLiked]);

  // Normalize images: Supabase returns string[] but component expects [{_id, url}]
  const rawImages = companyDetails?.images?.slice(0, 5) || [];
  const images = rawImages.map((img, idx) => {
    if (typeof img === 'string') {
      return { _id: `img-${idx}`, url: img };
    }
    return img; // already an object { _id, url }
  });
  const inclusions = companyDetails?.inclusions
    ? companyDetails.inclusions.split(",").map((s) => s.trim()).filter(Boolean)
    : sampleListing.inclusions.split(",").map((s) => s.trim());
  const reviews = companyDetails?.reviews || sampleListing.reviews;
  const displayReviews = showAllReviews ? reviews : reviews.slice(0, 3);
  const companyName = companyDetails?.companyName || company?.replace(/-/g, " ") || "Loading...";
  const companyType = companyDetails?.companyType || locationState.type || "coworking";

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = `Check out ${companyName}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setHasCopiedLink(true);
      setTimeout(() => setHasCopiedLink(false), 2000);
    } catch { /* fallback */ }
  };

  const handleEnquirySubmit = (e) => {
    e.preventDefault();
    setEnquirySubmitted(true);
    setTimeout(() => {
      setEnquirySubmitted(false);
      setShowEnquiryForm(false);
      setEnquiryData({ fullName: "", email: "", mobileNumber: "", message: "" });
    }, 3000);
  };

  const mapsData = companyDetails?.latitude
    ? [{ id: "1", lat: companyDetails.latitude, lng: companyDetails.longitude, name: companyName }]
    : [{ id: "1", lat: -8.6523, lng: 115.1388, name: companyName }];

  /* ── Loading State ── */
  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-b-transparent" />
          <p className="text-gray-400 text-sm">Loading listing details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface animate-fade-in">
      {/* ─── Share Modal ─── */}
      {shareMenuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setShareMenuOpen(false)}>
          <div className="glass-card w-full max-w-md p-6 rounded-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-200 mb-1">Share this listing</h3>
            <p className="text-xs text-gray-400 mb-4">Choose a platform or copy the link</p>
            <div className="flex items-center gap-2 rounded-xl border border-glass-border bg-surface-100 px-3 py-2 mb-4">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full bg-transparent text-xs text-gray-300 outline-none"
              />
              <button onClick={handleCopyLink} className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white hover:bg-cyan-500 transition">
                {hasCopiedLink ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                { icon: TbBrandWhatsapp, label: "WhatsApp", href: `https://wa.me/?text=${encodeURIComponent(shareTitle + " " + shareUrl)}`, color: "text-green-400" },
                { icon: TbBrandFacebook, label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, color: "text-blue-400" },
                { icon: TbBrandTwitter, label: "X", href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`, color: "text-gray-300" },
                { icon: TbBrandLinkedin, label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, color: "text-blue-500" },
              ].map((item) => (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" onClick={() => setShareMenuOpen(false)}
                  className="flex flex-col items-center gap-2 rounded-xl border border-glass-border bg-surface-50 p-3 text-xs text-gray-300 transition hover:border-accent/40 hover:bg-surface-100">
                  <item.icon className={`text-2xl ${item.color}`} />
                  <span>{item.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Hero Image Section ─── */}
      <div className="relative">
        {/* Mobile image carousel */}
        <div className="lg:hidden relative">
          {images.length > 0 ? (
            <>
              <div className="relative h-[320px] w-full overflow-hidden">
                <img
                  src={images[activeImageIndex]?.url || images[0]?.url}
                  alt={companyName}
                  className="h-full w-full object-cover transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
                {/* Back button */}
                <button onClick={() => navigate(-1)} className="absolute top-4 left-4 glass-card rounded-full p-2 text-white hover:bg-white/20 transition">
                  <TbArrowLeft size={20} />
                </button>
                {/* Image counter */}
                <div className="absolute top-4 right-4 glass-card rounded-full px-3 py-1 text-xs text-white font-medium">
                  {activeImageIndex + 1} / {images.length}
                </div>
              </div>
              {/* Thumbnail strip */}
              <div className="flex gap-2 p-3 overflow-x-auto">
                {images.map((img, idx) => (
                  <button key={img._id} onClick={() => setActiveImageIndex(idx)}
                    className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition ${idx === activeImageIndex ? "border-accent" : "border-transparent opacity-60"}`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[200px] bg-surface-100 flex items-center justify-center">
              <TbPhoto className="text-4xl text-gray-600" />
            </div>
          )}
        </div>

        {/* Desktop image grid */}
        <div className="hidden lg:block">
          <div className="max-w-[90rem] mx-auto px-4 pt-4">
            {images.length >= 5 ? (
              <div className="grid grid-cols-4 grid-rows-2 gap-2 rounded-2xl overflow-hidden h-[480px]">
                <div className="col-span-2 row-span-2 cursor-pointer group relative overflow-hidden" onClick={() => navigate("images", { state: { companyName, images: companyDetails?.images } })}>
                  <img src={images[0].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                </div>
                {images.slice(1, 5).map((img, idx) => (
                  <div key={img._id} className="cursor-pointer group relative overflow-hidden" onClick={() => navigate("images", { state: { companyName, images: companyDetails?.images, selectedImageId: img._id } })}>
                    <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    {idx === 3 && (companyDetails?.images?.length || 0) > 5 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">+{(companyDetails?.images?.length || 0) - 5} more</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 rounded-2xl overflow-hidden h-[400px]">
                <div className="cursor-pointer group relative overflow-hidden">
                  <img src={images[0].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {images.slice(1, 5).map((img) => (
                    <div key={img._id} className="cursor-pointer group relative overflow-hidden">
                      <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="h-[300px] bg-surface-100 rounded-2xl flex items-center justify-center">
                <TbPhoto className="text-5xl text-gray-600" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div className="max-w-[90rem] mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ─── Left Column: Info ─── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Title & Actions Row */}
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getCompanyTypeEmoji(companyType)}</span>
                    <span className="text-xs font-medium uppercase tracking-wider text-accent bg-accent/10 px-2 py-0.5 rounded-full">
                      {getCompanyTypeLabel(companyType)}
                    </span>
                  </div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-100 leading-tight">
                    {companyName}
                  </h1>
                  <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                    <span className="flex items-center gap-1"><TbMapPin size={14} /> {companyDetails?.city || "Bali"}, {companyDetails?.country?.charAt(0).toUpperCase() + (companyDetails?.country?.slice(1) || "Indonesia")}</span>
                    <span className="text-glass-border">|</span>
                    <span className="flex items-center gap-1"><TbStarFilled className="text-amber-400" size={14} /> {companyDetails?.ratings || 4.7}</span>
                    <span className="text-glass-border">|</span>
                    <span>{companyDetails?.totalReviews || 128} reviews</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => setShareMenuOpen(true)} className="glass-card rounded-full p-2.5 text-gray-400 hover:text-white hover:border-accent/40 transition" title="Share">
                    <TbShare size={20} />
                  </button>
                  <button onClick={() => setIsLiked(!isLiked)} className={`rounded-full p-2.5 border transition ${isLiked ? "bg-red-500/10 border-red-500/30 text-red-400" : "glass-card text-gray-400 hover:text-white hover:border-accent/40"}`} title="Save">
                    {isLiked ? <IoIosHeart size={20} /> : <IoIosHeartEmpty size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
              {sampleQuickStats.map((stat) => (
                <div key={stat.label} className="glass-card rounded-xl p-3 text-center group hover:border-accent/30 transition">
                  <stat.icon className={`text-xl ${stat.color} mx-auto mb-1`} />
                  <p className="text-xs font-semibold text-gray-200">{stat.value}</p>
                  <p className="text-[10px] text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* About Section */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <span className="w-1 h-5 bg-accent rounded-full" />
                About
              </h2>
              <p className={`text-sm text-gray-300 leading-relaxed ${!isAboutExpanded ? "line-clamp-4" : ""}`}>
                {companyDetails?.about || sampleListing.about}
              </p>
              {(companyDetails?.about || sampleListing.about)?.length > 200 && (
                <button onClick={() => setIsAboutExpanded(!isAboutExpanded)} className="mt-2 text-accent text-sm font-medium hover:underline flex items-center gap-1">
                  {isAboutExpanded ? "Show less" : "Read more"}
                  <TbChevronDown size={14} className={`transition-transform ${isAboutExpanded ? "rotate-180" : ""}`} />
                </button>
              )}
              {companyDetails?.websiteTemplateLink && (
                <a href={companyDetails.websiteTemplateLink} target="_blank" rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-accent text-sm font-medium hover:underline">
                  Visit Website <TbExternalLink size={14} />
                </a>
              )}
            </div>

            {/* Amenities / Inclusions */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-accent rounded-full" />
                What's Included
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {inclusions.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                    <TbCheck className="text-accent flex-shrink-0" size={16} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
                  <span className="w-1 h-5 bg-accent rounded-full" />
                  Reviews
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <TbStarFilled className="text-amber-400" />
                  <span className="font-semibold text-gray-200">{companyDetails?.ratings || 4.7}</span>
                  <span className="text-gray-500">({companyDetails?.totalReviews || 128} reviews)</span>
                </div>
              </div>

              <div className="space-y-4">
                {displayReviews.map((review) => (
                  <div key={review._id} className="border-b border-glass-border/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/30 to-cyan-600/30 flex items-center justify-center text-sm font-semibold text-accent">
                        {review.name?.charAt(0)?.toUpperCase() || "A"}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-200">{review.name}</p>
                        <p className="text-xs text-gray-500">{formatRelativeTime(review.createdAt)}</p>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <TbStarFilled key={i} size={12} className={i < (review.starCount || 5) ? "text-amber-400" : "text-gray-600"} />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed pl-12">{review.description}</p>
                  </div>
                ))}
              </div>

              {reviews.length > 3 && (
                <button onClick={() => setShowAllReviews(!showAllReviews)}
                  className="mt-4 text-accent text-sm font-medium hover:underline flex items-center gap-1">
                  {showAllReviews ? "Show less" : `View all ${reviews.length} reviews`}
                  <TbChevronDown size={14} className={`transition-transform ${showAllReviews ? "rotate-180" : ""}`} />
                </button>
              )}
            </div>

            {/* Map Section */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-200 mb-4 flex items-center gap-2">
                <span className="w-1 h-5 bg-accent rounded-full" />
                Where You'll Be
              </h2>
              <div className="h-[300px] rounded-xl overflow-hidden border border-glass-border">
                <Map locations={mapsData} disableNavigation disableTwoFingerScroll />
              </div>
              {companyDetails?.googleMap && (
                <a href={companyDetails.googleMap} target="_blank" rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-accent text-sm font-medium hover:underline">
                  Open in Google Maps <TbExternalLink size={14} />
                </a>
              )}
            </div>
          </div>

          {/* ─── Right Column: Sticky Sidebar ─── */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 space-y-4">

              {/* Enquiry Card */}
              <div className="glass-card rounded-2xl p-5">
                {!showEnquiryForm ? (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-2xl font-bold text-gray-100">Interested?</p>
                      <p className="text-sm text-gray-400 mt-1">Get a quote or book a tour</p>
                    </div>
                    <button onClick={() => setShowEnquiryForm(true)}
                      className="w-full bg-accent hover:bg-cyan-500 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2">
                      <TbMessage size={18} />
                      Enquire Now
                    </button>
                    <button className="w-full mt-3 glass-card hover:border-accent/40 text-gray-200 font-medium py-3 rounded-xl transition flex items-center justify-center gap-2">
                      <TbPhone size={18} />
                      Contact Host
                    </button>
                  </>
                ) : !enquirySubmitted ? (
                  <form onSubmit={handleEnquirySubmit} className="space-y-3">
                    <h3 className="text-base font-semibold text-gray-200 mb-1">Send Enquiry</h3>
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={enquiryData.fullName}
                      onChange={(e) => setEnquiryData({ ...enquiryData, fullName: e.target.value })}
                      className="w-full bg-surface-100 border border-glass-border rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder:text-gray-500 focus:border-accent/50 focus:outline-none transition"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      required
                      value={enquiryData.email}
                      onChange={(e) => setEnquiryData({ ...enquiryData, email: e.target.value })}
                      className="w-full bg-surface-100 border border-glass-border rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder:text-gray-500 focus:border-accent/50 focus:outline-none transition"
                    />
                    <input
                      type="tel"
                      placeholder="Mobile Number"
                      value={enquiryData.mobileNumber}
                      onChange={(e) => setEnquiryData({ ...enquiryData, mobileNumber: e.target.value })}
                      className="w-full bg-surface-100 border border-glass-border rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder:text-gray-500 focus:border-accent/50 focus:outline-none transition"
                    />
                    <textarea
                      placeholder="Your message (optional)"
                      rows={3}
                      value={enquiryData.message}
                      onChange={(e) => setEnquiryData({ ...enquiryData, message: e.target.value })}
                      className="w-full bg-surface-100 border border-glass-border rounded-lg px-3 py-2.5 text-sm text-gray-200 placeholder:text-gray-500 focus:border-accent/50 focus:outline-none transition resize-none"
                    />
                    <button type="submit" className="w-full bg-accent hover:bg-cyan-500 text-white font-semibold py-2.5 rounded-xl transition flex items-center justify-center gap-2">
                      <TbSend size={16} />
                      Send Enquiry
                    </button>
                    <button type="button" onClick={() => setShowEnquiryForm(false)} className="w-full text-sm text-gray-400 hover:text-gray-200 transition">
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-6">
                    <div className="w-14 h-14 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-3">
                      <TbCheck className="text-emerald-400 text-2xl" />
                    </div>
                    <p className="text-lg font-semibold text-gray-200">Enquiry Sent!</p>
                    <p className="text-sm text-gray-400 mt-1">We'll get back to you shortly</p>
                  </div>
                )}
              </div>

              {/* Host Card */}
              {companyDetails?.poc && (
                <div className="glass-card rounded-2xl p-5">
                  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Your Host</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/30 to-cyan-600/30 flex items-center justify-center text-lg font-bold text-accent">
                      {companyDetails.poc.name?.split(" ").map((n) => n[0]).join("").slice(0, 2) || "HS"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-200">{companyDetails.poc.name}</p>
                      <p className="text-xs text-gray-400">{companyDetails.poc.designation}</p>
                    </div>
                  </div>
                  <div className="mt-3 space-y-2 text-xs text-gray-400">
                    <p className="flex items-center gap-2"><TbCheck className="text-accent" /> Response rate: 100%</p>
                    <p className="flex items-center gap-2"><TbCheck className="text-accent" /> Responds within an hour</p>
                    <p className="flex items-center gap-2"><TbCheck className="text-accent" /> Speaks English</p>
                  </div>
                </div>
              )}

              {/* Quick Info Card */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Type</span>
                    <span className="text-gray-200 font-medium">{getCompanyTypeLabel(companyType)}</span>
                  </div>
                  <div className="border-t border-glass-border/50" />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Location</span>
                    <span className="text-gray-200 font-medium">{companyDetails?.city || "Canggu"}, {companyDetails?.country?.charAt(0).toUpperCase() + (companyDetails?.country?.slice(1) || "")}</span>
                  </div>
                  <div className="border-t border-glass-border/50" />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Rating</span>
                    <span className="text-gray-200 font-medium flex items-center gap-1"><TbStarFilled className="text-amber-400" size={14} /> {companyDetails?.ratings || 4.7}</span>
                  </div>
                  <div className="border-t border-glass-border/50" />
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Internet</span>
                    <span className="text-gray-200 font-medium flex items-center gap-1"><TbWifi className="text-cyan-400" size={14} /> 250 Mbps</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer */}
              <div className="text-[10px] text-gray-500 leading-relaxed p-4 bg-surface-50/50 rounded-xl border border-glass-border/30">
                <p className="mb-1"><b>Source:</b> All content and images have been sourced from publicly available information.</p>
                <p>RoamIQ does not claim ownership of any third-party logos, images, or business information displayed. All trademarks remain the property of their respective owners.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiProduct;
