import React, { useState, useEffect, useMemo } from "react";
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  Plus,
  Edit3,
  Trash2,
  Plane,
  Globe,
  Map,
  TrendingUp,
  Briefcase,
  ChevronDown,
  X,
} from "lucide-react";
import { getTrips, addTrip as addTripService, updateTrip as updateTripService, deleteTrip as deleteTripService } from '../services/supabaseService';
import { useSupabaseAuth } from '../context/SupabaseAuthContext';

/* ═══════════════════════════ CONSTANTS ═══════════════════════════ */

const STORAGE_KEY = "roamiq-trip-tracker-data";

const PURPOSE_COLORS = {
  Workation: { bg: "bg-cyan-500/20", text: "text-cyan-400", border: "border-cyan-500/30" },
  Vacation: { bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
  Business: { bg: "bg-amber-500/20", text: "text-amber-400", border: "border-amber-500/30" },
  Relocation: { bg: "bg-purple-500/20", text: "text-purple-400", border: "border-purple-500/30" },
};

const PURPOSE_ICONS = {
  Workation: Briefcase,
  Vacation: Plane,
  Business: Briefcase,
  Relocation: MapPin,
};

const CONTINENTS = [
  { name: "Asia", icon: "🌏", countries: ["Thailand", "Indonesia", "Japan"] },
  { name: "Europe", icon: "🌍", countries: ["Portugal", "Germany"] },
  { name: "South America", icon: "🌎", countries: ["Colombia"] },
  { name: "North America", icon: "🌎", countries: [] },
  { name: "Africa", icon: "🌍", countries: [] },
  { name: "Oceania", icon: "🌏", countries: [] },
  { name: "Antarctica", icon: "🧊", countries: [] },
];

/* ═══════════════════════════ HELPERS ═══════════════════════════ */

const daysBetween = (start, end) => {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(1, Math.round((e - s) / (1000 * 60 * 60 * 24)));
};

const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getContinent = (country) => {
  for (const c of CONTINENTS) {
    if (c.countries.includes(country)) return c.name;
  }
  return "Unknown";
};

/* ═══════════════════════════ SUB-COMPONENTS ═══════════════════════════ */

/* ── Progress Ring ── */
const ProgressRing = ({ value, max, size = 80, strokeWidth = 6, children }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference - progress * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#06b6d4"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
          style={{ filter: "drop-shadow(0 0 6px rgba(6,182,212,0.4))" }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
};

/* ── Star Rating ── */
const StarRating = ({ rating, onRate, size = 16 }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={`cursor-pointer transition-colors duration-150 ${
            star <= (hover || rating)
              ? "fill-amber-400 text-amber-400"
              : "text-gray-600"
          }`}
          onMouseEnter={() => onRate && setHover(star)}
          onMouseLeave={() => onRate && setHover(0)}
          onClick={() => onRate && onRate(star)}
        />
      ))}
    </div>
  );
};

