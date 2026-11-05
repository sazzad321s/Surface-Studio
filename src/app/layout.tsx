import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { ThemeProvider } from "@/components/theme-context";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "StudioSpace - Peer-to-Peer Creative Spaces & Studios",
  description: "Book photo cycs, sound stages, podcast lounges and recording suites, listed by the people who run them.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth dark`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('studio-theme');
                  if (stored === 'light') {
                    document.documentElement.classList.remove('dark');
                  } else {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#f8f9fa] dark:bg-[#111113] text-zinc-900 dark:text-zinc-100 selection:bg-amber-400 selection:text-black transition-colors duration-200">
        <ThemeProvider>
          <Suspense fallback={<div className="h-20 w-full bg-white/90 dark:bg-[#111113]/90 border-b border-zinc-200 dark:border-zinc-800/60" />}>
            <Navbar />
          </Suspense>
          <div className="flex-1">
            {children}
          </div>
          <Footer />
          <Toaster position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
