import Image from "next/image";
import Link from "next/link";
import { Star, MapPin, SlidersHorizontal, ArrowLeft } from "lucide-react";

const studioListings = [
  {
    id: "studio-1",
    name: "The White Cyc Studio A",
    category: "Photo Cyclorama",
    location: "Downtown Arts District",
    image: "/hero.jpg",
    pricePerHour: 95,
    capacity: 25,
    rating: 4.95,
    reviews: 84,
    features: ["Infinity Wall", "Grid Lighting", "Makeup Station", "Freight Elevator"],
  },
  {
    id: "studio-2",
    name: "SOMA High-Ceiling Creative Loft",
    category: "Creative Production",
    location: "SOMA Industrial Park",
    image: "/hero2.jpg",
    pricePerHour: 120,
    capacity: 35,
    rating: 4.88,
    reviews: 62,
    features: ["Natural Daylight", "18ft Ceilings", "Props & Grip", "Lounge Area"],
  },
  {
    id: "studio-3",
    name: "The Velvet Soundstage & Podcast Suite",
    category: "Podcast & Soundstage",
    location: "Mission Creative Hub",
    image: "/hero3.jpg",
    pricePerHour: 80,
    capacity: 10,
    rating: 5.0,
    reviews: 110,
    features: ["4K Multi-Cam", "Shure SM7B Mics", "Soundproofed", "Live Streaming"],
  },
  {
    id: "studio-4",
    name: "Apex Daylight Cyc & Grip Room",
    category: "Photo Cyclorama",
    location: "Dogpatch Wharf",
    image: "/hero.jpg",
    pricePerHour: 110,
    capacity: 20,
    rating: 4.92,
    reviews: 45,
    features: ["South Facing Sun", "Aputure 600d", "C-Stands Included", "Kitchenette"],
  },
  {
    id: "studio-5",
    name: "Neon Noir Film Set & Blackout Stage",
    category: "Soundstage",
    location: "West End Studios",
    image: "/hero2.jpg",
    pricePerHour: 145,
    capacity: 40,
    rating: 4.97,
    reviews: 93,
    features: ["Full Blackout", "RGB Pixel Tubes", "Power Distribution", "Dressing Rooms"],
  },
  {
    id: "studio-6",
    name: "Echo Control Recording & Mix Room",
    category: "Music Recording",
    location: "Outer Sunset",
    image: "/hero3.jpg",
    pricePerHour: 85,
    capacity: 8,
    rating: 4.86,
    reviews: 38,
    features: ["Genelec Monitors", "Neumann U87", "Acoustically Tuned", "Vocal Booth"],
  },
];

export default function StudiosPage() {
  return (
    <div className="bg-[#f8f9fa] dark:bg-[#111113] min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb / Back button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
              Explore Creative Studios
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-2">
              Browse and instantly book verified photo cycloramas, film sound stages, and broadcast lounges.
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="text-xs font-medium text-zinc-700 dark:text-zinc-400 bg-white dark:bg-zinc-900 px-3.5 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center gap-2 shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
              Showing {studioListings.length} Spaces
            </span>
          </div>
        </div>

        {/* Studio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {studioListings.map((studio) => (
            <div
              key={studio.id}
              className="bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden group hover:border-amber-500/50 hover:shadow-xl transition duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Studio Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                  <Image
                    src={studio.image}
                    alt={studio.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#111113]/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-400 border border-zinc-200 dark:border-zinc-700/60 shadow-sm">
                    {studio.category}
                  </div>
                </div>

                {/* Studio Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      {studio.location}
                    </span>
                    <span className="flex items-center gap-1 text-zinc-800 dark:text-zinc-200">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {studio.rating} ({studio.reviews})
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {studio.name}
                  </h3>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {studio.features.map((feature) => (
                      <span
                        key={feature}
                        className="text-[11px] font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-2.5 py-0.5 rounded-md"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Price & Booking CTA */}
              <div className="px-6 pb-6 pt-3 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60">
                <div>
                  <span className="text-2xl font-black text-zinc-950 dark:text-white">${studio.pricePerHour}</span>
                  <span className="text-xs text-zinc-500 dark:text-zinc-400"> / hour</span>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs rounded-xl transition shadow-md shadow-amber-500/10 active:scale-95"
                >
                  Book Space
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
