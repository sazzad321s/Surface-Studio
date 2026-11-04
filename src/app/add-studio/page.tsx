"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  ArrowLeft, 
  Upload, 
  DollarSign, 
  Users, 
  MapPin, 
  Layers, 
  FileText, 
  CheckSquare, 
  User, 
  Mail, 
  Sparkles,
  Check
} from "lucide-react";

const CATEGORIES = [
  "Photo Studio",
  "Film Stage",
  "Podcast Lounge",
  "Music Suite",
  "Workshop",
  "Art & Dance Studio",
];

const AVAILABLE_AMENITIES = [
  "Cyclorama / Infinity Wall",
  "Soundproofed Stage",
  "Lighting Grid & Softboxes",
  "4K Cameras & Broadcast Mics",
  "High Ceilings (15ft+)",
  "Dressing & Makeup Room",
  "Central Air Conditioning",
  "High-Speed Wi-Fi (Gigabit)",
  "Freight Elevator Access",
  "Client Lounge Area",
  "Kitchenette & Coffee Bar",
  "Natural Daylight / Blackout Curtains",
];

export default function AddStudioPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "Photo Studio",
    hourlyRate: "",
    securityDeposit: "",
    maxCapacity: "",
    location: "",
    imageUrl: "",
    overview: "",
    // Read-only user details (will be populated from your Auth / Session context)
    userName: "Alex Johnson",
    userEmail: "alex@studiospace.com",
    amenities: ["Lighting Grid & Softboxes", "High-Speed Wi-Fi (Gigabit)"] as string[],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<typeof formData | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists
          ? prev.amenities.filter((item) => item !== amenity)
          : [...prev.amenities, amenity],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // -------------------------------------------------------------
      // TO SUBMIT TO MONGODB:
      // Hook your API endpoint or Server Action here, e.g.:
      //
      // const res = await fetch("/api/studios", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(formData),
      // });
      // const data = await res.json();
      //
      // Upon successful save:
      // 1. Show success toast (e.g. toast.success("Studio added successfully!"))
      // 2. router.push("/my-listings");
      // -------------------------------------------------------------
      console.log("Ready to submit to MongoDB:", formData);
      setSubmittedData(formData);
    } catch (error) {
      console.error("Failed to submit studio:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#111113] min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Studios
          </Link>
        </div>

        {/* Page Heading Card */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-[#2a2213] text-amber-900 dark:text-[#f5a623] border border-amber-300 dark:border-[#59431b] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            Host Portal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
            Add New Studio
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-1.5">
            Create a detailed listing for your creative space to start hosting productions.
          </p>
        </div>

        {/* Submission Confirmation Banner (Demo helper) */}
        {submittedData && (
          <div className="mb-8 p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 flex items-start gap-3">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <p className="font-semibold text-sm">Form ready for MongoDB!</p>
              <p className="text-xs text-emerald-800 dark:text-emerald-400/90 mt-1">
                Data prepared for collection insert: <strong>{submittedData.title || "Untitled Studio"}</strong> ({submittedData.category}) — ${submittedData.hourlyRate}/hr.
              </p>
            </div>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Basic Studio Information */}
          <div className="bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white mb-6 flex items-center gap-2">
              <Layers className="w-5 h-5 text-amber-500" />
              General Studio Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Title */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Studio Title <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. SOMA Daylight Cyclorama & Sound Stage"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition text-sm"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Category <span className="text-amber-500">*</span>
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition text-sm cursor-pointer"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location / Address */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-500" />
                  Location / Address <span className="text-amber-500">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g. 742 Harrison St, San Francisco, CA"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Pricing & Capacity */}
          <div className="bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-amber-500" />
              Pricing & Capacity
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Hourly Rate */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Hourly Rate ($) <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    min="1"
                    name="hourlyRate"
                    required
                    value={formData.hourlyRate}
                    onChange={handleInputChange}
                    placeholder="85"
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition text-sm"
                  />
                </div>
              </div>

              {/* Security Deposit */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Security Deposit ($) <span className="text-amber-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-zinc-400 font-medium">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    name="securityDeposit"
                    required
                    value={formData.securityDeposit}
                    onChange={handleInputChange}
                    placeholder="150"
                    className="w-full pl-8 pr-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition text-sm"
                  />
                </div>
              </div>

              {/* Max Capacity */}
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-amber-500" />
                  Max Capacity <span className="text-amber-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  name="maxCapacity"
                  required
                  value={formData.maxCapacity}
                  onChange={handleInputChange}
                  placeholder="25"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition text-sm"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Studio Image (URL / imgbb / postimage) */}
          <div className="bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white mb-6 flex items-center gap-2">
              <Upload className="w-5 h-5 text-amber-500" />
              Studio Media & Photos
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
                  Image URL (e.g. from imgbb / postimage / public storage) <span className="text-amber-500">*</span>
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  required
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://i.ibb.co/example/studio.jpg"
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition text-sm"
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5">
                  Upload your photo to imgbb or postimages, then paste the direct image link here.
                </p>
              </div>

              {/* Live Image Preview */}
              {formData.imageUrl && (
                <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                    Live Photo Preview:
                  </p>
                  <div className="relative aspect-[16/9] w-full sm:w-80 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
                    <img
                      src={formData.imageUrl}
                      alt="Studio preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section 4: Amenities List (Interactive Tag Checkboxes) */}
          <div className="bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-zinc-950 dark:text-white flex items-center gap-2">
                <CheckSquare className="w-5 h-5 text-amber-500" />
                Amenities List
              </h2>
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                {formData.amenities.length} selected
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Select all equipment and facilities available with this studio booking.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {AVAILABLE_AMENITIES.map((amenity) => {
                const isSelected = formData.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs font-medium transition duration-150 ${
                      isSelected
                        ? "bg-amber-500/10 border-amber-500 text-amber-900 dark:text-amber-300 font-semibold"
                        : "bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border transition ${
                        isSelected
                          ? "bg-amber-500 border-amber-500 text-zinc-950"
                          : "border-zinc-400 dark:border-zinc-600"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 5: Detailed Overview / Description */}
          <div className="bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white mb-2 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-500" />
              Detailed Overview
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              Describe room dimensions, power load, sound isolation, rules, and production equipment.
            </p>

            <textarea
              name="overview"
              required
              rows={5}
              value={formData.overview}
              onChange={handleInputChange}
              placeholder="Provide a comprehensive breakdown of the space, including dimensions, lighting equipment included, noise level, loading dock access, and rules..."
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition text-sm leading-relaxed"
            />
          </div>

          {/* Section 6: Host Information (Read-Only User Email & Name) */}
          <div className="bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-950 dark:text-white mb-1 flex items-center gap-2">
              <User className="w-5 h-5 text-amber-500" />
              Host Credentials (Read-only)
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
              Your verified account details will be attached to this listing.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* User Name (Read-only) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" />
                  Host Name
                </label>
                <input
                  type="text"
                  readOnly
                  disabled
                  value={formData.userName}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 text-sm cursor-not-allowed select-none font-medium"
                />
              </div>

              {/* User Email (Read-only) */}
              <div>
                <label className="block text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5" />
                  Host Email
                </label>
                <input
                  type="email"
                  readOnly
                  disabled
                  value={formData.userEmail}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/60 text-zinc-500 dark:text-zinc-400 text-sm cursor-not-allowed select-none font-medium"
                />
              </div>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
            <Link
              href="/studios"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-semibold transition text-center"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Submitting..." : "Submit Studio Listing"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}

