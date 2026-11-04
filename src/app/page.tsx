import Link from "next/link";
import HeroBanner from "@/components/hero-banner";
import { 
  Sparkles, 
  Video, 
  Mic, 
  Camera, 
  Music,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

export default function Home() {
  const categories = [
    {
      title: "Photo Cycloramas",
      desc: "Seamless infinity wall studios with top-tier strobe & continuous lighting packages.",
      icon: Camera,
      count: "48 spaces",
    },
    {
      title: "Sound Stages & Film Sets",
      desc: "Acoustically soundproofed stages for high-production music videos and commercials.",
      icon: Video,
      count: "32 spaces",
    },
    {
      title: "Podcast Lounges",
      desc: "Turnkey broadcast podcast studios equipped with Shure SM7B mics and 4K cameras.",
      icon: Mic,
      count: "65 spaces",
    },
    {
      title: "Music Recording Suites",
      desc: "Tuned control rooms, vocal isolation booths, analog outboard gear, and monitoring.",
      icon: Music,
      count: "41 spaces",
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Explore & Filter",
      desc: "Browse spaces by specific equipment, ceiling height, daylight, audio acoustics, and real-time calendar availability.",
    },
    {
      step: "02",
      title: "Book Instantly",
      desc: "Transparent hourly rates with zero hidden fees. Connect directly with studio hosts and lock in your session.",
    },
    {
      step: "03",
      title: "Create Without Limits",
      desc: "Show up, check in with the host or smart lock, and start producing with studio-grade gear on day one.",
    },
  ];

  return (
    <main className="w-full">
      {/* Banner Section */}
      <HeroBanner />

      {/* Featured Studio Categories Preview */}
      <section className="py-16 border-t border-zinc-200 dark:border-zinc-800/80 bg-[#f1f2f5] dark:bg-[#0e0e11] transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm tracking-wider uppercase mb-2">
                Curated Spaces
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white tracking-tight">
                Designed for any production scope
              </h2>
            </div>
            <Link
              href="/studios"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-500 transition group"
            >
              Browse all studios
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.title}
                  href="/studios"
                  className="p-6 rounded-2xl bg-white dark:bg-[#151519] border border-zinc-200 dark:border-zinc-800/80 hover:border-amber-500/50 hover:shadow-lg dark:hover:bg-[#1a1a20] transition duration-200 group flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 mb-5 group-hover:scale-105 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-4">
                      {cat.desc}
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-zinc-400 dark:text-zinc-500 group-hover:text-amber-600 dark:group-hover:text-amber-400">
                    {cat.count}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section (Anchor link target) */}
      <section id="how-it-works" className="py-20 md:py-28 bg-[#f8f9fa] dark:bg-[#111113] border-t border-zinc-200 dark:border-zinc-800/60 scroll-mt-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-[#2a2213] text-amber-900 dark:text-[#f5a623] border border-amber-300 dark:border-[#59431b] mb-4">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Seamless Workflow
            </span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-zinc-950 dark:text-white tracking-tight mb-4">
              How SurfaceStudio Works
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg">
              We connect creators directly with studio owners, making high-end production spaces accessible and effortless to book.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div
                key={item.step}
                className="relative p-8 rounded-3xl bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="text-3xl font-black text-amber-600 dark:text-amber-500/80 mb-6 font-mono">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us Section (Anchor link target) */}
      <section id="about-us" className="py-20 md:py-28 bg-[#f1f2f5] dark:bg-[#0e0e11] border-t border-zinc-200 dark:border-zinc-800/60 scroll-mt-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-[#2a2213] text-amber-900 dark:text-[#f5a623] border border-amber-300 dark:border-[#59431b]">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                About Our Community
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 dark:text-white tracking-tight leading-tight">
                Built by creators, for the creators pushing culture forward.
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
                SurfaceStudio began with a simple frustration: independent filmmakers, photographers, and audio engineers spending hours calling commercial spaces with restrictive lock-in contracts and surprise fees.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 text-base leading-relaxed">
                Today, our peer-to-peer network gives verified creators direct access to hundreds of private soundstages, cycloramas, and broadcast lounges across the city, while giving studio hosts guaranteed bookings and protected spaces.
              </p>

              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-zinc-200 dark:border-zinc-800/80">
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">180+</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Active Studios</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">12,500+</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Sessions Booked</p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 dark:text-amber-400">4.9/5</p>
                  <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Average Rating</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-12 -mr-12 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
                <h3 className="text-2xl font-bold text-zinc-950 dark:text-white mb-4">
                  Have an empty studio between productions?
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                  Monetize your downtime. List your cyclorama, recording suite, or stage with complete control over your schedule, rates, and guest approvals.
                </p>
                <div id="host-space" className="scroll-mt-28 pt-2">
                  <Link
                    href="/register?role=host"
                    className="inline-flex items-center justify-center px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold rounded-xl transition shadow-lg shadow-amber-500/20 active:scale-95"
                  >
                    List Your Studio Space
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
