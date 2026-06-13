import React, { useState } from 'react';
import { Plane, MapPin, Users, Star, Sparkles, Menu, X } from 'lucide-react';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const featuredDestinations = [
    {
      id: 1,
      name: 'Bali, Indonesia',
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=800',
      score: 9.4,
      nomadScore: 'Excellent',
      price: '$$',
      tags: ['Beach', 'Coworking', 'Digital Nomad Hub']
    },
    {
      id: 2,
      name: 'Lisbon, Portugal',
      image: 'https://images.unsplash.com/photo-1585208798174-6cedd78e0198?w=800',
      score: 9.1,
      nomadScore: 'Great',
      price: '$$$',
      tags: ['City', 'Culture', 'Food Paradise']
    },
    {
      id: 3,
      name: 'Chiang Mai, Thailand',
      image: 'https://images.unsplash.com/photo-1506973035872-9c6c6c1c0b3a?w=800',
      score: 9.3,
      nomadScore: 'Excellent',
      price: '$',
      tags: ['Affordable', 'Mountains', 'Community']
    }
  ];

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0F1C]/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-xl flex items-center justify-center">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">RoamIQ</h1>
              <p className="text-[10px] text-teal-400 -mt-1">AI NOMAD TRAVEL</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm">
            <a href="#destinations" className="hover:text-teal-400 transition-colors">Destinations</a>
            <a href="#ai-planner" className="hover:text-teal-400 transition-colors">AI Planner</a>
            <a href="#community" className="hover:text-teal-400 transition-colors">Community</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:block px-6 py-2.5 text-sm font-medium border border-white/20 rounded-full hover:bg-white/5 transition-all">
              Log in
            </button>
            <button className="px-6 py-2.5 bg-white text-black font-semibold rounded-full hover:bg-teal-400 hover:text-white transition-all flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Start AI Planning
            </button>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0A0F1C] border-t border-white/10 py-4">
            <div className="flex flex-col px-6 gap-4 text-sm">
              <a href="#destinations" className="py-2">Destinations</a>
              <a href="#ai-planner" className="py-2">AI Planner</a>
              <a href="#community" className="py-2">Community</a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-20 min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4')] bg-cover bg-center opacity-60"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black"></div>
        
        <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-medium tracking-wide">POWERED BY ADVANCED AI</span>
          </div>

          <h1 className="text-6xl md:text-7xl font-bold leading-tight mb-6 tracking-tighter">
            Find Your Next<br />Perfect Nomad Home
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-300 mb-10">
            AI that understands digital nomads. Get personalized city recommendations, cost breakdowns, visa info, and community insights.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-10 py-4 bg-white text-black font-semibold rounded-2xl text-lg hover:bg-teal-400 hover:text-white transition-all flex items-center justify-center gap-3 group">
              Start Free AI Trip Planner
              <Plane className="group-hover:rotate-45 transition-transform" />
            </button>
            <button className="px-8 py-4 border border-white/30 hover:bg-white/10 rounded-2xl text-lg transition-all">
              Watch Demo
            </button>
          </div>

          <div className="mt-16 flex justify-center gap-8 text-sm opacity-75">
            <div>Trusted by 12,450 nomads</div>
            <div>4.98 Average Rating</div>
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section id="destinations" className="py-20 bg-[#0F1629]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-5xl font-bold tracking-tight">Featured Nomad Cities</h2>
              <p className="text-xl text-gray-400 mt-3">AI-ranked destinations loved by remote workers</p>
            </div>
            <button className="hidden md:flex items-center gap-2 text-teal-400 hover:text-teal-300">
              Explore all cities <MapPin />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {featuredDestinations.map((dest) => (
              <div key={dest.id} className="group bg-[#1A2338] rounded-3xl overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                <div className="relative h-80">
                  <img 
                    src={dest.image} 
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-sm flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400" /> {dest.score}
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-semibold">{dest.name}</h3>
                    <span className="text-teal-400 font-mono">{dest.price}</span>
                  </div>
                  <p className="text-teal-400 mt-1 text-sm font-medium">{dest.nomadScore} Nomad Score</p>
                  
                  <div className="flex flex-wrap gap-2 mt-6">
                    {dest.tags.map((tag, i) => (
                      <span key={i} className="text-xs px-3 py-1 bg-white/5 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Planner Teaser */}
      <section id="ai-planner" className="py-24 bg-gradient-to-b from-[#0F1629] to-[#0A0F1C]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-teal-500/10 text-teal-400 rounded-full mb-6">
            <Sparkles className="w-5 h-5" /> INTELLIGENT TRAVEL AI
          </div>
          <h2 className="text-5xl font-bold tracking-tight mb-6">Your Personal AI Travel Companion</h2>
          <p className="text-2xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Tell RoamIQ what you're looking for. Get complete itineraries, cost estimates, and visa guidance in seconds.
          </p>
          <button className="px-12 py-5 bg-gradient-to-r from-teal-400 to-cyan-500 text-black font-semibold text-xl rounded-2xl hover:scale-105 transition-all flex items-center gap-3 mx-auto">
            <Sparkles className="w-6 h-6" />
            OPEN AI TRIP PLANNER
          </button>
        </div>
      </section>

      <footer className="bg-black py-16 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          © 2026 RoamIQ • Made for Digital Nomads
        </div>
      </footer>
    </div>
  );
}

export default App;
