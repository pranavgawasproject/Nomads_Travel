import React, { useState, useMemo } from "react";
import {
  AlertTriangle,
  Shield,
  Calendar,
  Clock,
  Globe,
  Plus,
  ChevronDown,
  X,
  Info,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  MapPin,
} from "lucide-react";

// ── Static Data ──────────────────────────────────────────────────────────────
const countryStays = [
  {
    id: 1,
    country: "Thailand",
    flag: "🇹🇭",
    daysThisYear: 65,
    maxTouristDays: 60,
    hasDNVisa: true,
    dnVisaCost: "$500",
    dnVisaDuration: "6 months",
    stays: [{ arrival: "2025-01-15", departure: "2025-03-20" }],
  },
  {
    id: 2,
    country: "Portugal",
    flag: "🇵🇹",
    daysThisYear: 75,
    maxTouristDays: 90,
    hasDNVisa: true,
    dnVisaCost: "€180",
    dnVisaDuration: "1 year",
    stays: [{ arrival: "2025-04-01", departure: "2025-06-14" }],
  },
  {
    id: 3,
    country: "Indonesia",
    flag: "🇮🇩",
    daysThisYear: 30,
    maxTouristDays: 30,
    hasDNVisa: true,
    dnVisaCost: "$300",
    dnVisaDuration: "6 months",
    stays: [{ arrival: "2025-07-01", departure: "2025-07-30" }],
  },
  {
    id: 4,
    country: "Germany",
    flag: "🇩🇪",
    daysThisYear: 110,
    maxTouristDays: 90,
    hasDNVisa: true,
    dnVisaCost: "€100",
    dnVisaDuration: "1-3 years",
    stays: [{ arrival: "2025-08-01", departure: "2025-11-18" }],
  },
  {
    id: 5,
    country: "Colombia",
    flag: "🇨🇴",
    daysThisYear: 0,
    maxTouristDays: 90,
    hasDNVisa: true,
    dnVisaCost: "$170",
    dnVisaDuration: "2 years",
    stays: [],
  },
];

const visaInfo = [
  { country: "Thailand", flag: "🇹🇭", touristDays: 60, dnVisa: true, dnCost: "$500", dnDuration: "6 months" },
  { country: "Portugal", flag: "🇵🇹", touristDays: 90, dnVisa: true, dnCost: "€180", dnDuration: "1 year" },
  { country: "Indonesia", flag: "🇮🇩", touristDays: 30, dnVisa: true, dnCost: "$300", dnDuration: "6 months" },
  { country: "Spain", flag: "🇪🇸", touristDays: 90, dnVisa: true, dnCost: "€70", dnDuration: "1 year" },
  { country: "Germany", flag: "🇩🇪", touristDays: 90, dnVisa: true, dnCost: "€100", dnDuration: "1-3 years" },
  { country: "Colombia", flag: "🇨🇴", touristDays: 90, dnVisa: true, dnCost: "$170", dnDuration: "2 years" },
  { country: "Georgia", flag: "🇬🇪", touristDays: 365, dnVisa: false, dnCost: "N/A", dnDuration: "N/A" },
  { country: "Croatia", flag: "🇭🇷", touristDays: 90, dnVisa: true, dnCost: "€80", dnDuration: "1 year" },
  { country: "Estonia", flag: "🇪🇪", touristDays: 90, dnVisa: true, dnCost: "€100", dnDuration: "1 year" },
  { country: "UAE", flag: "🇦🇪", touristDays: 30, dnVisa: true, dnCost: "$287", dnDuration: "1 year" },
  { country: "Mexico", flag: "🇲🇽", touristDays: 180, dnVisa: false, dnCost: "N/A", dnDuration: "N/A" },
  { country: "Brazil", flag: "🇧🇷", touristDays: 90, dnVisa: true, dnCost: "R$168", dnDuration: "1 year" },
];

const TAX_THRESHOLD = 183;
const HOME_COUNTRY_DAYS = 85;
const TOTAL_YEAR_DAYS = 365;

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const COUNTRY_COLORS = {
  Thailand: "#f59e0b",
  Portugal: "#06b6d4",
  Indonesia: "#ef4444",
  Germany: "#8b5cf6",
  Colombia: "#22c55e",
  "Home Country": "#64748b",
};

