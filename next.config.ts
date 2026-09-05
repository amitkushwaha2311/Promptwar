import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Security: Prevent clickjacking
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Security: Prevent MIME type sniffing
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Security: XSS Protection
          { key: "X-XSS-Protection", value: "1; mode=block" },
          // Security: Referrer policy
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Security: Permissions policy
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Security: HSTS
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          // Accessibility & Performance: Content Security Policy
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "connect-src 'self' https://api.github.com",
              "frame-ancestors 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
