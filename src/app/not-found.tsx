import type { Metadata } from "next";
import Link from "next/link";
import { Search, ArrowLeft, ArrowRight, Home } from "lucide-react";
import GoBackButton from "@/components/go-back-button";

export const metadata: Metadata = {
  title: "404 - Page Not Found | StudioSpace",
  description: "The studio, page, or listing you are looking for does not exist or has been removed.",
};

const suggestions = [
  {
    title: "Browse Studios",
    desc: "Explore cycloramas, sound stages, podcast lounges and recording suites.",
    href: "/studios",
    icon: Search,
  },
  {
    title: "Your Bookings",
    desc: "Review upcoming sessions and manage your reservations.",
    href: "/my-bookings",
    icon: ArrowRight,
  },
  {
    title: "Host a Space",
    desc: "List your empty studio between productions and earn on your schedule.",
    href: "/register?role=host",
    icon: Home,
  },
];

export default function NotFound() {
  return (
    <main className="relative overflow-hidden flex items-center justify-center py-20 md:py-28 bg-[#f8f9fa] dark:bg-[#111113] transition-colors duration-200">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-[#2a2213] text-amber-900 dark:text-[#f5a623] border border-amber-300 dark:border-[#59431b] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Error 404
        </span>

        {/* Big display number */}
        <p
          className="font-black tracking-tighter text-transparent bg-clip-text bg-linear-to-br from-amber-400 via-amber-500 to-amber-600 dark:from-amber-300 dark:via-amber-500 dark:to-amber-700 leading-none select-none text-[80px] sm:text-[128px] lg:text-[168px] mb-2 font-mono"
          aria-hidden="true"
        >
          404
        </p>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 dark:text-white tracking-tight mb-4">
          This set isn&apos;t built.
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10">
          The page you&apos;re looking for either doesn&apos;t exist, was never listed, or has wrapped production for good.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 mb-14">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition-all duration-200 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <GoBackButton />
        </div>

        {/* Suggestions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {suggestions.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group p-5 rounded-2xl bg-white dark:bg-[#151519] border border-zinc-200 dark:border-zinc-800/80 hover:border-amber-500/50 hover:shadow-lg dark:hover:bg-[#1a1a20] transition duration-200 flex flex-col gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-zinc-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {item.title}
                  </h2>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
