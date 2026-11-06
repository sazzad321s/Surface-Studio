import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800/80 bg-[#f8f9fa] dark:bg-[#111113] text-zinc-600 dark:text-zinc-400 text-sm transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          
          {/* Col 1: Brand & Description (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link href="/" className="flex items-center gap-3 group mb-4">
              <div className="relative h-8 w-8 flex items-center justify-center overflow-hidden rounded-lg">
                <Image
                  src="/logo.png"
                  alt="StudioSpace Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                Surface<span className="text-orange-400">Studio</span>
              </span>
            </Link>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed max-w-xs">
              A peer-to-peer home for creators to find, book and host production spaces.
            </p>
          </div>

          {/* Col 2: Quick Links (2-3 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold text-zinc-950 dark:text-white mb-4">
              Quick links
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:underline transition"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/studios"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:underline transition"
                >
                  Explore Studios
                </Link>
              </li>
              <li>
                <Link
                  href="/#how-it-works"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:underline transition"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  href="/#about-us"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:underline transition"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Categories (3 cols on lg) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-zinc-950 dark:text-white mb-4">
              Categories
            </h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/studios"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:underline transition"
                >
                  Photo Studios
                </Link>
              </li>
              <li>
                <Link
                  href="/studios"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:underline transition"
                >
                  Sound Stages
                </Link>
              </li>
              <li>
                <Link
                  href="/studios"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:underline transition"
                >
                  Podcast Rooms
                </Link>
              </li>
              <li>
                <Link
                  href="/studios"
                  className="text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-white hover:underline transition"
                >
                  Music Suites
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Socials (3 cols on lg) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold text-zinc-950 dark:text-white mb-4">
              Newsletter
            </h4>
            
            <div className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  placeholder="you@email.com"
                  className="w-full px-4 py-3 rounded-xl bg-white dark:bg-[#16161a] border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition shadow-sm"
                />
              </div>

              {/* Social links row: X, Instagram, YouTube */}
              <div className="flex items-center gap-4 text-xs font-medium text-zinc-600 dark:text-zinc-400 pt-1">
                <a
                  href="https://x.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-950 dark:hover:text-white transition flex items-center gap-1"
                  aria-label="X (formerly Twitter)"
                >
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="h-3.5 w-3.5 fill-current"
                  >
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-950 dark:hover:text-white transition hover:underline"
                >
                  Instagram
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-zinc-950 dark:hover:text-white transition hover:underline"
                >
                  YouTube
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom copyright notice */}
        <div className="mt-12 pt-6 border-t border-zinc-200/60 dark:border-zinc-800/60 text-xs text-zinc-500 dark:text-zinc-500">
          <p>© 2026 SurfaceStudio. Terms and Privacy apply.</p>
        </div>

      </div>
    </footer>
  );
}

