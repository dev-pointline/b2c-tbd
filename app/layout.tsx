import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "DocuLens — AI-Powered API Documentation That Updates Itself",
  description: "Stop wasting 6+ hours/week on stale docs. DocuLens reads your codebase, tracks every git push, and auto-generates accurate API documentation. Join the waitlist.",
  keywords: ["API documentation", "developer tools", "AI documentation", "auto-updating docs", "TypeScript", "Python", "REST API"],
  authors: [{ name: "DocuLens" }],
  creator: "DocuLens",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://doculens.dev",
    siteName: "DocuLens",
    title: "DocuLens — Never Manually Update API Docs Again",
    description: "AI reads your codebase, tracks git pushes, regenerates docs in seconds. Join 87+ developers on the waitlist.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "DocuLens - AI-Powered API Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DocuLens — Never Manually Update API Docs Again",
    description: "AI reads your codebase, tracks git pushes, regenerates docs in seconds. Join the waitlist.",
    images: ["/og-image.png"],
    creator: "@doculens",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "DocuLens",
              description: "AI-powered API documentation that auto-updates from your codebase",
              url: "https://doculens.dev",
              logo: "https://doculens.dev/logo.png",
              sameAs: [
                "https://twitter.com/doculens",
                "https://github.com/doculens"
              ],
              contactPoint: {
                "@type": "ContactPoint",
                email: "hello@doculens.dev",
                contactType: "customer support"
              }
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "What languages does DocuLens support?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "At launch, DocuLens supports TypeScript (Express, NestJS, Fastify) and Python (FastAPI, Flask, Django REST). Go and Ruby support is on the roadmap."
                  }
                },
                {
                  "@type": "Question",
                  name: "How accurate is AI-generated documentation?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "DocuLens targets 95%+ accuracy. For edge cases, it shows confidence scores and flags sections that may need human review."
                  }
                },
                {
                  "@type": "Question",
                  name: "When does DocuLens launch?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "DocuLens is targeting Q2 2026 for public launch. Join the waitlist for early access."
                  }
                },
                {
                  "@type": "Question",
                  name: "Is my code secure with DocuLens?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "DocuLens requests read-only GitHub access. Your code is processed securely and never stored beyond what's needed for documentation generation."
                  }
                }
              ]
            }),
          }}
        />
      </head>
      <body className="bg-white text-slate-900 antialiased">
        {children}
              <script defer src="/pipeline-telemetry.js" data-telemetry-token="628d2d14-d4d0-4ffc-8708-ce56470723c4" data-telemetry-base-url="https://hooks.pointline.dev"></script>
      </body>
    </html>
  );
}