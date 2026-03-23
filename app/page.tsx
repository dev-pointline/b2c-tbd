"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { Outfit, Sora } from "next/font/google";

const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

/* ============================================================
   HOOKS
   ============================================================ */

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

/* ============================================================
   ANIMATED SECTION WRAPPER
   ============================================================ */

function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: isInView ? 1 : 0,
        transform: isInView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.7s ease ${delay}s, transform 0.7s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ============================================================
   CHECK ICON
   ============================================================ */

function CheckIcon({ className = "w-5 h-5 text-emerald-400" }: { className?: string }) {
  return (
    <svg className={`flex-shrink-0 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );
}

/* ============================================================
   CHEVRON ICON
   ============================================================ */

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 text-slate-500 ${className}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}

/* ============================================================
   EMAIL SIGNUP FORM
   ============================================================ */

function EmailSignupForm({
  buttonText = "Join Waitlist",
  variant = "primary",
}: {
  buttonText?: string;
  variant?: "primary" | "secondary";
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        setMessage(data.message);
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to submit. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 text-emerald-400 font-medium">
        <CheckIcon className="w-5 h-5 text-emerald-400" />
        {message}
      </div>
    );
  }

  const btnClass =
    variant === "primary"
      ? "btn-primary"
      : "bg-emerald-500 hover:bg-emerald-400 text-black font-semibold";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        required
        className="input-dark flex-1 px-4 py-3 rounded-lg text-sm"
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={`px-6 py-3 rounded-lg text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${btnClass}`}
      >
        {status === "loading" ? "Joining..." : buttonText}
      </button>
      {status === "error" && <p className="text-red-400 text-sm mt-1">{message}</p>}
    </form>
  );
}

/* ============================================================
   NAVIGATION
   ============================================================ */

function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Features" },
    { href: "#how-it-works", label: "How it Works" },
    { href: "#pricing", label: "Pricing" },
    { href: "#faq", label: "FAQ" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "nav-glass" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center transition-shadow group-hover:shadow-[0_0_16px_rgba(16,185,129,0.4)]">
              <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <span className={`font-bold text-xl text-white ${sora.className}`}>DocuLens</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#waitlist"
              className="btn-primary px-5 py-2 rounded-lg text-sm"
            >
              Join Waitlist
            </a>
          </div>

          {/* Hamburger */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden pb-6 pt-2 border-t border-slate-800/50 animate-fade-in-down">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-3 py-3 text-slate-300 hover:text-emerald-400 hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#waitlist"
                className="btn-primary mt-2 px-4 py-3 rounded-lg text-center text-sm"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Join Waitlist
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

/* ============================================================
   CODE ANIMATION  (hero)
   ============================================================ */

function CodeAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setStep((s) => (s + 1) % 3), 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-4 lg:gap-6 w-full max-w-4xl mx-auto">
      {/* ---- Code Editor ---- */}
      <div className="code-window glow-emerald">
        <div className="code-window-bar">
          <div className="flex gap-1.5">
            <div className="code-dot bg-red-500/80" />
            <div className="code-dot bg-yellow-500/80" />
            <div className="code-dot bg-green-500/80" />
          </div>
          <span className="text-slate-500 text-xs font-mono ml-2">users.controller.ts</span>
        </div>
        <div className="p-4 font-mono text-xs sm:text-sm leading-relaxed">
          <div className="text-slate-600">{"// User endpoint"}</div>
          <div>
            <span className="text-purple-400">@Get</span>
            <span className="text-slate-400">(</span>
            <span className="text-emerald-400">&apos;/users/:id&apos;</span>
            <span className="text-slate-400">)</span>
          </div>
          <div>
            <span className="text-cyan-400">async </span>
            <span className="text-yellow-300">getUser</span>
            <span className="text-slate-400">(</span>
          </div>
          <div className="pl-4">
            <span className="text-orange-400">@Param</span>
            <span className="text-slate-400">(</span>
            <span className="text-emerald-400">&apos;id&apos;</span>
            <span className="text-slate-400">) </span>
            <span className="text-slate-300">id: </span>
            <span className="text-cyan-400">string</span>
            <span className="text-slate-400">,</span>
          </div>
          <div
            className={`pl-4 rounded transition-all duration-500 ${
              step >= 1 ? "bg-emerald-500/10 border-l-2 border-emerald-500/40" : ""
            }`}
          >
            <span className="text-orange-400">@Query</span>
            <span className="text-slate-400">(</span>
            <span className="text-emerald-400">&apos;includeEmail&apos;</span>
            <span className="text-slate-400">) </span>
            <span className="text-slate-300">email</span>
            <span className={`text-pink-400 transition-all ${step >= 1 ? "opacity-100" : "opacity-0"}`}>?</span>
            <span className="text-slate-400">: </span>
            <span className="text-cyan-400">boolean</span>
          </div>
          <div className="text-slate-400">{")"}</div>
        </div>
        {step >= 1 && (
          <div className="px-4 pb-3 flex items-center gap-2 text-emerald-400 text-xs">
            <CheckIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>Pushed 3 seconds ago</span>
          </div>
        )}
      </div>

      {/* ---- Docs Side ---- */}
      <div className="code-window" style={{ borderColor: "#1e293b" }}>
        <div className="code-window-bar justify-between">
          <span className="font-semibold text-slate-300 text-sm">GET /users/:id</span>
          <span className="text-xs px-2 py-0.5 bg-emerald-500/15 text-emerald-400 rounded-full border border-emerald-500/20">
            200 OK
          </span>
        </div>
        <div className="p-4 text-sm">
          <div className="mb-4">
            <h4 className="font-semibold text-slate-400 mb-3 text-xs uppercase tracking-wider">Parameters</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 bg-white/[0.03] rounded-lg border border-white/[0.04]">
                <code className="text-cyan-400 text-xs font-mono">id</code>
                <span className="text-xs px-2 py-0.5 bg-red-500/15 text-red-400 rounded border border-red-500/20">
                  required
                </span>
              </div>
              <div
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all duration-500 ${
                  step >= 2
                    ? "bg-emerald-500/[0.06] border-emerald-500/20"
                    : "bg-white/[0.03] border-white/[0.04]"
                }`}
              >
                <code className="text-cyan-400 text-xs font-mono">includeEmail</code>
                <span
                  className={`text-xs px-2 py-0.5 rounded border transition-all duration-500 ${
                    step >= 2
                      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/20"
                      : "bg-white/[0.06] text-slate-500 border-white/[0.06]"
                  }`}
                >
                  {step >= 2 ? "optional" : "required"}
                </span>
              </div>
            </div>
          </div>
          {step >= 2 && (
            <div className="flex items-center gap-2 text-emerald-400 text-xs mt-4 animate-fade-in-up">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Auto-updated by DocuLens</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   FEATURE CARD
   ============================================================ */

function FeatureCard({
  icon,
  title,
  description,
  highlight,
  accentColor,
  delay,
}: {
  icon: string;
  title: string;
  description: React.ReactNode;
  highlight: string;
  accentColor: string;
  delay: number;
}) {
  return (
    <AnimatedSection delay={delay}>
      <div className="card-dark rounded-xl p-6 h-full flex flex-col">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-lg"
          style={{ background: `${accentColor}15` }}
        >
          {icon}
        </div>
        <h3 className={`font-bold text-lg text-white mb-2 ${sora.className}`}>{title}</h3>
        <p className="text-slate-400 text-sm mb-3 flex-1 leading-relaxed">{description}</p>
        <p className="text-sm font-medium" style={{ color: accentColor }}>
          {highlight}
        </p>
      </div>
    </AnimatedSection>
  );
}

/* ============================================================
   MAIN PAGE
   ============================================================ */

export default function Home() {
  return (
    <main className={`min-h-screen ${sora.variable} ${outfit.variable}`}>
      <Navigation />

      {/* ================================================================
          HERO SECTION
          ================================================================ */}
      <section className="relative pt-28 sm:pt-32 lg:pt-40 pb-16 lg:pb-24 px-4 sm:px-6 mesh-gradient-hero grid-bg overflow-hidden">
        {/* Decorative corner glow */}
        <div
          className="absolute top-0 right-0 w-96 h-96 opacity-30 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.15), transparent 60%)",
          }}
        />
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              Launching Q2 2026
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <h1
              className={`text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[1.1] tracking-tight ${sora.className}`}
            >
              <span className="text-white">Never Manually Update</span>
              <br />
              <span className="gradient-text">API Docs Again</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p
              className={`text-base sm:text-lg lg:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed ${outfit.className}`}
            >
              DocuLens reads your codebase, tracks every git push, and regenerates accurate documentation in seconds
              — so your team ships code instead of fixing stale README files.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.3}>
            <div className="flex flex-col items-center gap-4">
              <EmailSignupForm buttonText="Join the Waitlist" />
              <p className="text-sm text-slate-600">
                Be one of the first 100 teams to get early access pricing
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.5} className="mt-14 lg:mt-20">
            <CodeAnimation />
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================
          CREDIBILITY BAR
          ================================================================ */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 border-y border-slate-800/50" style={{ background: "#0c1019" }}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <p className={`text-center text-slate-500 mb-8 text-sm sm:text-base ${outfit.className}`}>
              <span className="font-semibold text-slate-400">Built for</span> development teams shipping APIs
              faster than they can document them
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-50">
              {/* GitHub */}
              <div className="flex items-center gap-2 text-slate-300">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                <span className="font-semibold text-sm">GitHub</span>
              </div>
              {/* TypeScript */}
              <div className="flex items-center gap-2 text-blue-400">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
                </svg>
                <span className="font-semibold text-sm">TypeScript</span>
              </div>
              {/* Python */}
              <div className="flex items-center gap-2 text-yellow-400">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z" />
                </svg>
                <span className="font-semibold text-sm">Python</span>
              </div>
              {/* Express */}
              <div className="flex items-center gap-2 text-green-400">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 01-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 011.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 011.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 000 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 002.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 01-2.589 3.957 6.272 6.272 0 01-7.306-.933 6.575 6.575 0 01-1.64-3.858c0-.235-.08-.455-.134-.666A88.33 88.33 0 010 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278-2.882-.04-4.944 2.094-5.071 5.264z" />
                </svg>
                <span className="font-semibold text-sm">Express</span>
              </div>
              {/* FastAPI */}
              <div className="flex items-center gap-2 text-teal-400">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.375 0 0 5.375 0 12c0 6.627 5.375 12 12 12 6.626 0 12-5.373 12-12 0-6.625-5.373-12-12-12zm-.624 21.62v-7.528H7.19L13.203 2.38v7.528h4.029L11.376 21.62z" />
                </svg>
                <span className="font-semibold text-sm">FastAPI</span>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <p className={`text-center text-sm text-slate-600 mt-8 italic ${outfit.className}`}>
              &ldquo;47% of developers cite poor documentation as their #1 API frustration&rdquo; — Postman State of
              the API 2025
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================
          PROBLEM / PAIN POINTS
          ================================================================ */}
      <section className="py-20 lg:py-28 px-4 sm:px-6 grid-bg">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-4 ${sora.className}`}>
              Your Docs Are <span className="text-red-400">Lying</span> to Your Users
            </h2>
            <p className={`text-lg text-slate-500 text-center mb-14 max-w-2xl mx-auto ${outfit.className}`}>
              Every stale doc line costs you time, money, and trust
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* Pain 1 */}
            <AnimatedSection delay={0.1}>
              <div className="card-dark rounded-2xl p-6 lg:p-8 h-full">
                <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center mb-5 border border-red-500/10">
                  <span className="text-2xl">&#x1F4C9;</span>
                </div>
                <h3 className={`font-bold text-xl text-white mb-3 ${sora.className}`}>The Documentation Drift</h3>
                <p className={`text-slate-400 leading-relaxed ${outfit.className}`}>
                  Your API evolves daily, but docs update monthly. Your code says{" "}
                  <code className="bg-white/[0.06] px-1.5 py-0.5 rounded text-cyan-400 text-xs font-mono">userId</code>{" "}
                  is optional — your docs say required. Developers waste hours debugging problems that shouldn&apos;t
                  exist.
                </p>
                <p className="text-sm text-red-400/80 mt-5 font-medium">Average: 6+ hours/week on doc maintenance</p>
              </div>
            </AnimatedSection>

            {/* Pain 2 */}
            <AnimatedSection delay={0.2}>
              <div className="card-dark rounded-2xl p-6 lg:p-8 h-full">
                <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center mb-5 border border-amber-500/10">
                  <span className="text-2xl">&#x1F3AB;</span>
                </div>
                <h3 className={`font-bold text-xl text-white mb-3 ${sora.className}`}>
                  The Support Ticket Avalanche
                </h3>
                <p className={`text-slate-400 leading-relaxed ${outfit.className}`}>
                  &ldquo;This endpoint doesn&apos;t work like the docs say.&rdquo; Sound familiar? Every wrong
                  parameter type, every missing example, every outdated response schema becomes a support ticket your
                  team has to answer.
                </p>
                <p className="text-sm text-amber-400/80 mt-5 font-medium">
                  Cost: ~$23,000/year in wasted developer time
                </p>
              </div>
            </AnimatedSection>

            {/* Pain 3 */}
            <AnimatedSection delay={0.3}>
              <div className="card-dark rounded-2xl p-6 lg:p-8 h-full">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-5 border border-blue-500/10">
                  <span className="text-2xl">&#x1F91D;</span>
                </div>
                <h3 className={`font-bold text-xl text-white mb-3 ${sora.className}`}>The Trust Tax</h3>
                <p className={`text-slate-400 leading-relaxed ${outfit.className}`}>
                  When integration is painful, developers choose your competitor. Your code might be beautiful, but if
                  docs are wrong, nobody sees it. Bad docs = 30% lower API adoption rates.
                </p>
                <p className="text-sm text-blue-400/80 mt-5 font-medium">Lost: 2-3 customers/year from doc confusion</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-7xl mx-auto" />

      {/* ================================================================
          BEFORE / AFTER (Solution)
          ================================================================ */}
      <section className="py-20 lg:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-14 ${sora.className}`}>
              From Manual Chaos to <span className="gradient-text">Automatic Sync</span>
            </h2>
          </AnimatedSection>

          <div className="space-y-6 lg:space-y-8 max-w-5xl mx-auto">
            {/* Scenario 1 */}
            <AnimatedSection delay={0.1}>
              <div className="card-dark rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-6 lg:p-8 border-b md:border-b-0 md:border-r border-slate-800/50 bg-red-500/[0.02]">
                    <span className="label-before inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4">
                      Before
                    </span>
                    <p className={`text-slate-400 leading-relaxed ${outfit.className}`}>
                      You push a breaking change at 4pm. Three weeks later, a customer discovers the docs are wrong.
                      They email support. Support pings engineering. Engineering updates Notion. The cycle repeats
                      infinitely.
                    </p>
                  </div>
                  <div className="p-6 lg:p-8 bg-emerald-500/[0.02]">
                    <span className="label-after inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4">
                      After
                    </span>
                    <p className={`text-slate-400 leading-relaxed ${outfit.className}`}>
                      You push a breaking change at 4pm. DocuLens detects the diff, regenerates the affected docs, and
                      publishes within 5 minutes. The customer never sees wrong information. Support ticket avoided.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Scenario 2 */}
            <AnimatedSection delay={0.2}>
              <div className="card-dark rounded-2xl overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-6 lg:p-8 border-b md:border-b-0 md:border-r border-slate-800/50 bg-red-500/[0.02]">
                    <span className="label-before inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4">
                      Before
                    </span>
                    <p className={`text-slate-400 leading-relaxed ${outfit.className}`}>
                      New engineer joins and asks &ldquo;how do I add a new endpoint to our docs?&rdquo; Answer:
                      &ldquo;Copy this other page, change the fields, hope you don&apos;t miss anything, then ask Sarah
                      to review it.&rdquo;
                    </p>
                  </div>
                  <div className="p-6 lg:p-8 bg-emerald-500/[0.02]">
                    <span className="label-after inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4">
                      After
                    </span>
                    <p className={`text-slate-400 leading-relaxed ${outfit.className}`}>
                      New engineer pushes code. DocuLens generates the endpoint docs automatically — with curl,
                      JavaScript, and Python examples. No tribal knowledge required. Sarah reviews code, not docs.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-7xl mx-auto" />

      {/* ================================================================
          FEATURES
          ================================================================ */}
      <section id="features" className="py-20 lg:py-28 px-4 sm:px-6 grid-bg">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-4 ${sora.className}`}>
              Documentation That <span className="gradient-text">Writes Itself</span>
            </h2>
            <p className={`text-lg text-slate-500 text-center mb-14 max-w-2xl mx-auto ${outfit.className}`}>
              DocuLens connects to your codebase and keeps docs perfectly in sync
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            <FeatureCard
              icon="&#x1F504;"
              title="Real-Time Git Sync"
              description={
                <>
                  Push to main, docs update in minutes. Every commit triggers a re-parse of changed files — no manual
                  triggers needed.
                </>
              }
              highlight="Designed to update within 5 minutes of push"
              accentColor="#3b82f6"
              delay={0.1}
            />
            <FeatureCard
              icon="&#x1F4BB;"
              title="AI-Generated Code Examples"
              description={
                <>
                  For every endpoint, get working examples in curl, JavaScript, and Python. Not templates — actual
                  examples using your real parameter names.
                </>
              }
              highlight="Copy, paste, it works the first time"
              accentColor="#a855f7"
              delay={0.15}
            />
            <FeatureCard
              icon="&#x1F3AF;"
              title="Type-Aware Parsing"
              description={
                <>
                  DocuLens understands your TypeScript types, Python decorators, and JSDoc comments. It knows{" "}
                  <code className="bg-white/[0.06] px-1 rounded text-xs font-mono text-cyan-400">userId?</code> means
                  optional.
                </>
              }
              highlight="Native support for NestJS, FastAPI, Flask"
              accentColor="#10b981"
              delay={0.2}
            />
            <FeatureCard
              icon="&#x1F4CA;"
              title="Change Detection Diffs"
              description={
                <>
                  Every update includes a visual diff: what was added, removed, or modified. Review changes before
                  publishing.
                </>
              }
              highlight="Catch issues before customers do"
              accentColor="#f59e0b"
              delay={0.25}
            />
            <FeatureCard
              icon="&#x1F50D;"
              title="Instant Search"
              description={
                <>
                  Semantic search across your entire API surface. Type &ldquo;how do I create a user?&rdquo; and find
                  the right endpoint immediately.
                </>
              }
              highlight="No more Ctrl+F through 47 Notion pages"
              accentColor="#f43f5e"
              delay={0.3}
            />
            <FeatureCard
              icon="&#x2728;"
              title="Beautiful, Hosted Docs"
              description={
                <>
                  Clean, responsive design. Syntax highlighting. Dark mode. Custom branding. Ship docs that look as
                  good as your code.
                </>
              }
              highlight="Zero design work required"
              accentColor="#6366f1"
              delay={0.35}
            />
          </div>
        </div>
      </section>

      {/* ================================================================
          HOW IT WORKS
          ================================================================ */}
      <section id="how-it-works" className="py-20 lg:py-28 px-4 sm:px-6 relative overflow-hidden">
        {/* Mesh background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(16, 185, 129, 0.05), transparent)",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <AnimatedSection>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-4 ${sora.className}`}>
              How DocuLens Works
            </h2>
            <p className={`text-lg text-slate-500 text-center mb-16 max-w-2xl mx-auto ${outfit.className}`}>
              From zero to auto-updating docs in under 3 minutes
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Connecting line (desktop only) */}
            <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/30 to-emerald-500/0" />

            {/* Step 1 */}
            <AnimatedSection delay={0.1}>
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 relative">
                  <span className={`text-emerald-400 text-xl font-bold ${sora.className}`}>1</span>
                  <div className="absolute -inset-1 rounded-2xl border border-emerald-500/10" />
                </div>
                <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
                  <span className="text-xl">&#x1F517;</span>
                </div>
                <h3 className={`font-bold text-xl text-white mb-3 ${sora.className}`}>Connect Your Repository</h3>
                <p className={`text-slate-500 leading-relaxed ${outfit.className}`}>
                  One-click GitHub OAuth — read-only access. Connect your repo in under 60 seconds. We never write to
                  your repository.
                </p>
              </div>
            </AnimatedSection>

            {/* Step 2 */}
            <AnimatedSection delay={0.2}>
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 relative">
                  <span className={`text-emerald-400 text-xl font-bold ${sora.className}`}>2</span>
                  <div className="absolute -inset-1 rounded-2xl border border-emerald-500/10" />
                </div>
                <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
                  <span className="text-xl">&#x1F916;</span>
                </div>
                <h3 className={`font-bold text-xl text-white mb-3 ${sora.className}`}>AI Parses Your Code</h3>
                <p className={`text-slate-500 leading-relaxed ${outfit.className}`}>
                  Our AI reads your actual source files — not OpenAPI specs. It extracts endpoints, parameters, return
                  types, and docstrings.
                </p>
              </div>
            </AnimatedSection>

            {/* Step 3 */}
            <AnimatedSection delay={0.3}>
              <div className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 relative">
                  <span className={`text-emerald-400 text-xl font-bold ${sora.className}`}>3</span>
                  <div className="absolute -inset-1 rounded-2xl border border-emerald-500/10" />
                </div>
                <div className="w-12 h-12 bg-slate-800/50 rounded-xl flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
                  <span className="text-xl">&#x267B;&#xFE0F;</span>
                </div>
                <h3 className={`font-bold text-xl text-white mb-3 ${sora.className}`}>Docs Stay Updated Forever</h3>
                <p className={`text-slate-500 leading-relaxed ${outfit.className}`}>
                  Every push to main triggers incremental updates. Changed files get re-parsed, docs regenerate. Never
                  more than 5 minutes stale.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-7xl mx-auto" />

      {/* ================================================================
          USE CASES
          ================================================================ */}
      <section className="py-20 lg:py-28 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-4 ${sora.className}`}>
              Built for Teams Like Yours
            </h2>
            <p className={`text-lg text-slate-500 text-center mb-14 max-w-2xl mx-auto ${outfit.className}`}>
              Here&apos;s how different teams would use DocuLens
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {/* CTO */}
            <AnimatedSection delay={0.1}>
              <div className="card-dark rounded-2xl p-6 lg:p-8 h-full relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(59, 130, 246, 0.06), transparent)" }}
                />
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/15">
                    <span className="text-xl">&#x1F468;&#x200D;&#x1F4BB;</span>
                  </div>
                  <div>
                    <h3 className={`font-bold text-white ${sora.className}`}>The Startup CTO</h3>
                    <p className="text-xs text-slate-600">Series A, 8 engineers</p>
                  </div>
                </div>
                <p className={`text-slate-400 text-sm leading-relaxed ${outfit.className}`}>
                  Your team ships 15 API changes per week. You used to spend Friday afternoons updating Notion docs.
                  Now you review AI-generated diffs in 5 minutes and approve. You reclaimed 4 hours/week to actually
                  build product.
                </p>
              </div>
            </AnimatedSection>

            {/* DevRel */}
            <AnimatedSection delay={0.2}>
              <div className="card-dark rounded-2xl p-6 lg:p-8 h-full relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(16, 185, 129, 0.06), transparent)" }}
                />
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/15">
                    <span className="text-xl">&#x1F3AF;</span>
                  </div>
                  <div>
                    <h3 className={`font-bold text-white ${sora.className}`}>DevRel Lead</h3>
                    <p className="text-xs text-slate-600">Public API company</p>
                  </div>
                </div>
                <p className={`text-slate-400 text-sm leading-relaxed ${outfit.className}`}>
                  Integration success rate is your north star. With DocuLens, docs are always accurate, code examples
                  always work, and support ticket volume dropped because developers actually trust what they read.
                </p>
              </div>
            </AnimatedSection>

            {/* OSS */}
            <AnimatedSection delay={0.3}>
              <div className="card-dark rounded-2xl p-6 lg:p-8 h-full relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(168, 85, 247, 0.06), transparent)" }}
                />
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center border border-purple-500/15">
                    <span className="text-xl">&#x2B50;</span>
                  </div>
                  <div>
                    <h3 className={`font-bold text-white ${sora.className}`}>OSS Maintainer</h3>
                    <p className="text-xs text-slate-600">15K GitHub stars</p>
                  </div>
                </div>
                <p className={`text-slate-400 text-sm leading-relaxed ${outfit.className}`}>
                  Contributors add features faster than you can document them. DocuLens auto-generates docs for every
                  PR merge. You focus on reviewing code quality, not README accuracy.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ================================================================
          PRICING
          ================================================================ */}
      <section id="pricing" className="py-20 lg:py-28 px-4 sm:px-6 relative" style={{ background: "#0c1019" }}>
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] text-emerald-400 text-xs font-semibold mb-4 uppercase tracking-wider">
                Planned Launch Pricing
              </div>
              <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 ${sora.className}`}>
                Simple, Transparent Pricing
              </h2>
              <p className={`text-lg text-slate-500 max-w-2xl mx-auto ${outfit.className}`}>
                Start free with a 14-day trial. No credit card required.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <AnimatedSection delay={0.1}>
              <div className="card-dark rounded-2xl p-7 lg:p-8 h-full flex flex-col">
                <h3 className={`font-bold text-xl text-white mb-2 ${sora.className}`}>Starter</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-4xl font-bold text-white ${sora.className}`}>$49</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <p className={`text-slate-500 text-sm mb-6 ${outfit.className}`}>
                  Perfect for solo developers and small projects
                </p>
                <ul className={`space-y-3 mb-8 flex-1 ${outfit.className}`}>
                  <li className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckIcon />1 repository
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckIcon />
                    Daily sync (24-hour updates)
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckIcon />
                    AI-generated examples (3 languages)
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckIcon />
                    Basic search
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckIcon />
                    Community support
                  </li>
                </ul>
                <a
                  href="#waitlist"
                  className="btn-outline block w-full py-3 text-center rounded-lg text-sm"
                >
                  Join Waitlist
                </a>
              </div>
            </AnimatedSection>

            {/* Pro - Popular */}
            <AnimatedSection delay={0.15}>
              <div className="pricing-popular rounded-2xl p-7 lg:p-8 h-full flex flex-col relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-xs font-bold rounded-full whitespace-nowrap">
                  Most Popular
                </div>
                <h3 className={`font-bold text-xl text-white mb-2 ${sora.className}`}>Pro</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-4xl font-bold text-white ${sora.className}`}>$99</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <p className={`text-slate-500 text-sm mb-6 ${outfit.className}`}>
                  For teams who ship fast and need real-time docs
                </p>
                <ul className={`space-y-3 mb-8 flex-1 ${outfit.className}`}>
                  <li className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckIcon />5 repositories
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-white font-medium">
                    <CheckIcon />
                    Real-time sync (5-minute updates)
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckIcon />
                    AI examples in 6 languages
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckIcon />
                    Semantic search + change diffs
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckIcon />
                    Custom branding
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckIcon />
                    Priority email support
                  </li>
                </ul>
                <a
                  href="#waitlist"
                  className="btn-primary block w-full py-3 text-center rounded-lg text-sm"
                >
                  Join Waitlist
                </a>
              </div>
            </AnimatedSection>

            {/* Agency */}
            <AnimatedSection delay={0.2}>
              <div className="card-dark rounded-2xl p-7 lg:p-8 h-full flex flex-col">
                <h3 className={`font-bold text-xl text-white mb-2 ${sora.className}`}>Agency</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className={`text-4xl font-bold text-white ${sora.className}`}>$199</span>
                  <span className="text-slate-600">/month</span>
                </div>
                <p className={`text-slate-500 text-sm mb-6 ${outfit.className}`}>
                  For agencies managing multiple client APIs
                </p>
                <ul className={`space-y-3 mb-8 flex-1 ${outfit.className}`}>
                  <li className="flex items-center gap-2.5 text-sm text-white font-medium">
                    <CheckIcon />
                    Unlimited repositories
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckIcon />
                    Real-time sync
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckIcon />
                    All Pro features
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckIcon />
                    White-label documentation
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckIcon />
                    Team collaboration (10 seats)
                  </li>
                  <li className="flex items-center gap-2.5 text-sm text-slate-400">
                    <CheckIcon />
                    Dedicated Slack support
                  </li>
                </ul>
                <a
                  href="#waitlist"
                  className="btn-outline block w-full py-3 text-center rounded-lg text-sm"
                >
                  Join Waitlist
                </a>
              </div>
            </AnimatedSection>
          </div>

          {/* Pricing mini-FAQ */}
          <AnimatedSection delay={0.3}>
            <div className="mt-16 max-w-2xl mx-auto">
              <h3 className={`font-bold text-lg text-white mb-6 text-center ${sora.className}`}>Common Questions</h3>
              <div className="space-y-3">
                <div className="card-dark rounded-lg p-5">
                  <h4 className={`font-semibold text-white mb-1 text-sm ${sora.className}`}>
                    When will DocuLens launch?
                  </h4>
                  <p className={`text-slate-500 text-sm ${outfit.className}`}>
                    We&apos;re targeting Q2 2026 for public launch. Early access users will get hands-on access in 4-6
                    weeks.
                  </p>
                </div>
                <div className="card-dark rounded-lg p-5">
                  <h4 className={`font-semibold text-white mb-1 text-sm ${sora.className}`}>
                    Will there be a free trial?
                  </h4>
                  <p className={`text-slate-500 text-sm ${outfit.className}`}>
                    Yes — all plans include a 14-day free trial with full access. No credit card required to start.
                  </p>
                </div>
                <div className="card-dark rounded-lg p-5">
                  <h4 className={`font-semibold text-white mb-1 text-sm ${sora.className}`}>
                    Can I cancel anytime?
                  </h4>
                  <p className={`text-slate-500 text-sm ${outfit.className}`}>
                    Absolutely. No contracts, no annual commitments required. Cancel with one click, export your data.
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================
          FAQ
          ================================================================ */}
      <section id="faq" className="py-20 lg:py-28 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-white mb-14 ${sora.className}`}>
              Frequently Asked Questions
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {[
              {
                q: "What languages and frameworks does DocuLens support?",
                a: "At launch, we support TypeScript (Express, NestJS, Fastify) and Python (FastAPI, Flask, Django REST). Go and Ruby support is on the roadmap based on demand from our early users.",
              },
              {
                q: "How accurate is the AI-generated documentation?",
                a: "Our goal is 95%+ accuracy out of the box. For complex edge cases, DocuLens shows confidence scores and flags sections that may need human review. You can always edit any generated content before publishing.",
              },
              {
                q: "Is my code secure?",
                a: "DocuLens requests read-only GitHub access. Your code is processed securely and never stored beyond what's needed for documentation generation. We never access other repositories in your organization.",
              },
              {
                q: "How is this different from Swagger/OpenAPI?",
                a: "Swagger requires you to maintain a separate spec file that can drift from your code. DocuLens reads your actual source code — no additional files to keep in sync. If your code changes, your docs change automatically.",
              },
              {
                q: "What if I already use ReadMe.io or GitBook?",
                a: "DocuLens can export to standard formats like Markdown and OpenAPI. Many teams use DocuLens to auto-generate content, then publish to their existing documentation platform. Or switch entirely — your choice.",
              },
              {
                q: "How fast do docs update after I push code?",
                a: "Pro and Agency plans update within 5 minutes of a git push. Starter plan updates within 24 hours. All updates are automatic — no manual triggers needed.",
              },
              {
                q: "Can my whole team access the documentation?",
                a: "Starter and Pro plans include unlimited viewers. Agency plans include 10 editor seats for teams who want collaborative review workflows before publishing.",
              },
              {
                q: "When does DocuLens launch?",
                a: "We're targeting Q2 2026 for public launch. Join the waitlist to get early access — we're onboarding the first 100 teams in the coming weeks.",
              },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.05}>
                <details className="group card-dark rounded-xl overflow-hidden">
                  <summary
                    className={`flex items-center justify-between p-5 sm:p-6 cursor-pointer font-semibold text-white text-sm sm:text-base ${sora.className}`}
                  >
                    {item.q}
                    <ChevronIcon className="group-open:rotate-180 transition-transform duration-200 flex-shrink-0 ml-4" />
                  </summary>
                  <div className={`px-5 sm:px-6 pb-5 sm:pb-6 text-slate-400 text-sm leading-relaxed ${outfit.className}`}>
                    {item.a}
                  </div>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================
          FINAL CTA
          ================================================================ */}
      <section id="waitlist" className="py-20 lg:py-28 px-4 sm:px-6 relative overflow-hidden mesh-gradient-cta">
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-bg-dense pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <AnimatedSection>
            <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight ${sora.className}`}>
              Stop Wasting Time on Documentation{" "}
              <span className="gradient-text">That Goes Stale</span>
            </h2>
            <p className={`text-lg text-slate-500 mb-10 ${outfit.className}`}>
              Join 87+ developers already on the waitlist. Early access opens in weeks, not months.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <div className="card-dark rounded-2xl p-6 sm:p-8 w-full max-w-md mx-auto">
              <EmailSignupForm buttonText="Get Early Access" variant="secondary" />
            </div>
            <p className={`text-sm text-slate-600 mt-5 ${outfit.className}`}>
              We&apos;re building DocuLens for teams exactly like yours. Lock in launch pricing before we raise prices.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ================================================================
          FOOTER
          ================================================================ */}
      <footer className="py-12 lg:py-16 px-4 sm:px-6 border-t border-slate-800/50" style={{ background: "#080b12" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div className="sm:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className={`font-bold text-xl text-white ${sora.className}`}>DocuLens</span>
              </div>
              <p className={`text-sm text-slate-600 max-w-xs leading-relaxed ${outfit.className}`}>
                DocuLens is building the future of API documentation — where your code is the source of truth and docs
                update themselves.
              </p>
            </div>

            {/* Product links */}
            <div>
              <h4 className={`font-semibold text-white mb-4 text-sm ${sora.className}`}>Product</h4>
              <ul className={`space-y-2.5 text-sm ${outfit.className}`}>
                <li>
                  <a href="#features" className="text-slate-600 hover:text-emerald-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-slate-600 hover:text-emerald-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-slate-600 hover:text-emerald-400 transition-colors">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-600 hover:text-emerald-400 transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div>
              <h4 className={`font-semibold text-white mb-4 text-sm ${sora.className}`}>Connect</h4>
              <div className="flex gap-4">
                <a
                  href="https://twitter.com/doculens"
                  className="text-slate-600 hover:text-emerald-400 transition-colors"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://github.com/doculens"
                  className="text-slate-600 hover:text-emerald-400 transition-colors"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
                <a
                  href="https://producthunt.com/products/doculens"
                  className="text-slate-600 hover:text-emerald-400 transition-colors"
                  aria-label="Product Hunt"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.805-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.804c2.319 0 4.2 1.88 4.2 4.199 0 2.321-1.881 4.201-4.201 4.201z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/50 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className={`text-sm text-slate-700 ${outfit.className}`}>
              &copy; 2026 DocuLens. All rights reserved.
            </p>
            <div className={`flex gap-6 text-sm ${outfit.className}`}>
              <a href="#" className="text-slate-700 hover:text-emerald-400 transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-slate-700 hover:text-emerald-400 transition-colors">
                Terms of Service
              </a>
              <a href="mailto:hello@doculens.dev" className="text-slate-700 hover:text-emerald-400 transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* ================================================================
          MOBILE STICKY CTA
          ================================================================ */}
      <div className="mobile-sticky-cta fixed bottom-0 left-0 right-0 p-3 md:hidden z-40 border-t border-slate-800/50"
        style={{ background: "rgba(10, 14, 23, 0.95)", backdropFilter: "blur(12px)" }}
      >
        <a
          href="#waitlist"
          className="btn-primary block w-full py-3 text-center rounded-lg text-sm"
        >
          Join the Waitlist
        </a>
      </div>
    </main>
  );
}
