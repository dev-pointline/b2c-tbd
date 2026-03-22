"use client";

import { useState, useEffect, useRef, FormEvent } from "react";

// Intersection Observer hook for fade-in animations
function useInView(threshold = 0.1) {
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

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isInView };
}

// Animated section wrapper
function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref, isInView } = useInView();
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </div>
  );
}

// Email signup form component
function EmailSignupForm({ buttonText = "Join Waitlist", variant = "primary" }: { buttonText?: string; variant?: "primary" | "secondary" }) {
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
      <div className="flex items-center gap-2 text-emerald-600 font-medium">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {message}
      </div>
    );
  }

  const buttonClasses = variant === "primary"
    ? "bg-blue-600 hover:bg-blue-700 text-white"
    : "bg-slate-900 hover:bg-slate-800 text-white";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        required
        className="flex-1 px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={`px-6 py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${buttonClasses}`}
      >
        {status === "loading" ? "Joining..." : buttonText}
      </button>
      {status === "error" && <p className="text-red-500 text-sm mt-1">{message}</p>}
    </form>
  );
}

// Navigation component
function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-sm shadow-sm" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-xl text-slate-900">DocuLens</span>
          </a>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-slate-600 hover:text-slate-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-slate-600 hover:text-slate-900 transition-colors">How it Works</a>
            <a href="#pricing" className="text-slate-600 hover:text-slate-900 transition-colors">Pricing</a>
            <a href="#faq" className="text-slate-600 hover:text-slate-900 transition-colors">FAQ</a>
            <a href="#waitlist" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
              Join Waitlist
            </a>
          </div>

          <button 
            className="md:hidden p-2"
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

        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-100">
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-slate-600 hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>How it Works</a>
              <a href="#pricing" className="text-slate-600 hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
              <a href="#faq" className="text-slate-600 hover:text-slate-900" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
              <a href="#waitlist" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium text-center" onClick={() => setIsMobileMenuOpen(false)}>
                Join Waitlist
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

