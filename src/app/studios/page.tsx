"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Star, 
  MapPin, 
  Users, 
  SlidersHorizontal, 
  ArrowLeft, 
  Sparkles, 
  Building2, 
  RefreshCw,
  SearchX,
  PlusCircle,
  ArrowUpDown
} from "lucide-react";

export interface Studio {
  _id: string;
  title?: string;
  name?: string;
  category: string;
  hourlyRate: string | number;
  securityDeposit?: string | number;
  maxCapacity?: string | number;
  rating?: string | number;
  reviews?: number;
  location: string;
  imageUrl?: string;
  image?: string;
  overview?: string;
  amenities?: string[];
  features?: string[];
  userName?: string;
  userEmail?: string;
}

const CATEGORIES = [
  "All",
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
  "Art & Dance Studio",
] as const;

type SortOption = "default" | "price-asc" | "price-desc" | "capacity-desc" | "rating-desc";

export default function StudiosPage() {
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const fetchStudios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/studios");
      if (!res.ok) {
        throw new Error(`Failed to fetch studios (${res.status} ${res.statusText})`);
      }
      const data = await res.json();
      setStudios(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      console.error("Error loading studios:", err);
      setError(err instanceof Error ? err.message : "Unable to connect to the studio service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, []);

  // Filter and sort studios dynamically
  const filteredAndSortedStudios = useMemo(() => {
    // 1. Filter by category
    let result = studios.filter((studio) => {
      if (selectedCategory === "All") return true;
      return studio.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase();
    });

    // 2. Sort studios
    result = [...result].sort((a, b) => {
      const priceA = Number(a.hourlyRate) || 0;
      const priceB = Number(b.hourlyRate) || 0;
      const capA = Number(a.maxCapacity) || 0;
      const capB = Number(b.maxCapacity) || 0;
      const ratingA = Number(a.rating) || 0;
      const ratingB = Number(b.rating) || 0;

      switch (sortBy) {
        case "price-asc":
          return priceA - priceB;
        case "price-desc":
          return priceB - priceA;
        case "capacity-desc":
          return capB - capA;
        case "rating-desc":
          return ratingB - ratingA;
        default:
          return 0;
      }
    });

    return result;
  }, [studios, selectedCategory, sortBy]);

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#111113] min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <Link
            href="/add-studio"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Host A Studio
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-zinc-200 dark:border-zinc-800 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-[#2a2213] text-amber-900 dark:text-[#f5a623] border border-amber-300 dark:border-[#59431b] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Verified Creative Spaces
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
              Explore Studios
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
              Browse and instantly book photo cycloramas, film sound stages, podcast lounges and music suites from verified hosts.
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 px-3 py-2 rounded-xl text-xs font-medium text-zinc-700 dark:text-zinc-300 shadow-sm">
              <ArrowUpDown className="w-3.5 h-3.5 text-amber-500" />
              <label htmlFor="sortSelect" className="text-zinc-500 dark:text-zinc-400">Sort by:</label>
              <select
                id="sortSelect"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                aria-label="Sort studios by"
                className="bg-transparent text-zinc-900 dark:text-white font-semibold focus:outline-none cursor-pointer"
              >
                <option value="default" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Featured</option>
                <option value="price-asc" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Price: Low to High</option>
                <option value="price-desc" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Price: High to Low</option>
                <option value="capacity-desc" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Capacity: High to Low</option>
                <option value="rating-desc" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">Rating: High to Low</option>
              </select>
            </div>

            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-400 bg-white dark:bg-[#16161a] px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-2 shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              {loading ? "Loading..." : `${filteredAndSortedStudios.length} Spaces`}
            </span>
          </div>
        </div>

        {/* Category Sorting / Filtering Pills */}
        <div className="py-6 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth">
          {CATEGORIES.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 active:scale-95 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20 font-bold"
                    : "bg-white dark:bg-[#16161a] text-zinc-700 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 hover:text-zinc-950 dark:hover:text-white"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden animate-pulse flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/10 w-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                    <div className="flex gap-2">
                      <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded" />
                      <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-0 flex justify-between items-center">
                  <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-8 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="mt-8 p-8 rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-center max-w-lg mx-auto">
            <SearchX className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-900 dark:text-red-300">
              Failed to load studios
            </h3>
            <p className="text-xs text-red-700 dark:text-red-400 mt-1 mb-4">
              {error}
            </p>
            <button
              type="button"
              onClick={fetchStudios}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State when Category or Filter Has 0 Studios */}
        {!loading && !error && filteredAndSortedStudios.length === 0 && (
          <div className="mt-8 py-16 px-6 rounded-3xl bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-5">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
              No studios found in {selectedCategory === "All" ? "any category" : `"${selectedCategory}"`}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2 mb-6 max-w-md mx-auto leading-relaxed">
              {selectedCategory === "All" 
                ? "There are currently no creative spaces listed in the database. Be the first host to list your space!"
                : `We don't have any active spaces listed under "${selectedCategory}" right now. Check back soon or list your own space.`}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-3">
              {selectedCategory !== "All" && (
                <button
                  type="button"
                  onClick={() => setSelectedCategory("All")}
                  className="px-5 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-200 font-semibold text-xs transition"
                >
                  View All Categories
                </button>
              )}
              <Link
                href="/add-studio"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
              >
                Add Studio in {selectedCategory === "All" ? "This Category" : selectedCategory}
              </Link>
            </div>
          </div>
        )}

        {/* Studio Cards Grid */}
        {!loading && !error && filteredAndSortedStudios.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
            {filteredAndSortedStudios.map((studio) => {
              const studioTitle = studio.title || studio.name || "Untitled Creative Studio";
              const studioImage = studio.imageUrl || studio.image || "/hero.jpg";
              const hourlyRate = studio.hourlyRate || 0;
              const amenities = studio.amenities || studio.features || [];
              const rating = studio.rating || "4.9";
              const capacity = studio.maxCapacity || "10+";

              return (
                <div
                  key={studio._id}
                  className="bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden group hover:border-amber-500/50 hover:shadow-xl transition duration-200 flex flex-col justify-between"
                >
                  <div>
                    {/* Studio Image Container */}
                    <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                      <Image
                        src={studioImage}
                        alt={studioTitle}
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {/* Category Badge */}
                      <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#111113]/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-400 border border-zinc-200 dark:border-zinc-700/60 shadow-sm">
                        {studio.category}
                      </div>

                      {/* Capacity Badge */}
                      {studio.maxCapacity && (
                        <div className="absolute top-3 right-3 bg-[#111113]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1">
                          <Users className="w-3 h-3 text-amber-400" />
                          <span>Up to {capacity}</span>
                        </div>
                      )}
                    </div>

                    {/* Studio Details */}
                    <div className="p-6">
                      {/* Location and Rating */}
                      <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                        <span className="flex items-center gap-1 font-medium truncate max-w-[65%]">
                          <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">{studio.location || "Location on request"}</span>
                        </span>
                        <span className="flex items-center gap-1 text-zinc-800 dark:text-zinc-200 font-semibold shrink-0">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {rating}
                        </span>
                      </div>

                      {/* Studio Title */}
                      <Link href={`/studios/${studio._id}`} className="block group/link">
                        <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-2 group-hover/link:text-amber-500 transition-colors line-clamp-1">
                          {studioTitle}
                        </h3>
                      </Link>

                      {/* Studio Overview Preview */}
                      {studio.overview && (
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                          {studio.overview}
                        </p>
                      )}

                      {/* Amenities Pills */}
                      {amenities.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-2">
                          {amenities.slice(0, 3).map((amenity) => (
                            <span
                              key={amenity}
                              className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-0.5 rounded-md"
                            >
                              {amenity}
                            </span>
                          ))}
                          {amenities.length > 3 && (
                            <span className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 px-1.5 py-0.5">
                              +{amenities.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Price & Booking CTA */}
                  <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60">
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-zinc-950 dark:text-white">
                          ${hourlyRate}
                        </span>
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">/ hour</span>
                      </div>
                      {studio.securityDeposit && (
                        <p className="text-[10px] text-zinc-400">
                          ${studio.securityDeposit} deposit
                        </p>
                      )}
                    </div>

                    <Link
                      href={`/studios/${studio._id}`}
                      className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/10 active:scale-95 text-center inline-block"
                    >
                      Book Space
                    </Link>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