const tips = [
  {
    icon: AlertCircle,
    title: "183-Day Rule",
    text: "Most countries consider you a tax resident if you spend 183+ days there in a calendar year. This is the most common threshold worldwide.",
  },
  {
    icon: Clock,
    title: "Rolling 12-Month Period",
    text: "Keep track of both calendar year AND rolling 12-month periods. Some countries use a rolling window to determine tax residency.",
  },
  {
    icon: FileText,
    title: "Double Taxation Treaties",
    text: "Check if your home country has a Double Taxation Treaty (DTT) with countries you visit. These can protect you from being taxed twice.",
  },
  {
    icon: Globe,
    title: "Center of Vital Interests",
    text: "Even under 183 days, you may be considered a tax resident if your 'center of vital interests' (family, economic ties) is in that country.",
  },
  {
    icon: Shield,
    title: "Document Everything",
    text: "Keep boarding passes, accommodation receipts, and travel records. You may need to prove your travel history to tax authorities.",
  },
  {
    icon: MapPin,
    title: "Visa Overstays",
    text: "Overstaying your tourist visa can result in fines, deportation, or bans. Always track your allowed days and plan exits accordingly.",
  },
];

// ── Helper Functions ──────────────────────────────────────────────────────────
function getRiskLevel(days) {
  if (days >= 163) return { level: "Critical", color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30" };
  if (days >= 121) return { level: "Warning", color: "text-yellow-400", bg: "bg-yellow-500/15", border: "border-yellow-500/30" };
  return { level: "Safe", color: "text-emerald-400", bg: "bg-emerald-500/15", border: "border-emerald-500/30" };
}

function getProgressColor(days) {
  if (days >= 163) return "from-red-500 to-red-600";
  if (days >= 121) return "from-yellow-500 to-amber-600";
  return "from-emerald-500 to-teal-500";
}

function getProgressBg(days) {
  if (days >= 163) return "bg-red-500/20";
  if (days >= 121) return "bg-yellow-500/20";
  return "bg-emerald-500/20";
}

function calcDaysBetween(arrival, departure) {
  const a = new Date(arrival);
  const d = new Date(departure);
  const diff = Math.ceil((d - a) / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(0, diff);
}

// ── Calendar Heatmap Data ─────────────────────────────────────────────────────
function generateCalendarData() {
  const calendarData = {};
  MONTHS.forEach((_, idx) => {
    calendarData[idx] = [];
  });

  countryStays.forEach((cs) => {
    cs.stays.forEach((stay) => {
      const arrival = new Date(stay.arrival);
      const departure = new Date(stay.departure);
      const startMonth = arrival.getMonth();
      const endMonth = departure.getMonth();

      for (let m = startMonth; m <= endMonth; m++) {
        if (!calendarData[m].some((c) => c.country === cs.country)) {
          calendarData[m].push({ country: cs.country, flag: cs.flag });
        }
      }
    });
  });

  return calendarData;
}

// ── Sub-Components ────────────────────────────────────────────────────────────

function CriticalAlertBanner({ alerts }) {
  if (!alerts.length) return null;

  return (
    <div className="mb-8">
      {alerts.map((alert, idx) => (
        <div
          key={idx}
          className="glass-card mb-3 p-4 border-red-500/40 animate-pulse-slow relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-orange-500/5 to-transparent" />
          <div className="relative flex items-start gap-3">
            <div className="mt-0.5 flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-red-400">
                  {alert.type === "tax" ? "Tax Residency Risk" : "Visa Overstay Risk"}
                </span>
                <span className="px-2 py-0.5 text-xs font-bold bg-red-500/20 text-red-300 rounded-full border border-red-500/30">
                  CRITICAL
                </span>
              </div>
              <p className="text-sm text-gray-300">
                {alert.flag} <span className="text-white font-medium">{alert.country}</span>{" "}
                — {alert.message}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CountryDayCard({ data }) {
  const risk = getRiskLevel(data.daysThisYear);
  const daysRemaining = TAX_THRESHOLD - data.daysThisYear;
  const progressPct = Math.min((data.daysThisYear / TAX_THRESHOLD) * 100, 100);
  const touristPct = Math.min((data.daysThisYear / data.maxTouristDays) * 100, 100);
  const isOverTourist = data.daysThisYear > data.maxTouristDays;

  return (
    <div className="glass-card-hover p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{data.flag}</span>
          <div>
            <h3 className="text-white font-semibold text-base">{data.country}</h3>
            <p className="text-xs text-gray-500">
              Tourist visa: {data.maxTouristDays} days
            </p>
          </div>
        </div>
        <span
          className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${risk.bg} ${risk.color} ${risk.border}`}
        >
          {risk.level}
        </span>
      </div>

      {/* Day Counter */}
      <div className="flex items-baseline gap-1.5">
        <span className="text-4xl font-bold text-white font-mono">
          {data.daysThisYear}
        </span>
        <span className="text-sm text-gray-500">/ {TAX_THRESHOLD} days</span>
      </div>

      {/* Tax Threshold Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500">Tax residency threshold</span>
          <span className="text-xs text-gray-400 font-mono">
            {data.daysThisYear > 0
              ? daysRemaining > 0
                ? `${daysRemaining} days left`
                : "Threshold reached!"
              : "No stays recorded"}
          </span>
        </div>
        <div className={`w-full h-2.5 rounded-full ${getProgressBg(data.daysThisYear)}`}>
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(data.daysThisYear)} transition-all duration-700`}
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Tourist Visa Progress */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs text-gray-500">Tourist visa usage</span>
          {isOverTourist ? (
            <span className="text-xs text-red-400 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Overstay!
            </span>
          ) : (
            <span className="text-xs text-gray-400 font-mono">
              {data.maxTouristDays - data.daysThisYear > 0
                ? `${data.maxTouristDays - data.daysThisYear} days left`
                : "Limit reached"}
            </span>
          )}
        </div>
        <div className="w-full h-2 rounded-full bg-white/5">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              isOverTourist
                ? "bg-gradient-to-r from-red-500 to-red-600"
                : "bg-gradient-to-r from-accent/60 to-accent"
            }`}
            style={{ width: `${touristPct}%` }}
          />
        </div>
      </div>

      {/* Stay Records */}
      {data.stays.length > 0 && (
        <div className="space-y-2 pt-1">
          <p className="text-xs text-gray-500 font-medium">Stay records</p>
          {data.stays.map((stay, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-xs text-gray-400 bg-white/[0.02] rounded-lg px-3 py-2"
            >
              <Calendar className="w-3 h-3 text-accent/60" />
              <span>
                {stay.arrival} → {stay.departure}
              </span>
              <span className="ml-auto text-gray-500 font-mono">
                {calcDaysBetween(stay.arrival, stay.departure)}d
              </span>
            </div>
          ))}
        </div>
      )}

      {/* DN Visa Note */}
      {data.hasDNVisa && isOverTourist && (
        <div className="flex items-center gap-2 text-xs text-accent/80 bg-accent/5 rounded-lg px-3 py-2 border border-accent/10">
          <Info className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            Digital nomad visa available ({data.dnVisaCost}, {data.dnVisaDuration})
          </span>
        </div>
      )}
    </div>
  );
}

function AddStayModal({ isOpen, onClose, onAdd, countries }) {
  const [form, setForm] = useState({
    country: "",
    arrival: "",
    departure: "",
  });
  const [error, setError] = useState("");

  const calculatedDays = useMemo(() => {
    if (!form.arrival || !form.departure) return 0;
    return calcDaysBetween(form.arrival, form.departure);
  }, [form.arrival, form.departure]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.country) {
      setError("Please select a country");
      return;
    }
    if (!form.arrival || !form.departure) {
      setError("Please fill in both dates");
      return;
    }
    if (new Date(form.arrival) > new Date(form.departure)) {
      setError("Departure must be after arrival");
      return;
    }
    if (calculatedDays <= 0) {
      setError("Invalid date range");
      return;
    }

    onAdd({
      country: form.country,
      arrival: form.arrival,
      departure: form.departure,
      days: calculatedDays,
    });

    setForm({ country: "", arrival: "", departure: "" });
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card w-full max-w-md p-6 shadow-glow-lg animate-slide-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Plus className="w-5 h-5 text-accent" />
            Add Stay Record
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Country */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Country</label>
            <div className="relative">
              <select
                value={form.country}
                onChange={(e) => setForm((f) => ({ ...f, country: e.target.value }))}
                className="input-dark w-full appearance-none pr-10"
              >
                <option value="" className="bg-surface-50">
                  Select a country
                </option>
                {countries.map((c) => (
                  <option key={c} value={c} className="bg-surface-50">
                    {c}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            </div>
          </div>

          {/* Arrival */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Arrival Date</label>
            <input
              type="date"
              value={form.arrival}
              onChange={(e) => setForm((f) => ({ ...f, arrival: e.target.value }))}
              className="input-dark w-full"
            />
          </div>

          {/* Departure */}
          <div>
            <label className="block text-sm text-gray-400 mb-1.5">Departure Date</label>
            <input
              type="date"
              value={form.departure}
              onChange={(e) => setForm((f) => ({ ...f, departure: e.target.value }))}
              className="input-dark w-full"
            />
          </div>

          {/* Calculated Days */}
          {calculatedDays > 0 && (
            <div className="glass-card p-3 flex items-center gap-3 border-accent/20">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm text-gray-300">
                Duration:{" "}
                <span className="text-white font-semibold font-mono">
                  {calculatedDays}
                </span>{" "}
                day{calculatedDays !== 1 ? "s" : ""}
              </span>
            </div>
          )}

          {error && (
            <p className="text-sm text-red-400 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5" /> {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-ghost flex-1">
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Add Stay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function YearSummary({ stays }) {
  const totalDaysAbroad = stays.reduce((sum, s) => sum + s.daysThisYear, 0);
  const countriesVisited = stays.filter((s) => s.daysThisYear > 0).length;
  const daysInHome = TOTAL_YEAR_DAYS - totalDaysAbroad;
  const isTaxResidentAnywhere = stays.some((s) => s.daysThisYear >= TAX_THRESHOLD);

  const stats = [
    {
      label: "Days Abroad",
      value: totalDaysAbroad,
      icon: Globe,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Days in Home Country",
      value: Math.max(0, daysInHome),
      icon: MapPin,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Countries Visited",
      value: countriesVisited,
      icon: Calendar,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Tax Residency Risk",
      value: isTaxResidentAnywhere ? "Active" : "Clear",
      icon: isTaxResidentAnywhere ? AlertTriangle : Shield,
      color: isTaxResidentAnywhere ? "text-red-400" : "text-emerald-400",
      bgColor: isTaxResidentAnywhere ? "bg-red-500/10" : "bg-emerald-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card p-4 flex flex-col gap-2">
          <div
            className={`w-9 h-9 rounded-xl ${stat.bgColor} flex items-center justify-center`}
          >
            <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
          </div>
          <p className="text-2xl font-bold text-white font-mono">
            {typeof stat.value === "number" ? stat.value : stat.value}
          </p>
          <p className="text-xs text-gray-500">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}

function CalendarHeatmap({ calendarData }) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-accent" />
        2025 Travel Calendar
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {MONTHS.map((month, idx) => {
          const entries = calendarData[idx] || [];
          return (
            <div
              key={month}
              className={`rounded-xl p-3 border transition-colors ${
                entries.length > 0
                  ? "bg-white/[0.04] border-white/10"
                  : "bg-white/[0.02] border-white/[0.04]"
              }`}
            >
              <p className="text-xs font-medium text-gray-400 mb-2">{month}</p>
              {entries.length > 0 ? (
                <div className="space-y-1">
                  {entries.map((entry, eIdx) => (
                    <div
                      key={eIdx}
                      className="flex items-center gap-1.5 text-xs"
                    >
                      <div
                        className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                        style={{
                          backgroundColor:
                            COUNTRY_COLORS[entry.country] || "#06b6d4",
                        }}
                      />
                      <span className="text-gray-300 truncate">
                        {entry.flag} {entry.country}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-600">—</p>
              )}
            </div>
          );
        })}
      </div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-white/5">
        <span className="text-xs text-gray-500">Legend:</span>
        {Object.entries(COUNTRY_COLORS).map(([country, color]) => (
          <div key={country} className="flex items-center gap-1.5">
            <div
              className="w-2.5 h-2.5 rounded-sm"
              style={{ backgroundColor: color }}
            />
            <span className="text-xs text-gray-400">{country}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function VisaInfoTable() {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-5 border-b border-glass-border">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          Visa Quick Reference
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          Popular digital nomad destinations and their visa requirements
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-glass-border">
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Country</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">Tourist Days</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">DN Visa</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">DN Cost</th>
              <th className="text-left px-5 py-3 text-gray-500 font-medium">DN Duration</th>
            </tr>
          </thead>
          <tbody>
            {visaInfo.map((v) => (
              <tr
                key={v.country}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span>{v.flag}</span>
                    <span className="text-gray-200">{v.country}</span>
                  </div>
                </td>
                <td className="px-5 py-3">
                  <span className="font-mono text-gray-300">{v.touristDays}</span>
                  <span className="text-gray-600 ml-1">days</span>
                </td>
                <td className="px-5 py-3">
                  {v.dnVisa ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                      <CheckCircle className="w-3 h-3" />
                      Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-red-500/15 text-red-400 border border-red-500/25">
                      <XCircle className="w-3 h-3" />
                      N/A
                    </span>
                  )}
                </td>
                <td className="px-5 py-3 text-gray-300 font-mono">{v.dnCost}</td>
                <td className="px-5 py-3 text-gray-300">{v.dnDuration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TipsSection() {
  return (
    <div className="glass-card p-5">
      <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
        <Info className="w-5 h-5 text-accent" />
        Tax Compliance Tips
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip, idx) => (
          <div
            key={idx}
            className="flex gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
              <tip.icon className="w-4.5 h-4.5 text-accent" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white mb-1">{tip.title}</h4>
              <p className="text-xs text-gray-400 leading-relaxed">{tip.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AiVisaTracker() {
  const [stays, setStays] = useState(countryStays);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const calendarData = useMemo(() => generateCalendarData(), []);

  const countryNames = useMemo(
    () => stays.map((s) => s.country),
    [stays]
  );

  // Compute critical alerts
  const alerts = useMemo(() => {
    const result = [];
    stays.forEach((s) => {
      if (s.daysThisYear >= TAX_THRESHOLD) {
        result.push({
          country: s.country,
          flag: s.flag,
          type: "tax",
          message: `You've spent ${s.daysThisYear} days — exceeding the 183-day tax residency threshold!`,
        });
      } else if (s.daysThisYear >= 163) {
        result.push({
          country: s.country,
          flag: s.flag,
          type: "tax",
          message: `Only ${TAX_THRESHOLD - s.daysThisYear} days left before 183-day tax residency threshold.`,
        });
      }
      if (s.daysThisYear > s.maxTouristDays) {
        result.push({
          country: s.country,
          flag: s.flag,
          type: "visa",
          message: `You've overstayed your ${s.maxTouristDays}-day tourist visa by ${s.daysThisYear - s.maxTouristDays} days.`,
        });
      }
    });
    return result;
  }, [stays]);

  const handleAddStay = ({ country, arrival, departure, days }) => {
    setStays((prev) =>
      prev.map((s) => {
        if (s.country === country) {
          return {
            ...s,
            daysThisYear: s.daysThisYear + days,
            stays: [...s.stays, { arrival, departure }],
          };
        }
        return s;
      })
    );
  };

  return (
    <div className="page-container">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-50 pointer-events-none" />
        <div className="section-container relative py-12 md:py-16">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Visa & Tax Intelligence
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
              Visa & Tax{" "}
              <span className="gradient-text">Tracker</span>
            </h1>
            <p className="text-base md:text-lg text-gray-400 mb-6">
              Stay compliant, avoid tax traps. Track your days in each country
              and get alerts before you hit the 183-day tax residency threshold.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Stay Record
              </button>
              <button className="btn-ghost flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Export Report
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 183-Day Threshold Explainer ──────────────────────────────────── */}
      <section className="section-container mb-8">
        <div className="glass-card p-4 border-accent/20 flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info className="w-4.5 h-4.5 text-accent" />
          </div>
          <div>
            <p className="text-sm text-gray-300">
              <span className="text-white font-semibold">
                The 183-Day Rule:{" "}
              </span>
              Most countries consider you a tax resident if you spend{" "}
              <span className="text-accent font-semibold">183 or more days</span>{" "}
              there in a calendar year. This triggers tax obligations including
              income tax, capital gains tax, and more. Always consult a tax
              professional for advice specific to your situation.
            </p>
          </div>
        </div>
      </section>

      {/* ── Critical Alerts ──────────────────────────────────────────────── */}
      <section className="section-container">
        <CriticalAlertBanner alerts={alerts} />
      </section>

      {/* ── Year Summary ─────────────────────────────────────────────────── */}
      <section className="section-container mb-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-accent" />
          2025 Summary
        </h2>
        <YearSummary stays={stays} />
      </section>

      {/* ── Country Day Cards ────────────────────────────────────────────── */}
      <section className="section-container mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-accent" />
            Country Day Counters
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-ghost text-sm flex items-center gap-1.5 py-2 px-4"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Stay
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {stays.map((cs) => (
            <CountryDayCard key={cs.id} data={cs} />
          ))}
        </div>
      </section>

      {/* ── Calendar Heatmap ─────────────────────────────────────────────── */}
      <section className="section-container mb-8">
        <CalendarHeatmap calendarData={calendarData} />
      </section>

      {/* ── Visa Info Table ──────────────────────────────────────────────── */}
      <section className="section-container mb-8">
        <VisaInfoTable />
      </section>

      {/* ── Tips Section ─────────────────────────────────────────────────── */}
      <section className="section-container mb-12">
        <TipsSection />
      </section>

      {/* ── Add Stay Modal ───────────────────────────────────────────────── */}
      <AddStayModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddStay}
        countries={countryNames}
      />
    </div>
  );
}