// Code animation component for hero
function CodeAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % 3);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid md:grid-cols-2 gap-4 w-full max-w-4xl mx-auto">
      {/* Code Editor Side */}
      <div className="bg-slate-900 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-4 py-3 bg-slate-800">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-slate-400 text-sm font-mono ml-2">users.controller.ts</span>
        </div>
        <div className="p-4 font-mono text-sm leading-relaxed">
          <div className="text-slate-500">{"// User endpoint"}</div>
          <div>
            <span className="text-purple-400">@Get</span>
            <span className="text-slate-300">(</span>
            <span className="text-emerald-400">&apos;/users/:id&apos;</span>
            <span className="text-slate-300">)</span>
          </div>
          <div>
            <span className="text-blue-400">async </span>
            <span className="text-yellow-300">getUser</span>
            <span className="text-slate-300">(</span>
          </div>
          <div className="pl-4">
            <span className="text-orange-400">@Param</span>
            <span className="text-slate-300">(</span>
            <span className="text-emerald-400">&apos;id&apos;</span>
            <span className="text-slate-300">) </span>
            <span className="text-slate-300">id: </span>
            <span className="text-blue-400">string</span>
            <span className="text-slate-300">,</span>
          </div>
          <div className={`pl-4 rounded transition-all duration-500 ${step >= 1 ? "bg-emerald-500/20" : ""}`}>
            <span className="text-orange-400">@Query</span>
            <span className="text-slate-300">(</span>
            <span className="text-emerald-400">&apos;includeEmail&apos;</span>
            <span className="text-slate-300">) </span>
            <span className="text-slate-300">email</span>
            <span className={`text-pink-400 transition-all ${step >= 1 ? "opacity-100" : "opacity-0"}`}>?</span>
            <span className="text-slate-300">: </span>
            <span className="text-blue-400">boolean</span>
          </div>
          <div className="text-slate-300">{")"}</div>
        </div>
        {step >= 1 && (
          <div className="px-4 pb-3 flex items-center gap-2 text-emerald-400 text-xs">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>Pushed 3 seconds ago</span>
          </div>
        )}
      </div>

      {/* Docs Side */}
      <div className="bg-white rounded-xl overflow-hidden shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
          <span className="font-semibold text-slate-700">GET /users/:id</span>
          <span className="text-xs px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full">200 OK</span>
        </div>
        <div className="p-4 text-sm">
          <div className="mb-4">
            <h4 className="font-semibold text-slate-700 mb-2">Parameters</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded">
                <code className="text-blue-600">id</code>
                <span className="text-xs px-2 py-0.5 bg-red-100 text-red-700 rounded">required</span>
              </div>
              <div className={`flex items-center justify-between p-2 rounded transition-all duration-500 ${step >= 2 ? "bg-emerald-50 ring-2 ring-emerald-200" : "bg-slate-50"}`}>
                <code className="text-blue-600">includeEmail</code>
                <span className={`text-xs px-2 py-0.5 rounded transition-all duration-500 ${step >= 2 ? "bg-emerald-100 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                  {step >= 2 ? "optional" : "required"}
                </span>
              </div>
            </div>
          </div>
          {step >= 2 && (
            <div className="flex items-center gap-2 text-emerald-600 text-xs mt-4 animate-fade-in-up">
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

// Main Page Component
export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <AnimatedSection>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              Launching Q2 2026
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
              Never Manually Update<br />API Docs Again
            </h1>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
              DocuLens reads your codebase, tracks every git push, and regenerates accurate documentation in seconds — so your team ships code instead of fixing stale README files.
            </p>
            <div className="flex flex-col items-center gap-4">
              <EmailSignupForm buttonText="Join the Waitlist" />
              <p className="text-sm text-slate-500">Be one of the first 100 teams to get early access pricing</p>
            </div>
          </AnimatedSection>

          <AnimatedSection className="mt-16">
            <CodeAnimation />
          </AnimatedSection>
        </div>
      </section>

      {/* Credibility Bar */}
      <section className="py-12 px-4 sm:px-6 border-y border-slate-100 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <p className="text-center text-slate-600 mb-8">
              <span className="font-semibold">Built for</span> development teams shipping APIs faster than they can document them
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                <span className="font-semibold">GitHub</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8 text-blue-600" viewBox="0 0 24 24" fill="currentColor"><path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 0 1 1.306.34v2.458a3.95 3.95 0 0 0-.643-.361 5.093 5.093 0 0 0-.717-.26 5.453 5.453 0 0 0-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 0 0-.623.242c-.17.104-.3.229-.393.374a.888.888 0 0 0-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 0 1-1.012 1.085 4.38 4.38 0 0 1-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 0 1-1.84-.164 5.544 5.544 0 0 1-1.512-.493v-2.63a5.033 5.033 0 0 0 3.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 0 0-.074-1.089 2.12 2.12 0 0 0-.537-.5 5.597 5.597 0 0 0-.807-.444 27.72 27.72 0 0 0-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 0 1 1.47-.629 7.536 7.536 0 0 1 1.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z"/></svg>
                <span className="font-semibold">TypeScript</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8 text-yellow-500" viewBox="0 0 24 24" fill="currentColor"><path d="M14.25.18l.9.2.73.26.59.3.45.32.34.34.25.34.16.33.1.3.04.26.02.2-.01.13V8.5l-.05.63-.13.55-.21.46-.26.38-.3.31-.33.25-.35.19-.35.14-.33.1-.3.07-.26.04-.21.02H8.77l-.69.05-.59.14-.5.22-.41.27-.33.32-.27.35-.2.36-.15.37-.1.35-.07.32-.04.27-.02.21v3.06H3.17l-.21-.03-.28-.07-.32-.12-.35-.18-.36-.26-.36-.36-.35-.46-.32-.59-.28-.73-.21-.88-.14-1.05-.05-1.23.06-1.22.16-1.04.24-.87.32-.71.36-.57.4-.44.42-.33.42-.24.4-.16.36-.1.32-.05.24-.01h.16l.06.01h8.16v-.83H6.18l-.01-2.75-.02-.37.05-.34.11-.31.17-.28.25-.26.31-.23.38-.2.44-.18.51-.15.58-.12.64-.1.71-.06.77-.04.84-.02 1.27.05zm-6.3 1.98l-.23.33-.08.41.08.41.23.34.33.22.41.09.41-.09.33-.22.23-.34.08-.41-.08-.41-.23-.33-.33-.22-.41-.09-.41.09zm13.09 3.95l.28.06.32.12.35.18.36.27.36.35.35.47.32.59.28.73.21.88.14 1.04.05 1.23-.06 1.23-.16 1.04-.24.86-.32.71-.36.57-.4.45-.42.33-.42.24-.4.16-.36.09-.32.05-.24.02-.16-.01h-8.22v.82h5.84l.01 2.76.02.36-.05.34-.11.31-.17.29-.25.25-.31.24-.38.2-.44.17-.51.15-.58.13-.64.09-.71.07-.77.04-.84.01-1.27-.04-1.07-.14-.9-.2-.73-.25-.59-.3-.45-.33-.34-.34-.25-.34-.16-.33-.1-.3-.04-.25-.02-.2.01-.13v-5.34l.05-.64.13-.54.21-.46.26-.38.3-.32.33-.24.35-.2.35-.14.33-.1.3-.06.26-.04.21-.02.13-.01h5.84l.69-.05.59-.14.5-.21.41-.28.33-.32.27-.35.2-.36.15-.36.1-.35.07-.32.04-.28.02-.21V6.07h2.09l.14.01zm-6.47 14.25l-.23.33-.08.41.08.41.23.33.33.23.41.08.41-.08.33-.23.23-.33.08-.41-.08-.41-.23-.33-.33-.23-.41-.08-.41.08z"/></svg>
                <span className="font-semibold">Python</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8 text-green-500" viewBox="0 0 24 24" fill="currentColor"><path d="M24 18.588a1.529 1.529 0 01-1.895-.72l-3.45-4.771-.5-.667-4.003 5.444a1.466 1.466 0 01-1.802.708l5.158-6.92-4.798-6.251a1.595 1.595 0 011.9.666l3.576 4.83 3.596-4.81a1.435 1.435 0 011.788-.668L21.708 7.9l-2.522 3.283a.666.666 0 000 .994l4.804 6.412zM.002 11.576l.42-2.075c1.154-4.103 5.858-5.81 9.094-3.27 1.895 1.489 2.368 3.597 2.275 5.973H1.116C.943 16.447 4.005 19.009 7.92 17.7a4.078 4.078 0 002.582-2.876c.207-.666.548-.78 1.174-.588a5.417 5.417 0 01-2.589 3.957 6.272 6.272 0 01-7.306-.933 6.575 6.575 0 01-1.64-3.858c0-.235-.08-.455-.134-.666A88.33 88.33 0 010 11.577zm1.127-.286h9.654c-.06-3.076-2.001-5.258-4.59-5.278-2.882-.04-4.944 2.094-5.071 5.264z"/></svg>
                <span className="font-semibold">Express</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-8 h-8 text-teal-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.375 0 0 5.375 0 12c0 6.627 5.375 12 12 12 6.626 0 12-5.373 12-12 0-6.625-5.373-12-12-12zm-.624 21.62v-7.528H7.19L13.203 2.38v7.528h4.029L11.376 21.62z"/></svg>
                <span className="font-semibold">FastAPI</span>
              </div>
            </div>
            <p className="text-center text-sm text-slate-500 mt-8 italic">
              &ldquo;47% of developers cite poor documentation as their #1 API frustration&rdquo; — Postman State of the API 2025
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-4">
              Your Docs Are Lying to Your Users
            </h2>
            <p className="text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto">
              Every stale doc line costs you time, money, and trust
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">📉</span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">The Documentation Drift</h3>
                <p className="text-slate-600">
                  Your API evolves daily, but docs update monthly. Your code says <code className="bg-slate-100 px-1 rounded">userId</code> is optional — your docs say required. Developers waste hours debugging problems that shouldn&apos;t exist.
                </p>
                <p className="text-sm text-slate-500 mt-4 font-medium">
                  Average: 6+ hours/week on doc maintenance
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🎫</span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">The Support Ticket Avalanche</h3>
                <p className="text-slate-600">
                  &ldquo;This endpoint doesn&apos;t work like the docs say.&rdquo; Sound familiar? Every wrong parameter type, every missing example, every outdated response schema becomes a support ticket your team has to answer.
                </p>
                <p className="text-sm text-slate-500 mt-4 font-medium">
                  Cost: ~$23,000/year in wasted developer time
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">🤝</span>
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">The Trust Tax</h3>
                <p className="text-slate-600">
                  When integration is painful, developers choose your competitor. Your code might be beautiful, but if docs are wrong, nobody sees it. Bad docs = 30% lower API adoption rates.
                </p>
                <p className="text-sm text-slate-500 mt-4 font-medium">
                  Lost: 2-3 customers/year from doc confusion
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Before/After Section */}
      <section className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12">
              From Manual Chaos to Automatic Sync
            </h2>
          </AnimatedSection>

          <div className="space-y-8">
            <AnimatedSection>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-6 bg-red-50 border-b md:border-b-0 md:border-r border-red-100">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-red-500 font-semibold">Before</span>
                    </div>
                    <p className="text-slate-700">
                      You push a breaking change at 4pm. Three weeks later, a customer discovers the docs are wrong. They email support. Support pings engineering. Engineering updates Notion. The cycle repeats infinitely.
                    </p>
                  </div>
                  <div className="p-6 bg-emerald-50">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-emerald-600 font-semibold">After</span>
                    </div>
                    <p className="text-slate-700">
                      You push a breaking change at 4pm. DocuLens detects the diff, regenerates the affected docs, and publishes within 5 minutes. The customer never sees wrong information. Support ticket avoided.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="p-6 bg-red-50 border-b md:border-b-0 md:border-r border-red-100">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-red-500 font-semibold">Before</span>
                    </div>
                    <p className="text-slate-700">
                      New engineer joins and asks &ldquo;how do I add a new endpoint to our docs?&rdquo; Answer: &ldquo;Copy this other page, change the fields, hope you don&apos;t miss anything, then ask Sarah to review it.&rdquo;
                    </p>
                  </div>
                  <div className="p-6 bg-emerald-50">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-emerald-600 font-semibold">After</span>
                    </div>
                    <p className="text-slate-700">
                      New engineer pushes code. DocuLens generates the endpoint docs automatically — with curl, JavaScript, and Python examples. No tribal knowledge required. Sarah reviews code, not docs.
                    </p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-4">
              Documentation That Writes Itself
            </h2>
            <p className="text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto">
              DocuLens connects to your codebase and keeps docs perfectly in sync
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatedSection>
              <div className="bg-white p-6 rounded-xl border border-slate-200 h-full hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-xl">🔄</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Real-Time Git Sync</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Push to main, docs update in minutes. Every commit triggers a re-parse of changed files — no manual triggers needed.
                </p>
                <p className="text-blue-600 text-sm font-medium">Designed to update within 5 minutes of push</p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-white p-6 rounded-xl border border-slate-200 h-full hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-xl">💻</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">AI-Generated Code Examples</h3>
                <p className="text-slate-600 text-sm mb-3">
                  For every endpoint, get working examples in curl, JavaScript, and Python. Not templates — actual examples using your real parameter names.
                </p>
                <p className="text-purple-600 text-sm font-medium">Copy, paste, it works the first time</p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-white p-6 rounded-xl border border-slate-200 h-full hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-xl">🎯</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Type-Aware Parsing</h3>
                <p className="text-slate-600 text-sm mb-3">
                  DocuLens understands your TypeScript types, Python decorators, and JSDoc comments. It knows <code className="bg-slate-100 px-1 rounded text-xs">userId?</code> means optional.
                </p>
                <p className="text-emerald-600 text-sm font-medium">Native support for NestJS, FastAPI, Flask</p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-white p-6 rounded-xl border border-slate-200 h-full hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-xl">📊</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Change Detection Diffs</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Every update includes a visual diff: what was added, removed, or modified. Review changes before publishing.
                </p>
                <p className="text-amber-600 text-sm font-medium">Catch issues before customers do</p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-white p-6 rounded-xl border border-slate-200 h-full hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-rose-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-xl">🔍</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Instant Search</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Semantic search across your entire API surface. Type &ldquo;how do I create a user?&rdquo; and find the right endpoint immediately.
                </p>
                <p className="text-rose-600 text-sm font-medium">No more Ctrl+F through 47 Notion pages</p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-white p-6 rounded-xl border border-slate-200 h-full hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-xl">✨</span>
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-2">Beautiful, Hosted Docs</h3>
                <p className="text-slate-600 text-sm mb-3">
                  Clean, responsive design. Syntax highlighting. Dark mode. Custom branding. Ship docs that look as good as your code.
                </p>
                <p className="text-indigo-600 text-sm font-medium">Zero design work required</p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
              How DocuLens Works
            </h2>
            <p className="text-lg text-slate-400 text-center mb-12 max-w-2xl mx-auto">
              From zero to auto-updating docs in under 3 minutes
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  1
                </div>
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔗</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Connect Your Repository</h3>
                <p className="text-slate-400">
                  One-click GitHub OAuth — read-only access. Connect your repo in under 60 seconds. We never write to your repository.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  2
                </div>
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-bold text-xl mb-3">AI Parses Your Code</h3>
                <p className="text-slate-400">
                  Our AI reads your actual source files — not OpenAPI specs. It extracts endpoints, parameters, return types, and docstrings.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                  3
                </div>
                <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">♻️</span>
                </div>
                <h3 className="font-bold text-xl mb-3">Docs Stay Updated Forever</h3>
                <p className="text-slate-400">
                  Every push to main triggers incremental updates. Changed files get re-parsed, docs regenerate. Never more than 5 minutes stale.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-4">
              Built for Teams Like Yours
            </h2>
            <p className="text-lg text-slate-600 text-center mb-12 max-w-2xl mx-auto">
              Here&apos;s how different teams would use DocuLens
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8">
            <AnimatedSection>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">👨‍💻</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">The Startup CTO</h3>
                    <p className="text-sm text-slate-500">Series A, 8 engineers</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Your team ships 15 API changes per week. You used to spend Friday afternoons updating Notion docs. Now you review AI-generated diffs in 5 minutes and approve. You reclaimed 4 hours/week to actually build product.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-100 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">🎯</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">DevRel Lead</h3>
                    <p className="text-sm text-slate-500">Public API company</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Integration success rate is your north star. With DocuLens, docs are always accurate, code examples always work, and support ticket volume dropped because developers actually trust what they read.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100 h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-xl">⭐</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">OSS Maintainer</h3>
                    <p className="text-sm text-slate-500">15K GitHub stars</p>
                  </div>
                </div>
                <p className="text-slate-700 text-sm leading-relaxed">
                  Contributors add features faster than you can document them. DocuLens auto-generates docs for every PR merge. You focus on reviewing code quality, not README accuracy.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium mb-4">
                Planned Launch Pricing
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                Start free with a 14-day trial. No credit card required.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <AnimatedSection>
              <div className="bg-white rounded-2xl border border-slate-200 p-8 h-full flex flex-col">
                <h3 className="font-bold text-xl text-slate-900 mb-2">Starter</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-slate-900">$49</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <p className="text-slate-600 text-sm mb-6">Perfect for solo developers and small projects</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    1 repository
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Daily sync (24-hour updates)
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    AI-generated examples (3 languages)
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Basic search
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Community support
                  </li>
                </ul>
                <a href="#waitlist" className="block w-full py-3 text-center border-2 border-slate-900 text-slate-900 rounded-lg font-semibold hover:bg-slate-900 hover:text-white transition-colors">
                  Join Waitlist
                </a>
              </div>
            </AnimatedSection>

            {/* Pro */}
            <AnimatedSection>
              <div className="bg-white rounded-2xl border-2 border-blue-500 p-8 h-full flex flex-col relative shadow-lg">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-sm font-semibold rounded-full">
                  Most Popular
                </div>
                <h3 className="font-bold text-xl text-slate-900 mb-2">Pro</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-slate-900">$99</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <p className="text-slate-600 text-sm mb-6">For teams who ship fast and need real-time docs</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    5 repositories
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Real-time sync (5-minute updates)
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    AI examples in 6 languages
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Semantic search + change diffs
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Custom branding
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Priority email support
                  </li>
                </ul>
                <a href="#waitlist" className="block w-full py-3 text-center bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  Join Waitlist
                </a>
              </div>
            </AnimatedSection>

            {/* Agency */}
            <AnimatedSection>
              <div className="bg-white rounded-2xl border border-slate-200 p-8 h-full flex flex-col">
                <h3 className="font-bold text-xl text-slate-900 mb-2">Agency</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-bold text-slate-900">$199</span>
                  <span className="text-slate-500">/month</span>
                </div>
                <p className="text-slate-600 text-sm mb-6">For agencies managing multiple client APIs</p>
                <ul className="space-y-3 mb-8 flex-1">
                  <li className="flex items-center gap-2 text-sm text-slate-700 font-medium">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Unlimited repositories
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Real-time sync
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    All Pro features
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    White-label documentation
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Team collaboration (10 seats)
                  </li>
                  <li className="flex items-center gap-2 text-sm text-slate-700">
                    <svg className="w-5 h-5 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Dedicated Slack support
                  </li>
                </ul>
                <a href="#waitlist" className="block w-full py-3 text-center border-2 border-slate-900 text-slate-900 rounded-lg font-semibold hover:bg-slate-900 hover:text-white transition-colors">
                  Join Waitlist
                </a>
              </div>
            </AnimatedSection>
          </div>

          {/* Pricing FAQ */}
          <AnimatedSection>
            <div className="mt-16 max-w-2xl mx-auto">
              <h3 className="font-bold text-lg text-slate-900 mb-6 text-center">Common Questions</h3>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-1">When will DocuLens launch?</h4>
                  <p className="text-slate-600 text-sm">We&apos;re targeting Q2 2026 for public launch. Early access users will get hands-on access in 4-6 weeks.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-1">Will there be a free trial?</h4>
                  <p className="text-slate-600 text-sm">Yes — all plans include a 14-day free trial with full access. No credit card required to start.</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-slate-200">
                  <h4 className="font-semibold text-slate-900 mb-1">Can I cancel anytime?</h4>
                  <p className="text-slate-600 text-sm">Absolutely. No contracts, no annual commitments required. Cancel with one click, export your data.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-12">
              Frequently Asked Questions
            </h2>
          </AnimatedSection>

          <div className="space-y-6">
            <AnimatedSection>
              <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-slate-900">
                  What languages and frameworks does DocuLens support?
                  <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-6 pb-6 text-slate-600">
                  At launch, we support TypeScript (Express, NestJS, Fastify) and Python (FastAPI, Flask, Django REST). Go and Ruby support is on the roadmap based on demand from our early users.
                </div>
              </details>
            </AnimatedSection>

            <AnimatedSection>
              <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-slate-900">
                  How accurate is the AI-generated documentation?
                  <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-6 pb-6 text-slate-600">
                  Our goal is 95%+ accuracy out of the box. For complex edge cases, DocuLens shows confidence scores and flags sections that may need human review. You can always edit any generated content before publishing.
                </div>
              </details>
            </AnimatedSection>

            <AnimatedSection>
              <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-slate-900">
                  Is my code secure?
                  <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-6 pb-6 text-slate-600">
                  DocuLens requests read-only GitHub access. Your code is processed securely and never stored beyond what&apos;s needed for documentation generation. We never access other repositories in your organization.
                </div>
              </details>
            </AnimatedSection>

            <AnimatedSection>
              <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-slate-900">
                  How is this different from Swagger/OpenAPI?
                  <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-6 pb-6 text-slate-600">
                  Swagger requires you to maintain a separate spec file that can drift from your code. DocuLens reads your actual source code — no additional files to keep in sync. If your code changes, your docs change automatically.
                </div>
              </details>
            </AnimatedSection>

            <AnimatedSection>
              <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-slate-900">
                  What if I already use ReadMe.io or GitBook?
                  <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-6 pb-6 text-slate-600">
                  DocuLens can export to standard formats like Markdown and OpenAPI. Many teams use DocuLens to auto-generate content, then publish to their existing documentation platform. Or switch entirely — your choice.
                </div>
              </details>
            </AnimatedSection>

            <AnimatedSection>
              <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-slate-900">
                  How fast do docs update after I push code?
                  <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-6 pb-6 text-slate-600">
                  Pro and Agency plans update within 5 minutes of a git push. Starter plan updates within 24 hours. All updates are automatic — no manual triggers needed.
                </div>
              </details>
            </AnimatedSection>

            <AnimatedSection>
              <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-slate-900">
                  Can my whole team access the documentation?
                  <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-6 pb-6 text-slate-600">
                  Starter and Pro plans include unlimited viewers. Agency plans include 10 editor seats for teams who want collaborative review workflows before publishing.
                </div>
              </details>
            </AnimatedSection>

            <AnimatedSection>
              <details className="group bg-white border border-slate-200 rounded-xl overflow-hidden">
                <summary className="flex items-center justify-between p-6 cursor-pointer font-semibold text-slate-900">
                  When does DocuLens launch?
                  <svg className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                </summary>
                <div className="px-6 pb-6 text-slate-600">
                  We&apos;re targeting Q2 2026 for public launch. Join the waitlist to get early access — we&apos;re onboarding the first 100 teams in the coming weeks.
                </div>
              </details>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="waitlist" className="py-20 px-4 sm:px-6 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <AnimatedSection>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stop Wasting Time on Documentation That Goes Stale
            </h2>
            <p className="text-lg text-blue-100 mb-8">
              Join 87+ developers already on the waitlist. Early access opens in weeks, not months.
            </p>
            <div className="flex flex-col items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl w-full max-w-md">
                <EmailSignupForm buttonText="Get Early Access" variant="secondary" />
              </div>
              <p className="text-sm text-blue-200">
                We&apos;re building DocuLens for teams exactly like yours. Lock in launch pricing before we raise prices.
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 bg-slate-900 text-slate-400">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="font-bold text-xl text-white">DocuLens</span>
              </div>
              <p className="text-sm max-w-xs">
                DocuLens is building the future of API documentation — where your code is the source of truth and docs update themselves.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Connect</h4>
              <div className="flex gap-4">
                <a href="https://twitter.com/doculens" className="hover:text-white transition-colors" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://github.com/doculens" className="hover:text-white transition-colors" aria-label="GitHub">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                </a>
                <a href="https://producthunt.com/products/doculens" className="hover:text-white transition-colors" aria-label="Product Hunt">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.604 8.4h-3.405V12h3.405c.995 0 1.801-.806 1.801-1.801 0-.993-.805-1.799-1.801-1.799zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.804c2.319 0 4.2 1.88 4.2 4.199 0 2.321-1.881 4.201-4.201 4.201z"/></svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm">&copy; 2026 DocuLens. All rights reserved.</p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="mailto:hello@doculens.dev" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-sm border-t border-slate-200 md:hidden z-40">
        <a href="#waitlist" className="block w-full py-3 text-center bg-blue-600 text-white rounded-lg font-semibold">
          Join the Waitlist
        </a>
      </div>
    </main>
  );
}