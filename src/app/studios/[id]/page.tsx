import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Building2 } from "lucide-react";
import StudioBookingCard from "@/components/studio-booking-card";

interface StudioDetailsProps {
  params: Promise<{ id: string }>;
}

export default function StudioDetailsPage({ params }: StudioDetailsProps) {
  return (
    <Suspense fallback={<StudioDetailsSkeleton />}>
      <StudioDetailsContent params={params} />
    </Suspense>
  );
}

function StudioDetailsSkeleton() {
  return (
    <div className="bg-[#f8f9fa] dark:bg-[#111113] min-h-screen py-8 md:py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
        <div className="h-4 w-32 bg-zinc-200 dark:bg-zinc-800 rounded mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-8 space-y-6">
            <div className="aspect-16/10 w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
            <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-10 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-xl" />
            <div className="h-5 w-1/2 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-20 w-full bg-zinc-200 dark:bg-zinc-800 rounded-2xl" />
          </div>
          <div className="lg:col-span-4">
            <div className="h-96 w-full bg-zinc-200 dark:bg-zinc-800 rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

async function StudioDetailsContent({ params }: StudioDetailsProps) {
  const { id } = await params;

  let studio = null;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/studio/${id}`);
    if (res.ok) {
      studio = await res.json();
    }
  } catch (error) {
    console.error("Error loading studio details:", error);
  }

  // Fallback if not found or server is unreachable
  if (!studio) {
    return (
      <div className="bg-[#f8f9fa] dark:bg-[#111113] min-h-screen py-16 transition-colors">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-4">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">
            Studio Not Found
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6">
            We couldn&apos;t retrieve the studio with ID &quot;{id}&quot;. It may have been removed or the service is temporarily offline.
          </p>
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Explore Studios
          </Link>
        </div>
      </div>
    );
  }

  const title = studio.title || studio.name;
  const category = studio.category;
  const location = studio.location;
  const rating = studio.rating;
  const maxCapacity = studio.maxCapacity;

  const overview = studio.overview;
  const imageUrl = studio.imageUrl || studio.image;
  const userName = studio.userName;

  // Generate host initials
  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  // Amenities list with fallback
  const amenitiesList: string[] =
    Array.isArray(studio.amenities) && studio.amenities.length > 0
      ? studio.amenities
      : ["Strobe kit", "Backdrop rolls", "Wi-Fi", "Changing room", "Air conditioning"];

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#111113] min-h-screen py-8 md:py-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Back Link */}
        <div className="mb-6">
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Studios
          </Link>
        </div>

        {/* 2-Column Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Photo & Details (~7-8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Main Studio Photo Container */}
            <div className="relative aspect-16/10 w-full overflow-hidden rounded-3xl bg-zinc-200 dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 shadow-2xl">
              <Image
                src={imageUrl}
                alt={title}
                fill
                priority
                unoptimized
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover object-center"
              />
            </div>

            {/* Studio Identity (Category, Title, Meta info) */}
            <div>
              {/* Category Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-[#2a2213] text-amber-900 dark:text-[#f5a623] border border-amber-300 dark:border-[#59431b] mb-3">
                {category}
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-zinc-950 dark:text-white tracking-tight mb-2">
                {title}
              </h1>

              {/* Meta details */}
              <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                {location} • {rating} ★ • Up to {maxCapacity} people
              </p>
            </div>

            {/* Overview Section */}
            <div className="pt-2">
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white mb-2">
                Overview
              </h2>
              <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
                {overview}
              </p>
            </div>

            {/* Amenities Section */}
            <div className="pt-2">
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white mb-3">
                Amenities
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {amenitiesList.map((amenity) => (
                  <span
                    key={amenity}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-amber-50 dark:bg-[#2a2213] text-amber-900 dark:text-[#f5a623] border border-amber-300/80 dark:border-[#59431b]"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* Your Host Section */}
            <div className="pt-2">
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white mb-3">
                Your host
              </h2>
              <div className="rounded-2xl bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 p-5 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-zinc-950 font-extrabold text-sm flex items-center justify-center shrink-0">
                  {initials || "MO"}
                </div>
                <div>
                  <h3 className="font-bold text-zinc-950 dark:text-white text-base">
                    {userName}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Verified host • 24/7 support line
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="pt-2">
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white mb-3">
                Reviews
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <h4 className="font-bold text-zinc-950 dark:text-white text-sm mb-1.5">
                    Great light, easy load-in
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    The cyc wall was spotless and the host was on hand for setup. 5 ★
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 shadow-sm">
                  <h4 className="font-bold text-zinc-950 dark:text-white text-sm mb-1.5">
                    Worth the deposit
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    Clear rules and fair pricing for a full-day product shoot. 4 ★
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Widget Card (~4-5 cols) */}
          <div className="lg:col-span-4 w-full">
            <StudioBookingCard
              
              studio={studio}
            />
          </div>

        </div>

      </div>
    </div>
  );
}