/* ── Stat Card ── */
const StatCard = ({ icon: Icon, label, value, sub, ring }) => (
  <div className="glass-card p-5 flex flex-col items-center gap-3 text-center">
    {ring ? (
      <ProgressRing value={ring.value} max={ring.max}>
        <span className="text-lg font-bold text-white">{ring.value}</span>
      </ProgressRing>
    ) : (
      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
        <Icon size={22} className="text-accent" />
      </div>
    )}
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-gray-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

/* ── Purpose Badge ── */
const PurposeBadge = ({ purpose }) => {
  const c = PURPOSE_COLORS[purpose] || PURPOSE_COLORS.Workation;
  const Icon = PURPOSE_ICONS[purpose] || Briefcase;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium ${c.bg} ${c.text} border ${c.border}`}>
      <Icon size={12} />
      {purpose}
    </span>
  );
};

/* ── Duration Badge ── */
const DurationBadge = ({ arrival, departure }) => {
  const days = daysBetween(arrival, departure);
  const label = days >= 30 ? `${Math.round(days / 30)}mo ${days % 30}d` : `${days}d`;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium bg-glass border border-glass-border text-gray-300">
      <Clock size={12} className="text-accent" />
      {label}
    </span>
  );
};

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */

const AiTripTracker = () => {
  /* ── Auth ── */
  const { user } = useSupabaseAuth();

  /* ── State ── */
  const [trips, setTrips] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    city: "",
    country: "",
    flag: "",
    arrival: "",
    departure: "",
    purpose: "Workation",
    rating: 0,
    notes: "",
    image: "",
  });

  /* ── Load trips from service (with localStorage fallback) ── */
  useEffect(() => {
    getTrips(user?.id).then(data => {
      setTrips(data);
      setLoading(false);
      setMounted(true);
    });
  }, [user]);

  /* ── Save to localStorage (fallback) ── */
  useEffect(() => {
    if (mounted && !user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
    }
  }, [trips, mounted, user]);

  /* ── Computed Stats ── */
  const stats = useMemo(() => {
    const countries = new Set(trips.map((t) => t.country));
    const cities = new Set(trips.map((t) => t.city));
    const totalDays = trips.reduce((sum, t) => sum + daysBetween(t.arrival, t.departure), 0);
    const longestStay = trips.length
      ? trips.reduce((max, t) => {
          const d = daysBetween(t.arrival, t.departure);
          return d > max.days ? { ...t, days: d } : max;
        }, { days: 0 })
      : { days: 0, city: "N/A" };
    const visitedContinents = new Set(trips.map((t) => getContinent(t.country)));
    visitedContinents.delete("Unknown");

    return {
      totalCountries: countries.size,
      totalCities: cities.size,
      totalDays,
      longestStay,
      continentsExplored: visitedContinents.size,
    };
  }, [trips]);

  const countryCounts = useMemo(() => {
    const m = {};
    trips.forEach((t) => { m[t.country] = (m[t.country] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [trips]);

  const purposeCounts = useMemo(() => {
    const m = {};
    trips.forEach((t) => { m[t.purpose] = (m[t.purpose] || 0) + 1; });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [trips]);

  const yearMonths = useMemo(() => {
    const m = {};
    trips.forEach((t) => {
      const start = new Date(t.arrival);
      const end = new Date(t.departure);
      let cur = new Date(start);
      while (cur <= end) {
        const key = cur.getFullYear();
        if (!m[key]) m[key] = new Set();
        m[key].add(cur.getMonth());
        cur.setMonth(cur.getMonth() + 1);
      }
    });
    return Object.entries(m)
      .map(([year, months]) => ({ year, months: months.size }))
      .sort((a, b) => b.year - a.year);
  }, [trips]);

  const sortedTrips = useMemo(
    () => [...trips].sort((a, b) => new Date(b.arrival) - new Date(a.arrival)),
    [trips]
  );

  /* ── Form handlers ── */
  const resetForm = () => {
    setForm({ city: "", country: "", flag: "", arrival: "", departure: "", purpose: "Workation", rating: 0, notes: "", image: "" });
    setEditingTrip(null);
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setForm({ ...trip });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (user) {
      try { await deleteTripService(id, user.id); } catch (e) { console.warn('deleteTripService failed:', e); }
    }
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.city || !form.country || !form.arrival || !form.departure) return;

    if (editingTrip) {
      if (user) {
        try {
          const updated = await updateTripService(editingTrip.id, user.id, form);
          setTrips((prev) => prev.map((t) => (t.id === editingTrip.id ? updated : t)));
        } catch (e) {
          console.warn('updateTripService failed:', e);
          setTrips((prev) => prev.map((t) => (t.id === editingTrip.id ? { ...form, id: editingTrip.id } : t)));
        }
      } else {
        setTrips((prev) => prev.map((t) => (t.id === editingTrip.id ? { ...form, id: editingTrip.id } : t)));
      }
    } else {
      if (user) {
        try {
          const newTrip = await addTripService(user.id, form);
          setTrips((prev) => [newTrip, ...prev]);
        } catch (e) {
          console.warn('addTripService failed:', e);
          setTrips((prev) => [{ ...form, id: Date.now() }, ...prev]);
        }
      } else {
        setTrips((prev) => [{ ...form, id: Date.now() }, ...prev]);
      }
    }
    resetForm();
    setShowForm(false);
  };

  const updateField = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  /* ═══════════════════════════ RENDER ═══════════════════════════ */

  if (!mounted || loading) {
    return (
      <div className="page-container flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading trips...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* ──── HERO ──── */}
      <section className="section-container pt-8 pb-6">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-6">
            <Plane size={16} />
            Trip Tracker
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">Trip Tracker</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
            Log your journeys, track your adventures
          </p>
        </div>
      </section>

      {/* ──── STATS DASHBOARD ──── */}
      <section className="section-container pb-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <StatCard
            icon={Globe}
            label="Countries Visited"
            value={stats.totalCountries}
            ring={{ value: stats.totalCountries, max: 50 }}
          />
          <StatCard
            icon={MapPin}
            label="Cities Visited"
            value={stats.totalCities}
          />
          <StatCard
            icon={Clock}
            label="Days Traveled"
            value={stats.totalDays.toLocaleString()}
          />
          <StatCard
            icon={Calendar}
            label="Longest Stay"
            value={`${stats.longestStay.days}d`}
            sub={stats.longestStay.city}
          />
          <StatCard
            icon={Map}
            label="Continents Explored"
            value={`${stats.continentsExplored}/7`}
          />
        </div>
      </section>

      {/* ──── ADD TRIP BUTTON ──── */}
      <section className="section-container pb-4">
        <button
          onClick={() => {
            if (showForm && !editingTrip) { setShowForm(false); resetForm(); }
            else { resetForm(); setShowForm(true); }
          }}
          className="btn-primary inline-flex items-center gap-2"
        >
          {showForm ? <ChevronDown size={18} /> : <Plus size={18} />}
          {showForm ? "Hide Form" : "Add Trip"}
        </button>
      </section>

      {/* ──── ADD/EDIT TRIP FORM ──── */}
      {showForm && (
        <section className="section-container pb-8 animate-slide-down">
          <div className="glass-card p-6 max-w-3xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                {editingTrip ? <Edit3 size={20} className="text-accent" /> : <Plus size={20} className="text-accent" />}
                {editingTrip ? "Edit Trip" : "Log New Trip"}
              </h2>
              <button
                onClick={() => { setShowForm(false); resetForm(); }}
                className="w-8 h-8 rounded-lg bg-glass border border-glass-border flex items-center justify-center text-gray-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* City */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">City *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    placeholder="e.g. Bangkok"
                    className="input-dark w-full"
                    required
                  />
                </div>
                {/* Country */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Country *</label>
                  <input
                    type="text"
                    value={form.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    placeholder="e.g. Thailand"
                    className="input-dark w-full"
                    required
                  />
                </div>
                {/* Flag */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Flag Emoji</label>
                  <input
                    type="text"
                    value={form.flag}
                    onChange={(e) => updateField("flag", e.target.value)}
                    placeholder="🇹🇭"
                    className="input-dark w-full"
                  />
                </div>
                {/* Purpose */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Trip Purpose</label>
                  <select
                    value={form.purpose}
                    onChange={(e) => updateField("purpose", e.target.value)}
                    className="input-dark w-full"
                  >
                    <option value="Workation">Workation</option>
                    <option value="Vacation">Vacation</option>
                    <option value="Business">Business</option>
                    <option value="Relocation">Relocation</option>
                  </select>
                </div>
                {/* Arrival */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Arrival Date *</label>
                  <input
                    type="date"
                    value={form.arrival}
                    onChange={(e) => updateField("arrival", e.target.value)}
                    className="input-dark w-full"
                    required
                  />
                </div>
                {/* Departure */}
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Departure Date *</label>
                  <input
                    type="date"
                    value={form.departure}
                    onChange={(e) => updateField("departure", e.target.value)}
                    className="input-dark w-full"
                    required
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Rating</label>
                <StarRating
                  rating={form.rating}
                  onRate={(r) => updateField("rating", r)}
                  size={24}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Image URL</label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) => updateField("image", e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="input-dark w-full"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm text-gray-400 mb-1.5">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="How was the trip?"
                  rows={3}
                  className="input-dark w-full resize-none"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <button type="submit" className="btn-primary">
                  {editingTrip ? "Update Trip" : "Add Trip"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowForm(false); resetForm(); }}
                  className="btn-ghost"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* ──── TRIP TIMELINE ──── */}
      <section className="section-container pb-12">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={20} className="text-accent" />
          <h2 className="text-2xl font-bold text-white">Your Trips</h2>
          <span className="text-sm text-gray-500 ml-1">({trips.length})</span>
        </div>

        {trips.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Plane size={48} className="text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-2">No trips logged yet</p>
            <p className="text-gray-500 text-sm">Click "Add Trip" to start tracking your adventures!</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[23px] md:left-[31px] top-0 bottom-0 w-px bg-glass-border hidden sm:block" />

            <div className="space-y-6">
              {sortedTrips.map((trip, idx) => (
                <div key={trip.id} className="relative flex gap-4 sm:gap-6 group animate-fade-in" style={{ animationDelay: `${idx * 60}ms` }}>
                  {/* Timeline dot */}
                  <div className="hidden sm:flex flex-shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full bg-surface-50 border-2 border-accent/40 items-center justify-center text-lg z-10 group-hover:border-accent group-hover:shadow-glow-sm transition-all duration-300">
                    {trip.flag || "📍"}
                  </div>

                  {/* Card */}
                  <div className="glass-card-hover flex-1 overflow-hidden flex flex-col sm:flex-row">
                    {/* Image */}
                    {trip.image && (
                      <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0 overflow-hidden">
                        <img
                          src={trip.image}
                          alt={trip.city}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                            {trip.flag && <span className="sm:hidden">{trip.flag}</span>}
                            {trip.city}, {trip.country}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                            <Calendar size={14} />
                            {formatDate(trip.arrival)} — {formatDate(trip.departure)}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <PurposeBadge purpose={trip.purpose} />
                          <DurationBadge arrival={trip.arrival} departure={trip.departure} />
                        </div>
                      </div>

                      {trip.notes && (
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{trip.notes}</p>
                      )}

                      <div className="flex items-center justify-between">
                        <StarRating rating={trip.rating} size={14} />
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(trip)}
                            className="w-8 h-8 rounded-lg bg-glass border border-glass-border flex items-center justify-center text-gray-400 hover:text-accent hover:border-accent/30 transition-all"
                          >
                            <Edit3 size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(trip.id)}
                            className="w-8 h-8 rounded-lg bg-glass border border-glass-border flex items-center justify-center text-gray-400 hover:text-red-400 hover:border-red-500/30 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ──── WORLD MAP / CONTINENTS ──── */}
      <section className="section-container pb-12">
        <div className="flex items-center gap-2 mb-6">
          <Globe size={20} className="text-accent" />
          <h2 className="text-2xl font-bold text-white">Continents Explored</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {CONTINENTS.map((continent) => {
            const visitedCountries = trips
              .map((t) => t.country)
              .filter((c) => continent.countries.includes(c));
            const uniqueVisited = [...new Set(visitedCountries)];
            const isVisited = uniqueVisited.length > 0;
            const progress = continent.countries.length > 0
              ? (uniqueVisited.length / Math.max(continent.countries.length, 1)) * 100
              : 0;

            return (
              <div
                key={continent.name}
                className={`glass-card p-5 transition-all duration-300 ${
                  isVisited ? "border-accent/30 hover:border-accent/50" : "opacity-60"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">{continent.icon}</span>
                  {isVisited ? (
                    <span className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                      ✓
                    </span>
                  ) : (
                    <span className="w-6 h-6 rounded-full bg-glass border border-glass-border" />
                  )}
                </div>
                <h3 className="font-semibold text-white text-sm mb-1">{continent.name}</h3>
                <p className="text-xs text-gray-500 mb-3">
                  {uniqueVisited.length} / {continent.countries.length || "—"} countries
                </p>
                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-glass overflow-hidden">
                  <div
                    className="h-full rounded-full bg-accent transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {uniqueVisited.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {uniqueVisited.map((c) => (
                      <span key={c} className="text-[11px] px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20">
                        {c}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ──── TRAVEL STATS CHARTS ──── */}
      <section className="section-container pb-16">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp size={20} className="text-accent" />
          <h2 className="text-2xl font-bold text-white">Travel Analytics</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Most Visited Countries Bar Chart ── */}
          <div className="glass-card p-6 lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-300 mb-5 flex items-center gap-2">
              <Map size={16} className="text-accent" />
              Most Visited Countries
            </h3>
            <div className="space-y-4">
              {countryCounts.slice(0, 6).map(([country, count], i) => {
                const maxCount = countryCounts[0]?.[1] || 1;
                const widthPercent = (count / maxCount) * 100;
                const trip = trips.find((t) => t.country === country);
                return (
                  <div key={country}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-gray-300 flex items-center gap-1.5">
                        {trip?.flag} {country}
                      </span>
                      <span className="text-xs text-accent font-medium">{count} trip{count > 1 ? "s" : ""}</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-glass overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-accent to-cyan-400 transition-all duration-700"
                        style={{ width: `${widthPercent}%`, animationDelay: `${i * 100}ms` }}
                      />
                    </div>
                  </div>
                );
              })}
              {countryCounts.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No data yet</p>
              )}
            </div>
          </div>

          {/* ── Travel Purpose Breakdown (Pie Chart CSS) ── */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-5 flex items-center gap-2">
              <Briefcase size={16} className="text-accent" />
              Trip Purpose Breakdown
            </h3>
            {purposeCounts.length > 0 ? (
              <>
                {/* CSS Donut Chart */}
                <div className="flex justify-center mb-6">
                  <div className="relative w-40 h-40">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      {(() => {
                        const total = purposeCounts.reduce((s, [, c]) => s + c, 0);
                        const purposeColors = {
                          Workation: "#06b6d4",
                          Vacation: "#10b981",
                          Business: "#f59e0b",
                          Relocation: "#8b5cf6",
                        };
                        let offset = 0;
                        return purposeCounts.map(([purpose, count]) => {
                          const pct = (count / total) * 100;
                          const dashArray = `${pct} ${100 - pct}`;
                          const el = (
                            <circle
                              key={purpose}
                              cx="18"
                              cy="18"
                              r="14"
                              fill="none"
                              stroke={purposeColors[purpose] || "#06b6d4"}
                              strokeWidth="4"
                              strokeDasharray={dashArray}
                              strokeDashoffset={`${-offset}`}
                              className="transition-all duration-700"
                            />
                          );
                          offset += pct;
                          return el;
                        });
                      })()}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold text-white">{trips.length}</span>
                      <span className="text-[10px] text-gray-500">trips</span>
                    </div>
                  </div>
                </div>
                {/* Legend */}
                <div className="space-y-2.5">
                  {purposeCounts.map(([purpose, count]) => {
                    const c = PURPOSE_COLORS[purpose] || PURPOSE_COLORS.Workation;
                    const total = purposeCounts.reduce((s, [, ct]) => s + ct, 0);
                    const pct = Math.round((count / total) * 100);
                    return (
                      <div key={purpose} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-sm ${c.bg} border ${c.border}`} />
                          <span className="text-sm text-gray-300">{purpose}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">{count}</span>
                          <span className="text-xs font-medium text-gray-400">{pct}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No data yet</p>
            )}
          </div>

          {/* ── Months Traveled Per Year ── */}
          <div className="glass-card p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-5 flex items-center gap-2">
              <Calendar size={16} className="text-accent" />
              Months Traveled / Year
            </h3>
            {yearMonths.length > 0 ? (
              <div className="space-y-4">
                {yearMonths.map(({ year, months }) => {
                  const pct = (months / 12) * 100;
                  return (
                    <div key={year}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-gray-300 font-medium">{year}</span>
                        <span className="text-xs text-accent font-medium">{months} / 12 months</span>
                      </div>
                      <div className="w-full h-3 rounded-full bg-glass overflow-hidden relative">
                        {/* Month markers */}
                        <div className="absolute inset-0 flex">
                          {Array.from({ length: 12 }).map((_, i) => (
                            <div key={i} className="flex-1 border-r border-surface-50/50 last:border-0" />
                          ))}
                        </div>
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-accent/80 to-emerald-400/80 transition-all duration-700 relative z-10"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No data yet</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AiTripTracker;
