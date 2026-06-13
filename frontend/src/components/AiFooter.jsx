import { Link } from "react-router-dom";
import logo from "../assets/roamiq-logo-black.png";

const FOOTER_LINKS = {
  quickLinks: [
    { name: "Explore", path: "/ai-verticals" },
    { name: "Rankings", path: "/world-rankings" },
    { name: "Career", path: "/ai-career" },
    { name: "About", path: "/ai-about" },
    { name: "FAQs", path: "/ai-faq" },
  ],
  legal: [
    { name: "Privacy Policy", path: "/ai-privacy" },
    { name: "Terms & Conditions", path: "/ai-terms-and-conditions" },
    { name: "Content Policy", path: "/ai-content-and-copyright" },
    { name: "Contact", path: "/ai-contact" },
  ],
};

const AiFooter = () => {
  return (
    <footer className="bg-surface-100 border-t border-glass-border">
      {/* Top row */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo + Description */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/home" className="inline-flex items-center gap-2.5 mb-4">
              <div className="h-9 w-9 rounded-xl bg-accent/10 flex items-center justify-center">
                <img
                  src={logo}
                  alt="RoamIQ"
                  className="h-6 w-6 object-contain brightness-0 invert"
                />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                Roam<span className="text-accent">IQ</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-[280px]">
              Building the future of global explorer living. Discover where to
              live, work, and thrive — powered by AI intelligence.
            </p>
            <p className="mt-3 text-xs text-gray-600">
              <a
                href="mailto:hello@roamiq.com"
                className="hover:text-accent transition-colors"
              >
                hello@roamiq.com
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.quickLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-500 hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Legal
            </h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-500 hover:text-accent transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact / Beta notice */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-4">
              Status
            </h4>
            <div className="glass-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-accent animate-glow-pulse" />
                <span className="text-xs font-medium text-accent">Beta</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">
                RoamIQ is in Beta and can make mistakes. Building the future of
                global explorer living, one update at a time.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="border-t border-glass-border">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} RoamIQ. All rights reserved.
          </p>
          <p className="text-xs text-gray-700 font-mono">
            v3.0.0
          </p>
        </div>
      </div>
    </footer>
  );
};

export default AiFooter;
