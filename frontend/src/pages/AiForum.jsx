import React, { useState, useMemo } from "react";
import {
  MessageSquare,
  Heart,
  Reply,
  Pin,
  Search,
  Plus,
  Filter,
  ChevronDown,
  Clock,
  User,
  Tag,
  TrendingUp,
  Bookmark,
  Send,
  X,
  MessageCircle,
  ThumbsUp,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════════════════
   CATEGORY DEFINITIONS
   ═══════════════════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  "All",
  "Visas & Immigration",
  "Taxes & Finance",
  "Destinations",
  "Coworking",
  "Tech & Gear",
  "Health & Insurance",
  "Remote Work",
  "Legal",
  "Social",
];

const CATEGORY_COLORS = {
  "Visas & Immigration": { bg: "bg-blue-500/15", text: "text-blue-400", border: "border-blue-500/30" },
  "Taxes & Finance": { bg: "bg-green-500/15", text: "text-green-400", border: "border-green-500/30" },
  "Destinations": { bg: "bg-cyan-500/15", text: "text-cyan-400", border: "border-cyan-500/30" },
  "Coworking": { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/30" },
  "Tech & Gear": { bg: "bg-purple-500/15", text: "text-purple-400", border: "border-purple-500/30" },
  "Health & Insurance": { bg: "bg-red-500/15", text: "text-red-400", border: "border-red-500/30" },
  "Remote Work": { bg: "bg-teal-500/15", text: "text-teal-400", border: "border-teal-500/30" },
  "Legal": { bg: "bg-indigo-500/15", text: "text-indigo-400", border: "border-indigo-500/30" },
  "Social": { bg: "bg-pink-500/15", text: "text-pink-400", border: "border-pink-500/30" },
};

const SORT_OPTIONS = [
  { value: "latest", label: "Latest" },
  { value: "popular", label: "Most Popular" },
  { value: "replies", label: "Most Replies" },
  { value: "unanswered", label: "Unanswered" },
];

/* ═══════════════════════════════════════════════════════════════════════════
   STATIC DATA — 12 posts with replies
   ═══════════════════════════════════════════════════════════════════════════ */
const posts = [
  {
    id: 1,
    title: "Best countries for digital nomad visa in 2025?",
    content:
      "Looking to apply for a digital nomad visa. Which countries have the best programs right now? I am considering Portugal, Estonia, and Croatia. Any experiences with the application process?",
    author: { name: "Sarah Chen", initials: "SC", gradient: "from-cyan-500 to-blue-500" },
    category: "Visas & Immigration",
    replies: 24,
    likes: 45,
    timeAgo: "2h ago",
    pinned: true,
    tags: ["visa", "digital-nomad", "2025"],
    replyList: [
      {
        id: 101,
        content:
          "Portugal D8 visa is great! Took me about 3 months to process. The key is having all your documents apostilled beforehand.",
        author: { name: "Marcus Weber", initials: "MW", gradient: "from-purple-500 to-pink-500" },
        likes: 12,
        timeAgo: "1h ago",
      },
      {
        id: 102,
        content:
          "Estonia e-Residency is not really a visa - it does not give you the right to live there. Look into their digital nomad visa separately.",
        author: { name: "Yuki Tanaka", initials: "YT", gradient: "from-indigo-500 to-cyan-500" },
        likes: 8,
        timeAgo: "45m ago",
      },
    ],
  },
  {
    id: 2,
    title: "How do you handle taxes when living in 3+ countries per year?",
    content:
      "I spent time in 4 countries last year and now I am confused about tax obligations. Do I need to file in each country? How do double taxation treaties work in practice?",
    author: { name: "Alex Rivera", initials: "AR", gradient: "from-teal-500 to-emerald-500" },
    category: "Taxes & Finance",
    replies: 18,
    likes: 38,
    timeAgo: "5h ago",
    pinned: false,
    tags: ["taxes", "compliance", "multiple-countries"],
    replyList: [
      {
        id: 201,
        content:
          "Generally you only pay taxes where you are a tax resident. The 183-day rule is key. Keep detailed records of your days in each country.",
        author: { name: "Nina Kowalski", initials: "NK", gradient: "from-violet-500 to-fuchsia-500" },
        likes: 15,
        timeAgo: "4h ago",
      },
    ],
  },
  {
    id: 3,
    title: "Chiang Mai vs Bangkok for long-term stay?",
    content:
      "Trying to decide between Chiang Mai and Bangkok for a 6-month stay. I work as a developer and need reliable internet. Cost of living is also important. What are the pros and cons?",
    author: { name: "James Okafor", initials: "JO", gradient: "from-sky-500 to-indigo-500" },
    category: "Destinations",
    replies: 31,
    likes: 52,
    timeAgo: "8h ago",
    pinned: false,
    tags: ["thailand", "chiang-mai", "bangkok"],
    replyList: [
      {
        id: 301,
        content:
          "Chiang Mai is cheaper and has a great nomad community in Nimman. Bangkok has better internet and more things to do. I prefer CM for focus and BKK for lifestyle.",
        author: { name: "Sarah Chen", initials: "SC", gradient: "from-cyan-500 to-blue-500" },
        likes: 20,
        timeAgo: "7h ago",
      },
    ],
  },
  {
    id: 4,
    title: "Recommendations for portable monitors for travel?",
    content:
      "I need a second monitor for coding on the go. Has anyone used the ASUS ZenScreen or Lenovo ThinkVision? Looking for something lightweight that fits in a backpack.",
    author: { name: "Yuki Tanaka", initials: "YT", gradient: "from-indigo-500 to-cyan-500" },
    category: "Tech & Gear",
    replies: 15,
    likes: 22,
    timeAgo: "12h ago",
    pinned: false,
    tags: ["gear", "monitors", "remote-work"],
    replyList: [],
  },
  {
    id: 5,
    title: "Travel health insurance that actually covers nomads?",
    content:
      "Most travel insurance policies require you to have a home base. What insurance actually works for full-time nomads who do not have a permanent address?",
    author: { name: "Aisha Patel", initials: "AP", gradient: "from-amber-500 to-red-500" },
    category: "Health & Insurance",
    replies: 27,
    likes: 61,
    timeAgo: "1d ago",
    pinned: true,
    tags: ["insurance", "health", "nomad-life"],
    replyList: [
      {
        id: 501,
        content:
          "SafetyWing is designed specifically for nomads. I have been using them for 2 years. About $45/month with decent coverage.",
        author: { name: "Diego Santos", initials: "DS", gradient: "from-green-500 to-teal-500" },
        likes: 25,
        timeAgo: "22h ago",
      },
    ],
  },
  {
    id: 6,
    title: "Best coworking spaces in Lisbon under \u20ac200/month?",
    content:
      "Moving to Lisbon next month and looking for affordable coworking options. Prefer areas with good natural light and a community vibe.",
    author: { name: "Sofia Morales", initials: "SM", gradient: "from-pink-500 to-rose-500" },
    category: "Coworking",
    replies: 9,
    likes: 14,
    timeAgo: "1d ago",
    pinned: false,
    tags: ["lisbon", "coworking", "budget"],
    replyList: [],
  },
  {
    id: 7,
    title: "How to convince your employer to go fully remote?",
    content:
      "I want to transition from hybrid to fully remote so I can travel while working. Has anyone successfully negotiated this? What arguments worked?",
    author: { name: "Emma Lindqvist", initials: "EL", gradient: "from-rose-500 to-orange-500" },
    category: "Remote Work",
    replies: 33,
    likes: 71,
    timeAgo: "2d ago",
    pinned: false,
    tags: ["remote-work", "negotiation", "career"],
    replyList: [
      {
        id: 701,
        content:
          "Build trust first by being hyper-productive while hybrid. Then propose a 3-month trial period with clear KPIs. That is how I got mine approved.",
        author: { name: "Alex Rivera", initials: "AR", gradient: "from-teal-500 to-emerald-500" },
        likes: 18,
        timeAgo: "1d ago",
      },
    ],
  },
  {
    id: 8,
    title: "Setting up a US LLC as a non-resident nomad",
    content:
      "Has anyone set up a Wyoming or Delaware LLC while living abroad? Looking for the simplest process for invoicing international clients.",
    author: { name: "Tom Bakker", initials: "TB", gradient: "from-blue-500 to-violet-500" },
    category: "Legal",
    replies: 19,
    likes: 34,
    timeAgo: "2d ago",
    pinned: false,
    tags: ["LLC", "us-business", "legal"],
    replyList: [],
  },
  {
    id: 9,
    title: "Bali in rainy season - is it worth it?",
    content:
      "Thinking about spending November-February in Bali but worried about the rainy season. Anyone have experience? Does it rain all day or just brief showers?",
    author: { name: "Priya Sharma", initials: "PS", gradient: "from-yellow-500 to-red-500" },
    category: "Destinations",
    replies: 11,
    likes: 19,
    timeAgo: "3d ago",
    pinned: false,
    tags: ["bali", "weather", "rainy-season"],
    replyList: [],
  },
  {
    id: 10,
    title: "Anyone else struggle with loneliness on the road?",
    content:
      "I have been nomading for 6 months and while I love the freedom, I sometimes feel really isolated. How do you build meaningful connections while constantly moving?",
    author: { name: "Liam Foster", initials: "LF", gradient: "from-orange-500 to-amber-500" },
    category: "Social",
    replies: 42,
    likes: 89,
    timeAgo: "3d ago",
    pinned: false,
    tags: ["mental-health", "loneliness", "community"],
    replyList: [
      {
        id: 1001,
        content:
          "Join local coworking communities and attend events. I found that staying 2-3 months in one place instead of constantly moving helps build deeper friendships.",
        author: { name: "Aisha Patel", initials: "AP", gradient: "from-amber-500 to-red-500" },
        likes: 32,
        timeAgo: "3d ago",
      },
    ],
  },
  {
    id: 11,
    title: "Starlink mini review - works for nomads?",
    content:
      "Thinking about getting Starlink Mini for areas with unreliable WiFi. Has anyone used it while traveling? How is the portability and performance?",
    author: { name: "Oliver Schmidt", initials: "OS", gradient: "from-emerald-500 to-cyan-500" },
    category: "Tech & Gear",
    replies: 7,
    likes: 16,
    timeAgo: "4d ago",
    pinned: false,
    tags: ["starlink", "internet", "gear"],
    replyList: [],
  },
  {
    id: 12,
    title: "Best bank accounts for digital nomads in 2025",
    content:
      "Looking for bank accounts with no foreign transaction fees, good exchange rates, and easy international transfers. Wise vs Revolut vs others?",
    author: { name: "Diego Santos", initials: "DS", gradient: "from-green-500 to-teal-500" },
    category: "Taxes & Finance",
    replies: 28,
    likes: 53,
    timeAgo: "5d ago",
    pinned: false,
    tags: ["banking", "finance", "wise", "revolut"],
    replyList: [],
  },
];

/* ── Sidebar data ── */
const trendingTopics = [
  { title: "Digital Nomad Visa Updates 2025", posts: 156, trend: "+24 this week" },
  { title: "Best Budget Destinations", posts: 89, trend: "+12 this week" },
  { title: "Tax Obligations for Nomads", posts: 67, trend: "+8 this week" },
  { title: "Coworking vs. Cafes", posts: 54, trend: "+5 this week" },
  { title: "Loneliness & Mental Health", posts: 43, trend: "+15 this week" },
];

const topContributors = [
  { name: "Sarah Chen", initials: "SC", gradient: "from-cyan-500 to-blue-500", posts: 127 },
  { name: "Alex Rivera", initials: "AR", gradient: "from-teal-500 to-emerald-500", posts: 98 },
  { name: "Diego Santos", initials: "DS", gradient: "from-green-500 to-teal-500", posts: 84 },
  { name: "Aisha Patel", initials: "AP", gradient: "from-amber-500 to-red-500", posts: 71 },
  { name: "Marcus Weber", initials: "MW", gradient: "from-purple-500 to-pink-500", posts: 63 },
];

const forumStats = [
  { label: "Total Posts", value: "12,847", icon: MessageSquare },
  { label: "Total Members", value: "8,234", icon: User },
  { label: "Online Now", value: "342", icon: Clock },
];

/* ═══════════════════════════════════════════════════════════════════════════
   HELPER COMPONENTS
   ═══════════════════════════════════════════════════════════════════════════ */

const Avatar = ({ initials, gradient, size = "w-9 h-9" }) => (
  <div
    className={`${size} rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold text-xs shrink-0`}
  >
    {initials}
  </div>
);

const CategoryBadge = ({ category }) => {
  const colors = CATEGORY_COLORS[category];
  if (!colors) return null;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${colors.bg} ${colors.text} border ${colors.border}`}
    >
      {category}
    </span>
  );
};

const TagPill = ({ tag }) => (
  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium bg-white/5 text-gray-400 border border-white/5">
    #{tag}
  </span>
);

/* ═══════════════════════════════════════════════════════════════════════════
   REPLY CARD
   ═══════════════════════════════════════════════════════════════════════════ */
const ReplyCard = ({ reply, onLike }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(reply.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    onLike?.(reply.id);
  };

  return (
    <div className="flex gap-3 group">
      <Avatar initials={reply.author.initials} gradient={reply.author.gradient} size="w-8 h-8" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-200">{reply.author.name}</span>
          <span className="text-[11px] text-gray-500">{reply.timeAgo}</span>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">{reply.content}</p>
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 text-xs transition-colors duration-200 ${
              liked ? "text-red-400" : "text-gray-500 hover:text-red-400"
            }`}
          >
            <Heart className="w-3.5 h-3.5" fill={liked ? "currentColor" : "none"} />
            <span>{likeCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   POST CARD
   ═══════════════════════════════════════════════════════════════════════════ */
const PostCard = ({ post, isExpanded, onToggle, onLike, onBookmark }) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [bookmarked, setBookmarked] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [localReplies, setLocalReplies] = useState(post.replyList);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    onLike?.(post.id);
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    onBookmark?.(post.id);
  };

  const handleSubmitReply = (e) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    const newReply = {
      id: Date.now(),
      content: replyText,
      author: { name: "You", initials: "YO", gradient: "from-cyan-500 to-teal-500" },
      likes: 0,
      timeAgo: "Just now",
    };
    setLocalReplies([...localReplies, newReply]);
    setReplyText("");
  };

  return (
    <div
      className={`glass-card transition-all duration-300 ${
        post.pinned ? "border-l-2 border-l-accent" : ""
      } ${isExpanded ? "ring-1 ring-accent/20" : "hover:bg-glass-hover hover:border-accent/30"}`}
    >
      {/* Post header / collapsed view */}
      <div className="p-5 cursor-pointer" onClick={onToggle}>
        <div className="flex items-start gap-3">
          <Avatar initials={post.author.initials} gradient={post.author.gradient} />

          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {post.pinned && (
                <span className="inline-flex items-center gap-1 text-accent text-xs font-medium">
                  <Pin className="w-3 h-3" />
                  Pinned
                </span>
              )}
              <h3
                className={`font-semibold ${
                  isExpanded ? "text-white text-lg" : "text-gray-100 text-base"
                } leading-snug`}
              >
                {post.title}
              </h3>
            </div>

            {/* Content preview */}
            <p className={`text-sm text-gray-400 leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>
              {post.content}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <span className="text-xs text-gray-500">{post.author.name}</span>
              <CategoryBadge category={post.category} />
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <MessageCircle className="w-3.5 h-3.5" />
                {post.replies}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLike();
                }}
                className={`flex items-center gap-1 text-xs transition-colors duration-200 ${
                  liked ? "text-red-400" : "text-gray-500 hover:text-red-400"
                }`}
              >
                <Heart className="w-3.5 h-3.5" fill={liked ? "currentColor" : "none"} />
                {likeCount}
              </button>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {post.timeAgo}
              </span>
            </div>

            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {post.tags.map((tag) => (
                  <TagPill key={tag} tag={tag} />
                ))}
              </div>
            )}
          </div>

          {/* Bookmark button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleBookmark();
            }}
            className={`shrink-0 p-1.5 rounded-lg transition-colors duration-200 ${
              bookmarked ? "text-amber-400" : "text-gray-600 hover:text-amber-400"
            }`}
          >
            <Bookmark className="w-4 h-4" fill={bookmarked ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      {/* Expanded: replies + reply form */}
      {isExpanded && (
        <div className="border-t border-glass-border px-5 pb-5 animate-slide-down">
          {/* Reply thread */}
          {localReplies.length > 0 && (
            <div className="mt-4 space-y-4">
              <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-accent" />
                {localReplies.length} {localReplies.length === 1 ? "Reply" : "Replies"}
              </h4>
              <div className="space-y-4 pl-2 border-l border-glass-border">
                {localReplies.map((reply) => (
                  <ReplyCard key={reply.id} reply={reply} />
                ))}
              </div>
            </div>
          )}

          {localReplies.length === 0 && (
            <div className="mt-4 text-center py-6">
              <MessageSquare className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No replies yet. Be the first to respond!</p>
            </div>
          )}

          {/* Reply input */}
          <form onSubmit={handleSubmitReply} className="mt-4 flex gap-3 items-start">
            <Avatar initials="YO" gradient="from-cyan-500 to-teal-500" size="w-8 h-8" />
            <div className="flex-1 relative">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Write a reply..."
                rows={2}
                className="input-dark w-full resize-none text-sm pr-12"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className="absolute right-2 bottom-2 p-1.5 rounded-lg bg-accent/20 text-accent hover:bg-accent/30 transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   SIDEBAR (Desktop)
   ═══════════════════════════════════════════════════════════════════════════ */
const Sidebar = () => (
  <div className="space-y-6">
    {/* Trending Topics */}
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 h-4 text-accent" />
        Trending Topics
      </h3>
      <div className="space-y-3">
        {trendingTopics.map((topic, i) => (
          <div
            key={i}
            className="flex items-start gap-3 p-2 rounded-lg hover:bg-glass transition-colors duration-200 cursor-pointer group"
          >
            <span className="text-xs font-bold text-accent/60 mt-0.5 w-4">{i + 1}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300 group-hover:text-white transition-colors leading-snug">
                {topic.title}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[11px] text-gray-500">{topic.posts} posts</span>
                <span className="text-[11px] text-emerald-400">{topic.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Top Contributors */}
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2 mb-4">
        <User className="w-4 h-4 text-accent" />
        Top Contributors
      </h3>
      <div className="space-y-3">
        {topContributors.map((c, i) => (
          <div
            key={i}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-glass transition-colors duration-200 cursor-pointer"
          >
            <Avatar initials={c.initials} gradient={c.gradient} size="w-8 h-8" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-300">{c.name}</p>
              <p className="text-[11px] text-gray-500">{c.posts} posts</p>
            </div>
            {i === 0 && (
              <span className="text-[10px] font-medium text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                #1
              </span>
            )}
          </div>
        ))}
      </div>
    </div>

    {/* Forum Stats */}
    <div className="glass-card p-5">
      <h3 className="text-sm font-semibold text-gray-200 flex items-center gap-2 mb-4">
        <ThumbsUp className="w-4 h-4 text-accent" />
        Forum Stats
      </h3>
      <div className="space-y-3">
        {forumStats.map((stat) => (
          <div key={stat.label} className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
              <stat.icon className="w-4 h-4 text-accent" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{stat.value}</p>
              <p className="text-[11px] text-gray-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════════════
   NEW POST FORM
   ═══════════════════════════════════════════════════════════════════════════ */
const NewPostForm = ({ onClose, onPost }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState(CATEGORIES[1]); // skip "All"
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onPost({
      id: Date.now(),
      title,
      content,
      author: { name: "You", initials: "YO", gradient: "from-cyan-500 to-teal-500" },
      category,
      replies: 0,
      likes: 0,
      timeAgo: "Just now",
      pinned: false,
      tags,
      replyList: [],
    });
    onClose();
  };

  return (
    <div className="glass-card p-6 animate-slide-down ring-1 ring-accent/20">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-accent" />
          New Discussion
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-glass transition-colors duration-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What would you like to discuss?"
            className="input-dark w-full text-sm"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Category</label>
          <div className="relative">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-dark w-full text-sm pr-10 appearance-none cursor-pointer"
            >
              {CATEGORIES.filter((c) => c !== "All").map((c) => (
                <option key={c} value={c} className="bg-surface-50 text-gray-200">
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your question or experience..."
            rows={4}
            className="input-dark w-full text-sm resize-none"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-xs font-medium text-gray-400 mb-1.5">
            <Tag className="w-3 h-3 inline mr-1" />
            Tags (press Enter to add)
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-accent/15 text-accent border border-accent/30"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-white transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add a tag..."
            className="input-dark w-full text-sm"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-ghost text-sm px-5 py-2">
            Cancel
          </button>
          <button
            type="submit"
            disabled={!title.trim() || !content.trim()}
            className="btn-primary text-sm px-5 py-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Post Discussion
          </button>
        </div>
      </form>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT — AiForum
   ═══════════════════════════════════════════════════════════════════════════ */
const AiForum = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [showNewPost, setShowNewPost] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [allPosts, setAllPosts] = useState(posts);

  /* ── Filtering & Sorting ── */
  const filteredPosts = useMemo(() => {
    let result = [...allPosts];

    // Category filter
    if (activeCategory !== "All") {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.content.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)) ||
          p.author.name.toLowerCase().includes(q)
      );
    }

    // Sort: pinned first, then by sort option
    const pinned = result.filter((p) => p.pinned);
    const unpinned = result.filter((p) => !p.pinned);

    const sortFn = (a, b) => {
      switch (sortBy) {
        case "popular":
          return b.likes - a.likes;
        case "replies":
          return b.replies - a.replies;
        case "unanswered":
          return a.replies - b.replies;
        case "latest":
        default:
          return 0; // keep original order (already sorted by time)
      }
    };

    unpinned.sort(sortFn);

    return [...pinned, ...unpinned];
  }, [allPosts, activeCategory, searchQuery, sortBy]);

  /* ── Handlers ── */
  const handleTogglePost = (id) => {
    setExpandedPostId(expandedPostId === id ? null : id);
  };

  const handleNewPost = (newPost) => {
    setAllPosts([newPost, ...allPosts]);
  };

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Latest";

  return (
    <div className="page-container">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 bg-gradient-glow opacity-40 pointer-events-none" />

        <div className="section-container relative z-10 py-16 sm:py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
            <MessageSquare className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-accent">Community</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            <span className="gradient-text">Community Forum</span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Ask questions, share experiences, connect with nomads
          </p>
        </div>
      </section>

      {/* ═══════════ MAIN CONTENT ═══════════ */}
      <section className="section-container pb-20">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left: forum list */}
          <div className="flex-1 min-w-0">
            {/* ── Category Pills ── */}
            <div className="mb-5 -mx-4 px-4 overflow-x-auto scrollbar-hide">
              <div className="flex items-center gap-2 pb-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                      activeCategory === cat
                        ? "bg-accent text-surface shadow-glow-sm"
                        : "bg-glass border border-glass-border text-gray-400 hover:text-white hover:border-accent/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Filter Row: Search + Sort + New Post ── */}
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search discussions..."
                  className="input-dark w-full pl-10 text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="btn-ghost flex items-center gap-2 text-sm px-4 py-2.5"
                >
                  <Filter className="w-4 h-4" />
                  {currentSortLabel}
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
                {showSortDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowSortDropdown(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 z-20 glass-card p-1.5 min-w-[180px] animate-slide-down">
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => {
                            setSortBy(opt.value);
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                            sortBy === opt.value
                              ? "bg-accent/15 text-accent"
                              : "text-gray-400 hover:text-white hover:bg-glass"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* New Post Button */}
              <button
                onClick={() => setShowNewPost(!showNewPost)}
                className="btn-primary flex items-center gap-2 text-sm px-4 py-2.5"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">New Post</span>
              </button>
            </div>

            {/* ── New Post Form (expandable) ── */}
            {showNewPost && (
              <NewPostForm
                onClose={() => setShowNewPost(false)}
                onPost={handleNewPost}
              />
            )}

            {/* ── Posts count ── */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {filteredPosts.length} discussion{filteredPosts.length !== 1 ? "s" : ""}
                {activeCategory !== "All" && (
                  <span>
                    {" "}
                    in <span className="text-accent">{activeCategory}</span>
                  </span>
                )}
              </p>
            </div>

            {/* ── Post List ── */}
            <div className="space-y-4">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    isExpanded={expandedPostId === post.id}
                    onToggle={() => handleTogglePost(post.id)}
                  />
                ))
              ) : (
                <div className="glass-card p-12 text-center">
                  <Search className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-300 mb-1">No discussions found</h3>
                  <p className="text-sm text-gray-500">
                    Try adjusting your search or category filter
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Sidebar (desktop) */}
          <div className="hidden lg:block w-[320px] shrink-0">
            <div className="sticky top-24">
              <Sidebar />
            </div>
          </div>
        </div>

        {/* Mobile: sidebar sections below main content */}
        <div className="lg:hidden mt-10">
          <Sidebar />
        </div>
      </section>
    </div>
  );
};

export default AiForum;
