import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nihon Life: Live, Learn, Work",
  description: "A cozy pixel-art life sim where you learn Japanese by living it — school, konbini, trains and a frontend dev job in a little Japanese town.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Rounded JP font (graceful fallback to system JP fonts when offline) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
