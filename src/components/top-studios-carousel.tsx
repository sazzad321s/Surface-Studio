"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MapPin, RefreshCw, Sparkles, Star } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface TopStudio {
  _id: string;
  title?: string;
  name?: string;
  category: string;
  hourlyRate: string | number;
  maxCapacity?: string | number;
  rating?: string | number;
  location: string;
  imageUrl?: string;
  image?: string;
  overview?: string;
  amenities?: string[];
  features?: string[];
}

export default function TopStudiosCarousel() {
  const [studios, setStudios] = useState<TopStudio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTopStudios = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/top-studios`);
      if (!res.ok) {
        throw new Error(`Failed to fetch top studios (${res.status} ${res.statusText})`);
      }
      const data = await res.json();
      setStudios((Array.isArray(data) ? data : []).slice(0, 6));
    } catch (err: unknown) {
      console.error("Error loading top studios:", err);
      setError(err instanceof Error ? err.message : "Unable to connect to the studio service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopStudios();
  }, []);

  return (
    <section className="py-16 border-t border-zinc-200 dark:border-zinc-800/80 bg-[#f8f9fa] dark:bg-[#111113] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-100 dark:bg-[#2a2213] text-amber-900 dark:text-[#f5a623] border border-amber-300 dark:border-[#59431b] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Top Rated Studios
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-950 dark:text-white tracking-tight">
              Highest rated spaces by our creators
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

        {/* Loading State */}
        {loading && (
          <div className="flex gap-4 overflow-hidden">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="min-w-0 shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-1/3 pl-4 first:pl-0"
              >
                <div className="bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden animate-pulse">
                  <div className="aspect-16/10 w-full bg-zinc-200 dark:bg-zinc-800" />
                  <div className="p-6 space-y-4">
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                    <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                    <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="p-8 rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-center max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-red-900 dark:text-red-300">
              Failed to load top studios
            </h3>
            <p className="text-xs text-red-700 dark:text-red-400 mt-1 mb-4">{error}</p>
            <button
              type="button"
              onClick={fetchTopStudios}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        )}

        {/* Top Studios Carousel */}
        {!loading && !error && studios.length > 0 && (
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: studios.length > 3,
              }}
            >
              <CarouselContent>
                {studios.map((studio) => {
                  const studioTitle = studio.title || studio.name || "Untitled Creative Studio";
                  const studioImage = studio.imageUrl || studio.image || "/hero.jpg";
                  const hourlyRate = studio.hourlyRate || 0;
                  const rating = studio.rating || "4.9";
                  const amenities = studio.amenities || studio.features || [];

                  return (
                    <CarouselItem
                      key={studio._id}
                      className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                    >
                      <div className="h-full bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden group hover:border-amber-500/50 hover:shadow-xl transition duration-200 flex flex-col justify-between">
                        <div>
                          {/* Studio Image */}
                          <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                            <Image
                              src={studioImage}
                              alt={studioTitle}
                              fill
                              unoptimized
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#111113]/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-400 border border-zinc-200 dark:border-zinc-700/60 shadow-sm">
                              {studio.category}
                            </div>
                            <div className="absolute top-3 right-3 bg-[#111113]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {rating}
                            </div>
                          </div>

                          {/* Studio Details */}
                          <div className="p-6">
                            <span className="flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2 truncate">
                              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              <span className="truncate">{studio.location || "Location on request"}</span>
                            </span>

                            <Link href={`/studios/${studio._id}`} className="block group/link">
                              <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-2 group-hover/link:text-amber-500 transition-colors line-clamp-1">
                                {studioTitle}
                              </h3>
                            </Link>

                            {studio.overview && (
                              <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                                {studio.overview}
                              </p>
                            )}

                            {amenities.length > 0 && (
                              <div className="flex flex-wrap gap-1.5">
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

                        {/* Price & CTA */}
                        <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-zinc-950 dark:text-white">
                              ${hourlyRate}
                            </span>
                            <span className="text-xs text-zinc-500 dark:text-zinc-400">/ hour</span>
                          </div>
                          <Link
                            href={`/studios/${studio._id}`}
                            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/10 active:scale-95 text-center inline-block"
                          >
                            Book Space
                          </Link>
                        </div>
                      </div>
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              <CarouselPrevious className="-left-4 sm:-left-6 lg:-left-12" />
              <CarouselNext className="-right-4 sm:-right-6 lg:-right-12" />
            </Carousel>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && studios.length === 0 && (
          <div className="py-16 px-6 rounded-3xl bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 text-center max-w-xl mx-auto shadow-sm">
            <h3 className="text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
              No top studios available yet
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 mb-6">
              Check back soon for the highest rated spaces in the network.
            </p>
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
            >
              Browse All Studios
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
