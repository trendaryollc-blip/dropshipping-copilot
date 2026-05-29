"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/billing", label: "Pricing" },
  { href: "/settings", label: "Settings" },
];

const SUPPORT_LINKS = [
  { href: "/settings", label: "Documentation" },
  { href: "/workflows", label: "Workflows" },
  { href: "/templates", label: "Templates" },
  { href: "/analytics", label: "Analytics" },
];

const SOCIAL_LINKS = [
  { href: "#", label: "Twitter", icon: "𝕏" },
  { href: "#", label: "GitHub", icon: "◉" },
  { href: "#", label: "Discord", icon: "◆" },
  { href: "#", label: "LinkedIn", icon: "◌" },
];

export function SiteFooter() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        @keyframes footerSlideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes footerFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes socialGlow {
          0%, 100% { box-shadow: 0 0 8px rgba(139, 92, 246, 0.4); }
          50% { box-shadow: 0 0 16px rgba(139, 92, 246, 0.7); }
        }
        @keyframes colFadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes dividerShimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .footer-visible { animation: footerSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .col-fade-1 { animation: colFadeIn 0.6s ease-out 0.1s forwards; opacity: 0; }
        .col-fade-2 { animation: colFadeIn 0.6s ease-out 0.2s forwards; opacity: 0; }
        .col-fade-3 { animation: colFadeIn 0.6s ease-out 0.3s forwards; opacity: 0; }
        .social-btn { transition: all 0.3s ease; }
        .social-btn:hover { transform: scale(1.15); }
        .social-btn:hover { animation: socialGlow 1.5s ease-in-out infinite; }
        .divider-shimmer {
          background: linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.4) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: dividerShimmer 3s linear infinite;
        }
      `}</style>

      <footer
        ref={footerRef}
        className={`border-t border-violet-500/20 ${visible ? "footer-visible" : "opacity-0"}`}
      >
        {/* Glassmorphism bg with gradient */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-indigo-950/50 to-zinc-950 backdrop-blur-xl" />
          <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent" />

          {/* Top gradient line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

          <div className="relative px-4 py-12 sm:px-6 lg:px-8">
            {/* Three Column Grid */}
            <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
              {/* Column 1: About */}
              <div className="col-fade-1">
                <div className="mb-5 flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600/40 to-blue-600/40 text-base font-bold text-violet-400 ring-1 ring-violet-500/30"
                    style={{ boxShadow: "0 0 15px rgba(139, 92, 246, 0.2)" }}
                  >
                    T
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Trendaryo</p>
                    <p className="text-xs text-violet-400/60">Autopilot</p>
                  </div>
                </div>
                <p className="mb-4 text-sm leading-relaxed text-zinc-400">
                  AI-powered dropshipping automation that handles product research,
                  supplier matching, copywriting, and order fulfillment — all in one
                  seamless workflow.
                </p>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span>All systems operational</span>
                </div>
              </div>

              {/* Column 2: Quick Links */}
              <div className="col-fade-2">
                <h3 className="mb-4 text-sm font-semibold text-white">Quick Links</h3>
                <div className="space-y-3">
                  {QUICK_LINKS.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block text-sm transition-all ${active ? "text-violet-400" : "text-zinc-400 hover:text-violet-300 hover:translate-x-1"}`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
                <h3 className="mb-4 mt-6 text-sm font-semibold text-white">Support</h3>
                <div className="space-y-3">
                  {SUPPORT_LINKS.map((link) => {
                    const active = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block text-sm transition-all ${active ? "text-violet-400" : "text-zinc-400 hover:text-violet-300 hover:translate-x-1"}`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Column 3: Contact */}
              <div className="col-fade-3">
                <h3 className="mb-4 text-sm font-semibold text-white">Contact</h3>
                <div className="space-y-3 text-sm text-zinc-400">
                  <p className="flex items-center gap-2">
                    <span className="text-violet-400">✉</span>
                    <a href="mailto:support@trendaryo.com" className="hover:text-violet-300 transition-colors">support@trendaryo.com</a>
                  </p>
                  <p className="flex items-center gap-2">
                    <span className="text-violet-400">☎</span>
                    <span>+1 (555) 123-4567</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-violet-400">◈</span>
                    <span>San Francisco, CA</span>
                  </p>
                </div>

                {/* Social Icons */}
                <div className="mt-5 flex items-center gap-3">
                  {SOCIAL_LINKS.map((social, index) => (
                    <a
                      key={social.label}
                      href={social.href}
                      onMouseEnter={() => setHoveredSocial(index)}
                      onMouseLeave={() => setHoveredSocial(null)}
                      className={`
                        social-btn flex h-10 w-10 items-center justify-center rounded-xl
                        border border-violet-500/20 bg-violet-500/10 text-sm
                        ${hoveredSocial === index ? "border-violet-500/60 text-violet-300 scale-110" : "text-zinc-400"}
                      `}
                      style={hoveredSocial === index ? { boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" } : {}}
                      title={social.label}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Divider with shimmer */}
            <div className="divider-shimmer mt-10 h-px w-full" />

            {/* Bottom Bar */}
            <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
              <p className="text-xs text-zinc-500">
                © 2026 Trendaryo Autopilot. All rights reserved.
              </p>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <Link href="#" className="hover:text-violet-400 transition-colors">Privacy Policy</Link>
                <Link href="#" className="hover:text-violet-400 transition-colors">Terms of Service</Link>
                <span className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>v1.0.0</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom gradient line */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/20 to-transparent" />
        </div>
      </footer>
    </>
  );
}