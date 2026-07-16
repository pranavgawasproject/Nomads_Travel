"use client";

import { useEffect, useState, useCallback } from "react";
import { 
  Users2, 
  MapPin, 
  Calendar as CalendarIcon, 
  MessageSquare, 
  Heart, 
  Pin, 
  Plus, 
  Search, 
  User, 
  ArrowLeft, 
  Send,
  MessageCircle,
  Globe,
  Tag,
  Check,
  Github,
  Twitter,
  Linkedin
} from "lucide-react";
import { SiteNav } from "@/components/site/nav";
import { Footer } from "@/components/site/footer";
import { supabase, type Meetup, type ForumPost } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";

export type ForumReply = {
  id: string;
  post_id: string;
  user_name: string;
  user_role: string;
  content: string;
  created_at: string;
};

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState<"meetups" | "forum">("meetups");
  
  // Data States
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);

  // User Session State (Stored in LocalStorage)
  const [username, setUsername] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nomad_username") || "";
    }
    return "";
  });
  const [userRole, setUserRole] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nomad_role") || "Digital Nomad";
    }
    return "Digital Nomad";
  });
  const [userTwitter, setUserTwitter] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nomad_twitter") || "";
    }
    return "";
  });
  const [userGithub, setUserGithub] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nomad_github") || "";
    }
    return "";
  });
  const [userLinkedin, setUserLinkedin] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nomad_linkedin") || "";
    }
    return "";
  });
  const [userTimeline, setUserTimeline] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nomad_timeline") || "";
    }
    return "";
  });
  const [userPortfolio, setUserPortfolio] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nomad_portfolio") || "";
    }
    return "";
  });
  const [userSkills, setUserSkills] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("nomad_skills") || "";
    }
    return "";
  });
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<{type: string; targetId: string} | null>(null);

  // User Interaction States
  const [myRSVPs, setMyRSVPs] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nomad_rsvps");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [myLikes, setMyLikes] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("nomad_likes");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  
  // UI Modals / Expanded Views
  const [activeThread, setActiveThread] = useState<ForumPost | null>(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showNewMeetupModal, setShowNewMeetupModal] = useState(false);

  // Form States
  const [newPost, setNewPost] = useState({ title: "", content: "", category: "General", tags: "" });
  const [newMeetup, setNewMeetup] = useState({ title: "", type: "Networking Event", date: "", time: "", city: "", location: "", max_attendees: "20", icon: "🤝" });
  const [replyText, setReplyText] = useState("");
  const [postSearch, setPostSearch] = useState("");
  const [postCategory, setPostCategory] = useState("All");

  // Fetch from Supabase + merge local custom additions
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [{ data: dbMeetups }, { data: dbPosts }] = await Promise.all([
        supabase.from("meetups").select("*").order("date").limit(20),
        supabase
          .from("forum_posts")
          .select("*")
          .order("pinned", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(30),
      ]);

      const formattedMeetups = (dbMeetups ?? []) as Meetup[];
      const formattedPosts = (dbPosts ?? []) as ForumPost[];

      // Load custom items created locally
      const localMeetups = JSON.parse(localStorage.getItem("local_meetups") || "[]") as Meetup[];
      const localPosts = JSON.parse(localStorage.getItem("local_posts") || "[]") as ForumPost[];
      const localReplies = JSON.parse(localStorage.getItem("local_replies") || "[]") as ForumReply[];

      // Merge & remove duplicates (prefer DB items unless deleted or local override)
      const mergedMeetups = [...localMeetups, ...formattedMeetups].reduce<Meetup[]>((acc, m) => {
        if (!acc.some(item => item.id === m.id)) acc.push(m);
        return acc;
      }, []);

      const mergedPosts = [...localPosts, ...formattedPosts].reduce<ForumPost[]>((acc, p) => {
        if (!acc.some(item => item.id === p.id)) acc.push(p);
        return acc;
      }, []);

      // If active thread is currently viewed, update its post details
      if (activeThread) {
        const updatedThread = mergedPosts.find(p => p.id === activeThread.id);
        if (updatedThread) setActiveThread(updatedThread);
      }

      setMeetups(mergedMeetups);
      setPosts(mergedPosts);
      setReplies(localReplies);
    } catch (err) {
      console.warn("Failed fetching Supabase data, using offline mocks:", err);
    } finally {
      setLoading(false);
    }
  }, [activeThread]);

  useEffect(() => {
    // Run fetchData asynchronously to prevent synchronous setState during effect execution
    const initFetch = async () => {
      await Promise.resolve();
      fetchData();
    };
    initFetch();
  }, [fetchData]);

  // Profile saver helper
  const handleSaveProfile = (
    name: string, 
    role: string, 
    twitter: string, 
    github: string, 
    linkedin: string, 
    timeline: string,
    portfolio: string,
    skills: string
  ) => {
    if (!name.trim()) return;
    localStorage.setItem("nomad_username", name);
    localStorage.setItem("nomad_role", role);
    localStorage.setItem("nomad_twitter", twitter);
    localStorage.setItem("nomad_github", github);
    localStorage.setItem("nomad_linkedin", linkedin);
    localStorage.setItem("nomad_timeline", timeline);
    localStorage.setItem("nomad_portfolio", portfolio);
    localStorage.setItem("nomad_skills", skills);
    setUsername(name);
    setUserRole(role);
    setUserTwitter(twitter);
    setUserGithub(github);
    setUserLinkedin(linkedin);
    setUserTimeline(timeline);
    setUserPortfolio(portfolio);
    setUserSkills(skills);
    setShowProfileModal(false);

    // Resume the action that triggered the login modal
    if (pendingAction) {
      if (pendingAction.type === "rsvp") {
        handleRSVP(pendingAction.targetId);
      } else if (pendingAction.type === "like") {
        handleLike(pendingAction.targetId);
      }
      setPendingAction(null);
    }
  };

  // RSVP Handler
  const handleRSVP = async (meetupId: string) => {
    if (!username) {
      setPendingAction({ type: "rsvp", targetId: meetupId });
      setShowProfileModal(true);
      return;
    }

    const hasRSVP = myRSVPs.includes(meetupId);
    let updatedRSVPs;
    if (hasRSVP) {
      updatedRSVPs = myRSVPs.filter(id => id !== meetupId);
    } else {
      updatedRSVPs = [...myRSVPs, meetupId];
    }
    setMyRSVPs(updatedRSVPs);
    localStorage.setItem("nomad_rsvps", JSON.stringify(updatedRSVPs));

    // Update locally stored meetups
    const updatedMeetups = meetups.map(m => {
      if (m.id === meetupId) {
        const diff = hasRSVP ? -1 : 1;
        return { ...m, attendees: Math.max(0, m.attendees + diff) };
      }
      return m;
    });
    setMeetups(updatedMeetups);

    // Save to local storage overrides
    const localMeetups = JSON.parse(localStorage.getItem("local_meetups") || "[]") as Meetup[];
    const targetMeetup = updatedMeetups.find(m => m.id === meetupId);
    if (targetMeetup) {
      const filteredLocal = localMeetups.filter(m => m.id !== meetupId);
      localStorage.setItem("local_meetups", JSON.stringify([...filteredLocal, targetMeetup]));
    }

    // Attempt to write to Supabase (fails gracefully if restricted)
    try {
      const meetup = meetups.find(m => m.id === meetupId);
      if (meetup) {
        const diff = hasRSVP ? -1 : 1;
        await supabase
          .from("meetups")
          .update({ attendees: Math.max(0, meetup.attendees + diff) })
          .eq("id", meetupId);
      }
    } catch (_) {}
  };

  // Like Handler
  const handleLike = async (postId: string) => {
    if (!username) {
      setPendingAction({ type: "like", targetId: postId });
      setShowProfileModal(true);
      return;
    }

    const hasLiked = myLikes.includes(postId);
    let updatedLikes;
    if (hasLiked) {
      updatedLikes = myLikes.filter(id => id !== postId);
    } else {
      updatedLikes = [...myLikes, postId];
    }
    setMyLikes(updatedLikes);
    localStorage.setItem("nomad_likes", JSON.stringify(updatedLikes));

    // Update state
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return { ...p, likes: p.likes + (hasLiked ? -1 : 1) };
      }
      return p;
    });
    setPosts(updatedPosts);

    // Save to local storage overrides
    const localPosts = JSON.parse(localStorage.getItem("local_posts") || "[]") as ForumPost[];
    const targetPost = updatedPosts.find(p => p.id === postId);
    if (targetPost) {
      const filteredLocal = localPosts.filter(p => p.id !== postId);
      localStorage.setItem("local_posts", JSON.stringify([...filteredLocal, targetPost]));
    }

    // Try DB update
    try {
      const post = posts.find(p => p.id === postId);
      if (post) {
        await supabase
          .from("forum_posts")
          .update({ likes: post.likes + (hasLiked ? -1 : 1) })
          .eq("id", postId);
      }
    } catch (_) {}
  };

  // Add Comment/Reply Handler
  const handleAddReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setShowProfileModal(true);
      return;
    }
    if (!replyText.trim() || !activeThread) return;

    const newReply: ForumReply = {
      id: `reply-${Date.now()}`,
      post_id: activeThread.id,
      user_name: username,
      user_role: userRole,
      content: replyText.trim(),
      created_at: new Date().toISOString()
    };

    const updatedReplies = [newReply, ...replies];
    setReplies(updatedReplies);
    localStorage.setItem("local_replies", JSON.stringify(updatedReplies));
    setReplyText("");

    // Increment reply count locally
    const updatedPosts = posts.map(p => {
      if (p.id === activeThread.id) {
        return { ...p, reply_count: p.reply_count + 1 };
      }
      return p;
    });
    setPosts(updatedPosts);

    // Save override
    const localPosts = JSON.parse(localStorage.getItem("local_posts") || "[]") as ForumPost[];
    const targetPost = updatedPosts.find(p => p.id === activeThread.id);
    if (targetPost) {
      const filteredLocal = localPosts.filter(p => p.id !== activeThread.id);
      localStorage.setItem("local_posts", JSON.stringify([...filteredLocal, targetPost]));
      setActiveThread(targetPost);
    }

    // Try DB write
    try {
      await supabase.from("forum_replies").insert({
        post_id: activeThread.id,
        content: newReply.content
      });
      await supabase
        .from("forum_posts")
        .update({ reply_count: activeThread.reply_count + 1 })
        .eq("id", activeThread.id);
    } catch (_) {}
  };

  // Add Post Handler
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setShowProfileModal(true);
      return;
    }
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const tagsArray = newPost.tags
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const postToCreate: ForumPost = {
      id: `post-${Date.now()}`,
      title: newPost.title.trim(),
      content: newPost.content.trim(),
      category: newPost.category,
      tags: tagsArray.length > 0 ? tagsArray : null,
      pinned: false,
      likes: 0,
      reply_count: 0,
      created_at: new Date().toISOString()
    };

    const updatedPosts = [postToCreate, ...posts];
    setPosts(updatedPosts);

    const localPosts = JSON.parse(localStorage.getItem("local_posts") || "[]") as ForumPost[];
    localStorage.setItem("local_posts", JSON.stringify([postToCreate, ...localPosts]));

    setNewPost({ title: "", content: "", category: "General", tags: "" });
    setShowNewPostModal(false);

    try {
      await supabase.from("forum_posts").insert({
        title: postToCreate.title,
        content: postToCreate.content,
        category: postToCreate.category,
        tags: postToCreate.tags
      });
    } catch (_) {}
  };

  // Add Meetup Handler
  const handleCreateMeetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username) {
      setShowProfileModal(true);
      return;
    }
    if (!newMeetup.title.trim() || !newMeetup.city.trim() || !newMeetup.location.trim() || !newMeetup.date) return;

    // Formatting date
    const dateObj = new Date(newMeetup.date);
    const dateFormatted = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    // Formatting time (12-hour)
    const [hours, minutes] = newMeetup.time.split(":");
    let timeFormatted = "";
    if (hours && minutes) {
      const hrs = parseInt(hours);
      const ampm = hrs >= 12 ? "PM" : "AM";
      const displayHrs = hrs % 12 || 12;
      timeFormatted = `${displayHrs}:${minutes} ${ampm}`;
    }

    const meetupToCreate: Meetup = {
      id: `meetup-${Date.now()}`,
      title: newMeetup.title.trim(),
      type: newMeetup.type,
      date: dateFormatted,
      time: timeFormatted || newMeetup.time,
      city: newMeetup.city.trim(),
      location: newMeetup.location.trim(),
      attendees: 1, // Author attends by default
      max_attendees: parseInt(newMeetup.max_attendees) || 20,
      icon: newMeetup.icon
    };

    const updatedMeetups = [meetupToCreate, ...meetups];
    setMeetups(updatedMeetups);

    // Save meetup in user's RSVPs automatically
    const updatedRSVPs = [...myRSVPs, meetupToCreate.id];
    setMyRSVPs(updatedRSVPs);
    localStorage.setItem("nomad_rsvps", JSON.stringify(updatedRSVPs));

    const localMeetups = JSON.parse(localStorage.getItem("local_meetups") || "[]") as Meetup[];
    localStorage.setItem("local_meetups", JSON.stringify([meetupToCreate, ...localMeetups]));

    setNewMeetup({ title: "", type: "Networking Event", date: "", time: "", city: "", location: "", max_attendees: "20", icon: "🤝" });
    setShowNewMeetupModal(false);

    try {
      await supabase.from("meetups").insert({
        title: meetupToCreate.title,
        type: meetupToCreate.type,
        date: meetupToCreate.date,
        time: meetupToCreate.time,
        city: meetupToCreate.city,
        location: meetupToCreate.location,
        attendees: 1,
        max_attendees: meetupToCreate.max_attendees,
        icon: meetupToCreate.icon
      });
    } catch (_) {}
  };

  // Filter posts
  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(postSearch.toLowerCase()) || 
                          p.content.toLowerCase().includes(postSearch.toLowerCase());
    const matchesCategory = postCategory === "All" || p.category === postCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteNav />
      <main className="flex-1 pt-28 sm:pt-32">
        
        {/* Banner Section */}
        <section className="border-b border-border bg-secondary/20 py-14 sm:py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-sm font-medium uppercase tracking-widest text-accent font-serif">
                Nomad community
              </div>
              <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
                Connecting Global Nomads.
              </h1>
              <p className="mt-4 max-w-xl text-md leading-relaxed text-muted-foreground">
                Join live developer sessions, sunset surf meetups, tax workshops, and general discussions.
              </p>
            </div>
            
            {/* Quick Profile Widget */}
            <div className="flex-shrink-0 bg-card border border-border p-5 rounded-2xl flex flex-col gap-3 shadow-sm min-w-[260px]">
              <div className="flex items-center gap-3.5">
                <div className="h-10 w-10 rounded-full bg-accent/15 flex items-center justify-center text-accent">
                  <User size={20} />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Nomad Profile</div>
                  <div className="font-semibold text-sm truncate max-w-[150px]">
                    {username || "Guest Nomad"}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                    {userRole}
                  </div>
                </div>
              </div>
              
              {(userTwitter || userGithub || userLinkedin || userTimeline || userPortfolio || userSkills) && (
                <div className="border-t border-border pt-2.5 space-y-2">
                  {userTimeline && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <MapPin size={12} className="text-accent flex-shrink-0" />
                      <span className="truncate max-w-[220px]" title={userTimeline}>{userTimeline}</span>
                    </div>
                  )}
                  
                  {userPortfolio && (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Globe size={12} className="text-accent flex-shrink-0" />
                      <a href={userPortfolio.startsWith('http') ? userPortfolio : `https://${userPortfolio}`} target="_blank" rel="noopener noreferrer" className="hover:underline text-accent text-[11px] truncate max-w-[200px]" title={userPortfolio}>
                        Portfolio Website
                      </a>
                    </div>
                  )}

                  {userSkills && (
                    <div className="flex flex-wrap gap-1 pt-0.5">
                      {userSkills.split(',').map((skill, index) => {
                        const cleanSkill = skill.trim();
                        if (!cleanSkill) return null;
                        return (
                          <span key={index} className="bg-accent/15 text-accent text-[9px] font-semibold px-2 py-0.5 rounded-full whitespace-nowrap">
                            {cleanSkill}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {userGithub && (
                      <a href={`https://github.com/${userGithub.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-1 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors" title="GitHub">
                        <Github size={12} />
                      </a>
                    )}
                    {userTwitter && (
                      <a href={`https://twitter.com/${userTwitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="p-1 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors" title="Twitter / X">
                        <Twitter size={12} />
                      </a>
                    )}
                    {userLinkedin && (
                      <a href={`https://linkedin.com/in/${userLinkedin}`} target="_blank" rel="noopener noreferrer" className="p-1 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground transition-colors" title="LinkedIn">
                        <Linkedin size={12} />
                      </a>
                    )}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowProfileModal(true)}
                className="text-xs text-accent font-medium hover:underline text-left block mt-1"
              >
                {username ? "Edit profile settings" : "Setup profile"}
              </button>
            </div>
          </div>
        </section>

        {/* Tab Selection */}
        <div className="border-b border-border bg-card/20 sticky top-[76px] z-20 backdrop-blur-md">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 flex justify-between items-center h-14">
            <div className="flex gap-6 h-full">
              <button
                onClick={() => { setActiveTab("meetups"); setActiveThread(null); }}
                className={`relative flex items-center gap-2 px-1 text-sm font-semibold tracking-wide transition-colors ${activeTab === "meetups" ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
              >
                <Users2 size={16} />
                Meetups
                {activeTab === "meetups" && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />
                )}
              </button>
              <button
                onClick={() => setActiveTab("forum")}
                className={`relative flex items-center gap-2 px-1 text-sm font-semibold tracking-wide transition-colors ${activeTab === "forum" ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
              >
                <MessageSquare size={16} />
                Forum Discussions
                {activeTab === "forum" && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-accent" />
                )}
              </button>
            </div>

            {/* CTA action buttons */}
            <div>
              {activeTab === "meetups" ? (
                <button
                  onClick={() => setShowNewMeetupModal(true)}
                  className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-white font-medium text-xs px-3.5 py-1.5 rounded-full transition-all shadow-sm"
                >
                  <Plus size={14} />
                  Host Meetup
                </button>
              ) : !activeThread ? (
                <button
                  onClick={() => setShowNewPostModal(true)}
                  className="inline-flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-white font-medium text-xs px-3.5 py-1.5 rounded-full transition-all shadow-sm"
                >
                  <Plus size={14} />
                  New Topic
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {/* Dynamic Content Body */}
        <section className="py-10 min-h-[500px]">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <div className="h-7 w-7 border-2 border-accent border-t-transparent rounded-full animate-spin mb-3" />
                <p className="text-sm">Retrieving community board...</p>
              </div>
            ) : activeTab === "meetups" ? (
              
              /* MEETUPS LIST */
              <div>
                {meetups.length === 0 ? (
                  <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border py-20 text-center">
                    <Users2 className="h-8 w-8 text-muted-foreground" />
                    <p className="max-w-md text-sm text-muted-foreground">
                      No meetups scheduled yet. Be the first to host one!
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {meetups.map((m) => {
                      const isRsvped = myRSVPs.includes(m.id);
                      return (
                        <div key={m.id} className="rounded-2xl border border-border bg-card p-5 hover:shadow-md transition-all flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between">
                              <span className="text-2xl h-10 w-10 bg-secondary/50 rounded-xl flex items-center justify-center">{m.icon}</span>
                              <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
                                {m.type}
                              </span>
                            </div>
                            <h3 className="mt-4 font-serif text-lg font-semibold">{m.title}</h3>
                            <div className="mt-3 space-y-1.5">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin size={14} className="text-accent" />
                                <span>{m.city} · {m.location}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarIcon size={14} className="text-accent" />
                                <span>{m.date} at {m.time}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-6 border-t border-border pt-4 flex items-center justify-between">
                            <span className="text-xs text-muted-foreground font-semibold">
                              👥 {m.attendees} / {m.max_attendees} attending
                            </span>
                            <button
                              onClick={() => handleRSVP(m.id)}
                              className={`text-xs px-4 py-1.5 rounded-full font-medium transition-all ${
                                isRsvped 
                                  ? "bg-accent/10 text-accent border border-accent/30 hover:bg-accent/20"
                                  : "bg-secondary text-foreground hover:bg-secondary/80 border border-border"
                              }`}
                            >
                              {isRsvped ? "RSVP'd ✓" : "RSVP"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              
              /* FORUM DISCUSSIONS */
              <div>
                {!activeThread ? (
                  // Posts Main Listing
                  <div>
                    {/* Filters Toolbar */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-between items-stretch">
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <input
                          type="text"
                          placeholder="Search threads..."
                          value={postSearch}
                          onChange={(e) => setPostSearch(e.target.value)}
                          className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-2 text-sm outline-none focus:border-accent"
                        />
                      </div>
                      
                      <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
                        {["All", "General", "Q&A", "Housing", "Visas"].map((cat) => (
                          <button
                            key={cat}
                            onClick={() => setPostCategory(cat)}
                            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
                              postCategory === cat 
                                ? "bg-accent text-white"
                                : "bg-card border border-border text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>

                    {filteredPosts.length === 0 ? (
                      <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-border py-20 text-center">
                        <MessageSquare className="h-8 w-8 text-muted-foreground" />
                        <p className="max-w-md text-sm text-muted-foreground">
                          No conversations matching search or category.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredPosts.map((p) => {
                          const hasLiked = myLikes.includes(p.id);
                          return (
                            <div key={p.id} className="rounded-2xl border border-border bg-card p-5 hover:border-accent/40 transition-all flex flex-col justify-between">
                              <div className="cursor-pointer" onClick={() => setActiveThread(p)}>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    {p.pinned && (
                                      <span className="inline-flex items-center gap-1 text-[10px] bg-accent/15 text-accent px-2 py-0.5 rounded-full font-bold">
                                        <Pin size={10} /> PINNED
                                      </span>
                                    )}
                                    <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
                                      {p.category}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-muted-foreground font-mono">
                                    {new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                  </span>
                                </div>
                                <h3 className="mt-3 font-serif text-lg font-semibold hover:text-accent transition-colors">{p.title}</h3>
                                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground leading-relaxed">
                                  {p.content}
                                </p>
                              </div>

                              <div className="mt-5 border-t border-border pt-3.5 flex items-center gap-6">
                                <button 
                                  onClick={() => handleLike(p.id)}
                                  className={`flex items-center gap-1.5 text-xs transition-colors ${hasLiked ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
                                >
                                  <Heart size={14} className={hasLiked ? "fill-accent" : ""} />
                                  <span>{p.likes} Likes</span>
                                </button>
                                
                                <button 
                                  onClick={() => setActiveThread(p)}
                                  className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                                >
                                  <MessageCircle size={14} />
                                  <span>{p.reply_count} Replies</span>
                                </button>

                                {p.tags && p.tags.length > 0 && (
                                  <div className="hidden sm:flex items-center gap-1.5 ml-auto">
                                    <Tag size={12} className="text-muted-foreground" />
                                    {p.tags.map(t => (
                                      <span key={t} className="text-[10px] text-muted-foreground font-mono bg-secondary px-1.5 py-0.5 rounded">
                                        #{t}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  // Thread Detail View
                  <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
                    <button
                      onClick={() => setActiveThread(null)}
                      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 font-medium"
                    >
                      <ArrowLeft size={14} /> Back to Conversations
                    </button>

                    <div className="border-b border-border pb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="rounded-full bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground/70">
                          {activeThread.category}
                        </span>
                        <span className="text-xs text-muted-foreground font-mono">
                          {new Date(activeThread.created_at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <h2 className="font-serif text-2xl font-semibold tracking-tight">{activeThread.title}</h2>
                      <p className="mt-4 text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                        {activeThread.content}
                      </p>
                      
                      <div className="mt-6 flex items-center gap-4">
                        <button
                          onClick={() => handleLike(activeThread.id)}
                          className={`flex items-center gap-1.5 text-xs ${myLikes.includes(activeThread.id) ? "text-accent" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          <Heart size={14} className={myLikes.includes(activeThread.id) ? "fill-accent" : ""} />
                          <span>{activeThread.likes} Likes</span>
                        </button>
                      </div>
                    </div>

                    {/* Replies list */}
                    <div className="mt-8 space-y-6">
                      <h3 className="font-serif text-md font-semibold mb-4">Replies ({replies.filter(r => r.post_id === activeThread.id).length})</h3>
                      
                      <div className="space-y-4">
                        {replies
                          .filter(r => r.post_id === activeThread.id)
                          .map((reply) => (
                            <div key={reply.id} className="bg-secondary/35 border border-border/70 rounded-xl p-4.5">
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="font-semibold text-xs text-foreground/80">{reply.user_name}</div>
                                  <div className="text-[10px] text-muted-foreground px-2 py-0.5 bg-secondary rounded-full font-medium">{reply.user_role}</div>
                                </div>
                                <span className="text-[9px] text-muted-foreground font-mono">
                                  {new Date(reply.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                </span>
                              </div>
                              <p className="text-xs leading-relaxed text-foreground/80">{reply.content}</p>
                            </div>
                          ))}
                        
                        {replies.filter(r => r.post_id === activeThread.id).length === 0 && (
                          <p className="text-xs text-muted-foreground py-6 text-center italic">No replies on this topic yet. Start the conversation!</p>
                        )}
                      </div>

                      {/* Write reply */}
                      <form onSubmit={handleAddReply} className="mt-8 border-t border-border pt-6">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            placeholder={username ? "Write a reply..." : "Enter your profile name below to reply..."}
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            disabled={!username}
                            className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-2.5 text-xs outline-none focus:border-accent disabled:opacity-60"
                          />
                          <button
                            type="submit"
                            disabled={!username || !replyText.trim()}
                            className="bg-accent text-white p-2.5 rounded-xl hover:bg-accent/90 disabled:opacity-50 flex items-center justify-center"
                          >
                            <Send size={15} />
                          </button>
                        </div>
                        {!username && (
                          <p className="text-[10px] text-muted-foreground mt-2">
                            Please set up a profile name in the widget above to contribute.
                          </p>
                        )}
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

          </div>
        </section>
      </main>

      <Footer />

      {/* ── PROFILE MODAL ── */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl w-full max-w-sm p-6 shadow-xl"
            >
              <h3 className="font-serif text-lg font-semibold mb-1">Set Nomad Identity</h3>
              <p className="text-xs text-muted-foreground mb-4">Choose a display name and role to interact with meetups and forums.</p>
              
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Display Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Alex Green" 
                    defaultValue={username}
                    id="modal-username-input"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-1.5 text-xs outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Nomad Role</label>
                  <select 
                    id="modal-role-select"
                    defaultValue={userRole}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-1.5 text-xs outline-none focus:border-accent"
                  >
                    <option value="Digital Nomad">Digital Nomad</option>
                    <option value="Software Engineer">Software Engineer</option>
                    <option value="Product Designer">Product Designer</option>
                    <option value="Content Creator">Content Creator</option>
                    <option value="Remote Founder">Remote Founder</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">GitHub Username</label>
                  <input 
                    type="text" 
                    placeholder="e.g. alexgreen" 
                    defaultValue={userGithub}
                    id="modal-github-input"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-1.5 text-xs outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Twitter / X Handle</label>
                  <input 
                    type="text" 
                    placeholder="e.g. alexgreen_dev" 
                    defaultValue={userTwitter}
                    id="modal-twitter-input"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-1.5 text-xs outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">LinkedIn Username</label>
                  <input 
                    type="text" 
                    placeholder="e.g. alexgreen-profile" 
                    defaultValue={userLinkedin}
                    id="modal-linkedin-input"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-1.5 text-xs outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Travel Timeline</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Bali -> Bangkok -> Lisbon" 
                    defaultValue={userTimeline}
                    id="modal-timeline-input"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-1.5 text-xs outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Portfolio URL</label>
                  <input 
                    type="text" 
                    placeholder="e.g. https://alexgreen.dev" 
                    defaultValue={userPortfolio}
                    id="modal-portfolio-input"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-1.5 text-xs outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Skills & Expertise (comma separated)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. React, Node.js, Product Design" 
                    defaultValue={userSkills}
                    id="modal-skills-input"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-1.5 text-xs outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => setShowProfileModal(false)} 
                  className="flex-1 py-2 text-xs border border-border rounded-xl hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    const name = (document.getElementById("modal-username-input") as HTMLInputElement)?.value || "";
                    const role = (document.getElementById("modal-role-select") as HTMLSelectElement)?.value || "Digital Nomad";
                    const github = (document.getElementById("modal-github-input") as HTMLInputElement)?.value || "";
                    const twitter = (document.getElementById("modal-twitter-input") as HTMLInputElement)?.value || "";
                    const linkedin = (document.getElementById("modal-linkedin-input") as HTMLInputElement)?.value || "";
                    const timeline = (document.getElementById("modal-timeline-input") as HTMLInputElement)?.value || "";
                    const portfolio = (document.getElementById("modal-portfolio-input") as HTMLInputElement)?.value || "";
                    const skills = (document.getElementById("modal-skills-input") as HTMLInputElement)?.value || "";
                    handleSaveProfile(name, role, twitter, github, linkedin, timeline, portfolio, skills);
                  }}
                  className="flex-1 py-2 text-xs bg-accent text-white rounded-xl hover:bg-accent/95 transition-colors font-medium"
                >
                  Save Profile
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── NEW MEETUP MODAL ── */}
      <AnimatePresence>
        {showNewMeetupModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
            <motion.form 
              onSubmit={handleCreateMeetup}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto"
            >
              <h3 className="font-serif text-lg font-semibold mb-1">Host a Nomad Meetup</h3>
              <p className="text-xs text-muted-foreground mb-4">Set up an event for other remote workers in your city.</p>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Meetup Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Lisbon Coffee & Code session" 
                    value={newMeetup.title}
                    onChange={(e) => setNewMeetup({...newMeetup, title: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-accent"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Category</label>
                    <select
                      value={newMeetup.type}
                      onChange={(e) => setNewMeetup({...newMeetup, type: e.target.value})}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-accent"
                    >
                      <option value="Coworking Session">Coworking Session</option>
                      <option value="Networking Event">Networking Event</option>
                      <option value="Coffee Meetup">Coffee Meetup</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Hiking Group">Hiking Group</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Activity Icon</label>
                    <select
                      value={newMeetup.icon}
                      onChange={(e) => setNewMeetup({...newMeetup, icon: e.target.value})}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-accent"
                    >
                      <option value="🤝">🤝 Meetup</option>
                      <option value="💻">💻 Code</option>
                      <option value="☕">☕ Coffee</option>
                      <option value="🏄">🏄 Outdoor</option>
                      <option value="📚">📚 Learn</option>
                      <option value="🍺">🍺 Social</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Date</label>
                    <input 
                      type="date" 
                      required
                      value={newMeetup.date}
                      onChange={(e) => setNewMeetup({...newMeetup, date: e.target.value})}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Time</label>
                    <input 
                      type="time" 
                      required
                      value={newMeetup.time}
                      onChange={(e) => setNewMeetup({...newMeetup, time: e.target.value})}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">City</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Lisbon" 
                      value={newMeetup.city}
                      onChange={(e) => setNewMeetup({...newMeetup, city: e.target.value})}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-accent"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Max Attendees</label>
                    <input 
                      type="number" 
                      min="2"
                      max="100"
                      value={newMeetup.max_attendees}
                      onChange={(e) => setNewMeetup({...newMeetup, max_attendees: e.target.value})}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Specific Venue / Location</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Betahaus Café rooftop" 
                    value={newMeetup.location}
                    onChange={(e) => setNewMeetup({...newMeetup, location: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowNewMeetupModal(false)} 
                  className="flex-1 py-2 text-xs border border-border rounded-xl hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 text-xs bg-accent text-white rounded-xl hover:bg-accent/95 transition-colors font-medium"
                >
                  Host Meetup
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      {/* ── NEW DISCUSSION POST MODAL ── */}
      <AnimatePresence>
        {showNewPostModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-xs">
            <motion.form 
              onSubmit={handleCreatePost}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-xl"
            >
              <h3 className="font-serif text-lg font-semibold mb-1">Start a Conversation</h3>
              <p className="text-xs text-muted-foreground mb-4">Post a new thread to the digital nomad boards.</p>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Category</label>
                    <select
                      value={newPost.category}
                      onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-accent"
                    >
                      <option value="General">General</option>
                      <option value="Q&A">Q&A</option>
                      <option value="Housing">Housing</option>
                      <option value="Visas">Visas</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. taxes, lisbon, tech" 
                      value={newPost.tags}
                      onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
                      className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-accent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Discussion Title</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Best co-living in Chiang Mai for high-speed WiFi?" 
                    value={newPost.title}
                    onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-accent"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 block">Content Details</label>
                  <textarea 
                    required
                    rows={4}
                    placeholder="Describe your question or share your experience in detail..." 
                    value={newPost.content}
                    onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-xs outline-none focus:border-accent resize-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowNewPostModal(false)} 
                  className="flex-1 py-2 text-xs border border-border rounded-xl hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2 text-xs bg-accent text-white rounded-xl hover:bg-accent/95 transition-colors font-medium"
                >
                  Post Topic
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
