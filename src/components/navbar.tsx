"use client";

import Link from "next/link";
import Image from "next/image";
import { redirect, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { Menu, X } from "lucide-react";
import ThemeToggle from "./theme-toggle";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const isStudios = pathname.startsWith("/studios");

  const { data: session } = authClient.useSession();
  const user = session?.user;

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Explore Studios", href: "/studios" },
    { name: "How It Works", href: "/#how-it-works" },
    { name: "About Us", href: "/#about-us" },
  ];

  const profileMenuItems = [
    { name: "Dashboard", href: "/" },
    { name: "Add New Studio", href: "/add-studio" },
    { name: "My Studio Listings", href: "/my-listing" },
    { name: "My Bookings", href: "/my-bookings" },
  ];

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const isItemActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleSignOut = () => {
    authClient.signOut();
    redirect('/')
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#111113]/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800/60 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-9 w-9 flex items-center justify-center overflow-hidden rounded-lg">
              <Image
                src="/logo.png"
                alt="StudioSpace Logo"
                width={36}
                height={36}
                className="object-contain transition-transform group-hover:scale-105"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-zinc-950 dark:text-white group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
              Surface<span className="text-orange-400">Studio</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const active =
                (link.href === "/" && isHome) ||
                (link.href === "/studios" && isStudios);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors relative py-1 ${
                    active
                      ? "text-amber-600 dark:text-amber-400 font-semibold"
                      : "text-zinc-600 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white"
                  }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 dark:bg-amber-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Right Controls (Theme Toggle + Auth / Profile Dropdown) */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            {user ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="rounded-full focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition cursor-pointer"
                  aria-label="User profile menu"
                >
                  <Avatar className="h-10 w-10 border-2 border-transparent hover:border-amber-500/50 transition bg-amber-500">
                    <AvatarImage referrerPolicy="no-referrer" src={user?.image as string} />
                    <AvatarFallback className="bg-amber-500 text-zinc-950 font-bold text-sm select-none">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                </button>

                {/* Profile Dropdown Menu */}
                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2.5 w-56 rounded-2xl bg-white dark:bg-[#141416] border border-zinc-200 dark:border-zinc-800/90 shadow-2xl py-2 px-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-100">
                    <div className="px-3 py-2 text-sm font-semibold text-zinc-900 dark:text-white select-none">
                      {user?.name || "User"}
                    </div>

                    <div className="space-y-0.5">
                      {profileMenuItems.map((item) => {
                        const active = isItemActive(item.href);
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setProfileMenuOpen(false)}
                            className={`block px-3 py-2 text-sm rounded-lg transition ${
                              active
                                ? "text-amber-500 font-medium bg-amber-500/10 dark:bg-amber-500/10"
                                : "text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/60"
                            }`}
                          >
                            {item.name}
                          </Link>
                        );
                      })}

                      <button
                        type="button"
                        onClick={() => {
                          setProfileMenuOpen(false);
                          handleSignOut();
                        }}
                        className="w-full text-left px-3 py-2 text-sm rounded-lg text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800/60 transition cursor-pointer"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-5 py-2 text-sm font-medium text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 dark:text-zinc-200 dark:hover:text-white dark:bg-zinc-900/80 dark:hover:bg-zinc-800 dark:border-zinc-800/80 rounded-xl transition duration-150"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-5 py-2 text-sm font-semibold text-zinc-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition duration-150 shadow-md shadow-amber-500/20"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu & Theme Toggle Buttons */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#111113] px-4 pt-2 pb-6 space-y-3">
          {navLinks.map((link) => {
            const active =
              (link.href === "/" && isHome) ||
              (link.href === "/studios" && isStudios);

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-base font-medium ${
                  active
                    ? "bg-zinc-100 dark:bg-zinc-800/80 text-amber-600 dark:text-amber-400 font-semibold"
                    : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}

          {user ? (
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-1">
              <div className="px-3 py-2 flex items-center gap-3">
                <Avatar className="h-9 w-9 bg-amber-500">
                  <AvatarImage referrerPolicy="no-referrer" src={user?.image as string} />
                  <AvatarFallback className="bg-amber-500 text-zinc-950 font-bold text-sm">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white leading-tight">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    {user?.email}
                  </p>
                </div>
              </div>

              {profileMenuItems.map((item) => {
                const active = isItemActive(item.href);
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                      active
                        ? "text-amber-500 font-medium bg-amber-500/10"
                        : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-500 hover:bg-red-500/10 transition cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 flex flex-col gap-2 border-t border-zinc-200 dark:border-zinc-800">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 text-sm font-medium text-zinc-800 dark:text-zinc-200 bg-zinc-100 dark:bg-zinc-900 hover:bg-zinc-200 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 rounded-xl transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2.5 text-sm font-semibold text-zinc-950 bg-amber-500 hover:bg-amber-400 rounded-xl transition shadow-md shadow-amber-500/20"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
