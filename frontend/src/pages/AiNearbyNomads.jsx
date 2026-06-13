import React, { useState, useEffect, useMemo } from "react";
import {
  Users,
  MapPin,
  Search,
  Filter,
  Coffee,
  Wifi,
  MessageCircle,
  UserPlus,
  Globe,
  Calendar,
  ChevronDown,
  Clock,
  Map,
  Star,
  X,
  Check,
} from "lucide-react";
import { getNomadProfiles, getMeetups } from '../services/supabaseService';



const STATUS_CONFIG = {
  available: { label: "Available to meet", color: "bg-emerald-400", ring: "ring-emerald-400/30", badge: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  open: { label: "Open to connect", color: "bg-cyan-400", ring: "ring-cyan-400/30", badge: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30" },
  busy: { label: "Busy this week", color: "bg-gray-500", ring: "ring-gray-500/30", badge: "bg-gray-500/15 text-gray-400 border-gray-500/30" },
};

const WORK_TYPE_COLORS = {
  "Full-time Remote": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  Freelancer: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  Entrepreneur: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  Student: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
};

const MEETUP_TYPE_COLORS = {
  "Coworking Session": "bg-cyan-500/15 text-cyan-400 border-cyan-500/20",
  "Networking Event": "bg-purple-500/15 text-purple-400 border-purple-500/20",
  "Hiking Group": "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  "Coffee Meetup": "bg-amber-500/15 text-amber-400 border-amber-500/20",
  Workshop: "bg-rose-500/15 text-rose-400 border-rose-500/20",
};

/* ══════════════════════════════════════════════════════════════════════════
   HELPER – is recently active (within 30 min)
   ══════════════════════════════════════════════════════════════════════════ */
const isRecentlyActive = (lastActive) => {
  const match = lastActive.match(/(\d+)(m|h)/);
  if (!match) return false;
  const val = parseInt(match[1], 10);
  if (match[2] === "h") return val <= 1;
  return true; // minutes → always recent
};

/* ══════════════════════════════════════════════════════════════════════════
   SUB-COMPONENTS
   ══════════════════════════════════════════════════════════════════════════ */

/* ── Stat Card ── */
const StatCard = ({ icon: Icon, value, label, accent }) => (
  <div className="glass-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4">
    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${accent || "bg-accent/10"}`}>
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
    </div>
    <div>
      <p className="text-xl sm:text-2xl font-bold text-white">{value}</p>
      <p className="text-xs sm:text-sm text-gray-400">{label}</p>
    </div>
  </div>
);

/* ── Filter Chip ── */
const FilterChip = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium border transition-all duration-200 whitespace-nowrap ${
      active
        ? "bg-accent/20 text-accent border-accent/40"
        : "bg-glass text-gray-400 border-glass-border hover:text-white hover:border-accent/30"
    }`}
  >
    {label}
  </button>
);

/* ── Nomad Card ── */
const NomadCard = ({ nomad, onSayHello }) => {
  const sc = STATUS_CONFIG[nomad.status];
  const online = isRecentlyActive(nomad.lastActive);

  return (
    <div className="glass-card-hover p-5 flex flex-col gap-4 animate-fade-in group">
      {/* Header: avatar + name + status */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${nomad.gradient} flex items-center justify-center text-white font-bold text-sm`}>
            {nomad.initials}
          </div>
          {online && (
            <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full ${sc.color} ring-2 ring-surface`} />
          )}
        </div>

        {/* Name + role */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold text-sm truncate">{nomad.name}</h3>
            {online && <span className="text-[10px] text-emerald-400 font-medium shrink-0">online</span>}
          </div>
          <p className="text-gray-400 text-xs truncate">{nomad.role}</p>
        </div>

        {/* Status badge */}
        <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border shrink-0 ${sc.badge}`}>
          {sc.label}
        </span>
      </div>

      {/* Location + home */}
      <div className="flex flex-col gap-1.5 text-xs sm:text-sm">
        <div className="flex items-center gap-1.5 text-gray-300">
          <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
          <span>{nomad.city}, {nomad.country} {nomad.flag}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <Globe className="w-3.5 h-3.5 shrink-0 opacity-50" />
          <span>From {nomad.homeCountry}</span>
        </div>
        <div className="flex items-center gap-1.5 text-gray-400">
          <Clock className="w-3.5 h-3.5 shrink-0 opacity-50" />
          <span>Active {nomad.lastActive}</span>
        </div>
      </div>

      {/* Work type */}
      <span className={`self-start text-[10px] sm:text-xs px-2 py-0.5 rounded-full border ${WORK_TYPE_COLORS[nomad.workType] || "bg-gray-500/15 text-gray-400 border-gray-500/30"}`}>
        {nomad.workType}
      </span>

      {/* Interests */}
      <div className="flex flex-wrap gap-1.5">
        {nomad.interests.map((interest) => (
          <span key={interest} className="text-[10px] sm:text-xs px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5">
            {interest}
          </span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-auto pt-1">
        <button
          onClick={() => onSayHello(nomad)}
          className="flex-1 btn-primary text-xs sm:text-sm py-2 flex items-center justify-center gap-1.5"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Say Hello
        </button>
        <button className="btn-ghost text-xs sm:text-sm py-2 px-3 flex items-center justify-center gap-1.5">
          <UserPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">View Profile</span>
        </button>
      </div>
    </div>
  );
};

/* ── Meetup Card ── */
const MeetupCard = ({ meetup, onJoin }) => {
  const fillPct = Math.round((meetup.attendees / meetup.maxAttendees) * 100);
  const typeColor = MEETUP_TYPE_COLORS[meetup.type] || "bg-gray-500/15 text-gray-400 border-gray-500/20";

  return (
    <div className="glass-card-hover p-5 flex flex-col gap-3 min-w-[280px] sm:min-w-0 animate-fade-in">
      {/* Type badge + icon */}
      <div className="flex items-center justify-between">
        <span className={`text-[10px] sm:text-xs px-2 py-0.5 rounded-full border ${typeColor}`}>
          {meetup.type}
        </span>
        <span className="text-2xl">{meetup.icon}</span>
      </div>

      {/* Title */}
      <h3 className="text-white font-semibold text-sm sm:text-base leading-snug">{meetup.title}</h3>

      {/* Details */}
      <div className="flex flex-col gap-1.5 text-xs sm:text-sm text-gray-400">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
          <span>{meetup.date}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-accent shrink-0" />
          <span>{meetup.time}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
          <span>{meetup.location}</span>
        </div>
      </div>

      {/* Attendees bar */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-400">
            <Users className="w-3 h-3 inline mr-1" />
            {meetup.attendees}/{meetup.maxAttendees} attending
          </span>
          <span className={`font-medium ${fillPct >= 80 ? "text-amber-400" : "text-accent"}`}>
            {fillPct >= 80 ? "Almost full" : "Spots left"}
          </span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400 transition-all duration-500"
            style={{ width: `${fillPct}%` }}
          />
        </div>
      </div>

      {/* Join button */}
      <button
        onClick={() => onJoin(meetup)}
        className="btn-primary text-xs sm:text-sm py-2 flex items-center justify-center gap-1.5 mt-auto"
      >
        <Check className="w-3.5 h-3.5" />
        Join Meetup
      </button>
    </div>
  );
};

/* ── Map Placeholder ── */
const MapPlaceholder = () => {
  /* Animated dots that suggest map pins */
  const dots = [
    { top: "20%", left: "30%", delay: "0s", size: "w-2.5 h-2.5" },
    { top: "35%", left: "55%", delay: "1s", size: "w-3 h-3" },
    { top: "50%", left: "20%", delay: "2s", size: "w-2 h-2" },
    { top: "25%", left: "70%", delay: "0.5s", size: "w-2.5 h-2.5" },
    { top: "60%", left: "45%", delay: "1.5s", size: "w-3 h-3" },
    { top: "40%", left: "80%", delay: "2.5s", size: "w-2 h-2" },
    { top: "70%", left: "65%", delay: "0.8s", size: "w-2.5 h-2.5" },
    { top: "15%", left: "50%", delay: "1.8s", size: "w-2 h-2" },
  ];

  return (
    <div className="glass-card p-6 sm:p-8 relative overflow-hidden">
      {/* Background gradient grid effect */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(rgba(6,182,212,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.5) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      {/* Animated location dots */}
      {dots.map((dot, i) => (
        <span
          key={i}
          className={`absolute ${dot.size} rounded-full bg-accent animate-glow-pulse`}
          style={{ top: dot.top, left: dot.left, animationDelay: dot.delay, opacity: 0.6 }}
        />
      ))}

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center py-8 sm:py-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
          <Map className="w-8 h-8 text-accent" />
        </div>
        <h3 className="text-white font-semibold text-lg sm:text-xl mb-2">Interactive Map</h3>
        <p className="text-gray-400 text-sm max-w-md">
          See nomads pinned on a live map. Coming soon — with real-time location sharing and proximity alerts.
        </p>
        <div className="mt-4 flex items-center gap-2 text-accent text-sm font-medium">
          <Star className="w-4 h-4" />
          <span>Coming Soon</span>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════════════════ */

const AiNearbyNomads = () => {
  /* ── State ── */
  const [nomads, setNomads] = useState([]);
  const [meetups, setMeetups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState("All");
  const [workTypeFilter, setWorkTypeFilter] = useState("All");
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all"); // all | available | open
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [greetedNomads, setGreetedNomads] = useState(new Set());
  const [joinedMeetups, setJoinedMeetups] = useState(new Set());

  /* ── Fetch data ── */
  useEffect(() => {
    Promise.all([getNomadProfiles(), getMeetups()]).then(([nomadsData, meetupsData]) => {
      setNomads(nomadsData);
      setMeetups(meetupsData);
      setLoading(false);
    });
  }, []);

  /* ── Derived filter options ── */
  const ALL_CITIES = useMemo(() => [...new Set(nomads.map((n) => n.city))].sort(), [nomads]);
  const ALL_WORK_TYPES = useMemo(() => [...new Set(nomads.map((n) => n.workType))], [nomads]);
  const ALL_INTERESTS = useMemo(() => [...new Set(nomads.flatMap((n) => n.interests || []))].sort(), [nomads]);

  /* ── Filtered nomads ── */
  const filteredNomads = useMemo(() => {
    return nomads.filter((n) => {
      if (cityFilter !== "All" && n.city !== cityFilter) return false;
      if (workTypeFilter !== "All" && n.workType !== workTypeFilter) return false;
      if (statusFilter !== "all" && n.status !== statusFilter) return false;
      if (selectedInterests.length > 0 && !selectedInterests.some((i) => (n.interests || []).includes(i))) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          n.name.toLowerCase().includes(q) ||
          n.role.toLowerCase().includes(q) ||
          n.city.toLowerCase().includes(q) ||
          (n.interests || []).some((i) => i.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [nomads, cityFilter, workTypeFilter, statusFilter, selectedInterests, searchQuery]);

  /* ── Filtered meetups ── */
  const filteredMeetups = useMemo(() => {
    if (cityFilter === "All") return meetups;
    return meetups.filter((m) => m.city === cityFilter);
  }, [meetups, cityFilter]);

  /* ── Stats ── */
  const stats = useMemo(() => {
    const onlineCount = nomads.filter((n) => isRecentlyActive(n.lastActive)).length;
    const citiesCount = new Set(nomads.map((n) => n.city)).size;
    return {
      total: nomads.length,
      online: onlineCount,
      cities: citiesCount,
      meetupsThisWeek: meetups.length,
    };
  }, [nomads, meetups]);

  /* ── Handlers ── */
  const toggleInterest = (interest) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const handleSayHello = (nomad) => {
    setGreetedNomads((prev) => new Set(prev).add(nomad.id));
  };

  const handleJoinMeetup = (meetup) => {
    setJoinedMeetups((prev) => new Set(prev).add(meetup.id));
  };

  const clearAllFilters = () => {
    setCityFilter("All");
    setWorkTypeFilter("All");
    setSelectedInterests([]);
    setStatusFilter("all");
    setSearchQuery("");
  };

  const hasActiveFilters = cityFilter !== "All" || workTypeFilter !== "All" || selectedInterests.length > 0 || statusFilter !== "all" || searchQuery;

  /* ════════════════════════════════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════════════════════════════════ */

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading nomads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial opacity-30 pointer-events-none" />

        <div className="section-container relative z-10 pt-8 pb-12 sm:pt-12 sm:pb-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-medium mb-4 sm:mb-6">
              <Users className="w-3.5 h-3.5" />
              Community
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              <span className="gradient-text">Nearby Nomads</span>
            </h1>
            <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto">
              Connect with digital nomads around the world. Find your tribe, join meetups, and build meaningful connections wherever you roam.
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="section-container -mt-2 mb-8 sm:mb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <StatCard icon={Users} value={stats.total} label="Total Nomads" />
          <StatCard icon={Wifi} value={stats.online} label="Nomads Online" accent="bg-emerald-500/10" />
          <StatCard icon={Globe} value={stats.cities} label="Cities Represented" accent="bg-purple-500/10" />
          <StatCard icon={Calendar} value={stats.meetupsThisWeek} label="Meetups This Week" accent="bg-amber-500/10" />
        </div>
      </section>

      {/* ── Search & Filter Bar ── */}
      <section className="section-container mb-6 sm:mb-8">
        <div className="glass-card p-4 sm:p-5">
          {/* Top row: search + toggles */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Search nomads by name, role, city, or interest…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-dark w-full pl-10 pr-4 py-2.5 text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* City dropdown */}
            <div className="relative">
              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="input-dark appearance-none pr-8 py-2.5 text-sm min-w-[140px] cursor-pointer"
              >
                <option value="All">All Cities</option>
                {ALL_CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>

            {/* Filter toggle button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`btn-ghost text-sm py-2.5 px-4 flex items-center gap-2 justify-center ${showFilters ? "!border-accent/40 !text-accent" : ""}`}
            >
              <Filter className="w-4 h-4" />
              Filters
              {hasActiveFilters && (
                <span className="w-2 h-2 rounded-full bg-accent" />
              )}
            </button>
          </div>

          {/* Expandable filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-glass-border space-y-4 animate-slide-down">
              {/* Work type */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Work Type</p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip label="All" active={workTypeFilter === "All"} onClick={() => setWorkTypeFilter("All")} />
                  {ALL_WORK_TYPES.map((wt) => (
                    <FilterChip key={wt} label={wt} active={workTypeFilter === wt} onClick={() => setWorkTypeFilter(wt)} />
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Interests</p>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {ALL_INTERESTS.map((interest) => (
                    <FilterChip
                      key={interest}
                      label={interest}
                      active={selectedInterests.includes(interest)}
                      onClick={() => toggleInterest(interest)}
                    />
                  ))}
                </div>
              </div>

              {/* Status */}
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2 font-medium">Status</p>
                <div className="flex flex-wrap gap-2">
                  <FilterChip label="All" active={statusFilter === "all"} onClick={() => setStatusFilter("all")} />
                  <FilterChip label="Available" active={statusFilter === "available"} onClick={() => setStatusFilter("available")} />
                  <FilterChip label="Open to Connect" active={statusFilter === "open"} onClick={() => setStatusFilter("open")} />
                  <FilterChip label="Busy" active={statusFilter === "busy"} onClick={() => setStatusFilter("busy")} />
                </div>
              </div>

              {/* Clear filters */}
              {hasActiveFilters && (
                <button
                  onClick={clearAllFilters}
                  className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Results count ── */}
      <section className="section-container mb-4">
        <p className="text-sm text-gray-400">
          Showing <span className="text-white font-medium">{filteredNomads.length}</span> nomad{filteredNomads.length !== 1 ? "s" : ""}
          {cityFilter !== "All" && <span> in <span className="text-accent">{cityFilter}</span></span>}
        </p>
      </section>

      {/* ── Nomad Cards Grid ── */}
      <section className="section-container mb-12 sm:mb-16">
        {filteredNomads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 animate-stagger">
            {filteredNomads.map((nomad) => (
              <NomadCard
                key={nomad.id}
                nomad={nomad}
                onSayHello={(n) => {
                  if (!greetedNomads.has(n.id)) handleSayHello(n);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-12 sm:p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-accent" />
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">No nomads found</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-4">
              Try adjusting your filters or search to find digital nomads in your area.
            </p>
            <button onClick={clearAllFilters} className="btn-ghost text-sm">
              Clear Filters
            </button>
          </div>
        )}
      </section>

      {/* ── Map Preview Placeholder ── */}
      <section className="section-container mb-12 sm:mb-16">
        <MapPlaceholder />
      </section>

      {/* ── Upcoming Meetups Section ── */}
      <section className="section-container mb-16 sm:mb-20">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />
              Upcoming Meetups
            </h2>
            <p className="text-gray-400 text-sm mt-1">
              Join local events and connect with fellow nomads
            </p>
          </div>
          {cityFilter !== "All" && (
            <span className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent border border-accent/20">
              {cityFilter}
            </span>
          )}
        </div>

        {/* Meetups grid */}
        {filteredMeetups.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 animate-stagger">
            {filteredMeetups.map((meetup) => (
              <MeetupCard
                key={meetup.id}
                meetup={meetup}
                onJoin={(m) => {
                  if (!joinedMeetups.has(m.id)) handleJoinMeetup(m);
                }}
              />
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 text-center">
            <p className="text-gray-400 text-sm">No meetups scheduled in {cityFilter}. Check back soon or explore other cities!</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default AiNearbyNomads;
