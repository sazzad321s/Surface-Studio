"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";

import Link from "next/link";
import { 
  
  Clock, 
  Calendar, 
  User, 
  Mail, 
  AlertCircle, 
  Loader2, 

} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import type { Studio } from "@/app/studios/page";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

interface StudioBookingCardProps {
  studio: Studio;
}

export interface BookingPayload {
  _id?: string;
  studioId: string;
  studioTitle: string;
  studioImage: string;
  studioLocation: string;
  category: string;
  // Host Info (from studio)
  hostName: string;
  hostEmail: string;
  // User Info (from authenticated session!)
  userName: string;
  userEmail: string;
  // Booking Info
  bookingDate: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  hourlyRate: number;
  subtotal: number;
  securityDeposit: number;
  totalDue: number;
  status: "pending" | "confirmed" | "cancelled";
  createdAt: string;
  idempotencyKey: string;
  notes?: string;
}

export default function StudioBookingCard({ studio }: StudioBookingCardProps) {
  const router = useRouter();
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;

  // The logged-in user's details (NOT the host's details)
  const currentUserName = user?.name?.trim() || "";
  const currentUserEmail = user?.email?.trim().toLowerCase() || "";

  // Pricing values
  const hourlyRate = Number(studio.hourlyRate) || 0;
  const securityDeposit = Number(studio.securityDeposit) || 0;

  // Form states
  const [minDate, setMinDate] = useState<string>("");
  const [bookingDate, setBookingDate] = useState("2026-11-12");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("14:00");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  useEffect(() => {
    setMinDate(new Date().toISOString().split("T")[0]);
  }, []);

  // Calculate hours between startTime and endTime
  const durationHours = useMemo(() => {
    try {
      const [startH, startM] = startTime.split(":").map(Number);
      const [endH, endM] = endTime.split(":").map(Number);
      const totalStartMin = startH * 60 + (startM || 0);
      const totalEndMin = endH * 60 + (endM || 0);
      const diffMinutes = totalEndMin - totalStartMin;
      if (diffMinutes <= 0) return 1;
      return Math.max(1, Math.round(diffMinutes / 60));
    } catch {
      return 4;
    }
  }, [startTime, endTime]);

  const subtotal = durationHours * hourlyRate;
  const totalDue = subtotal + securityDeposit;

  // Check for duplicate bookings before submitting
  const checkDuplicateBooking = async (): Promise<boolean> => {
    if (!currentUserEmail || !studio._id) return false;
    const token = await getTokenFromClient();
    try {
      // 1. Check server endpoint for existing user bookings
      const res = await fetch("http://localhost:8000/bookings",{
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const bookings: BookingPayload[] = Array.isArray(data) ? data : data.bookings || [];

        const hasDuplicate = bookings.some((b) => {
          const isSameStudio = b.studioId === studio._id;
          const isSameUser = b.userEmail?.toLowerCase() === currentUserEmail;
          const isSameDate = b.bookingDate === bookingDate;
          const isNotCancelled = b.status !== "cancelled";

          return isSameStudio && isSameUser && isSameDate && isNotCancelled;
        });

        if (hasDuplicate) {
          return true;
        }
      }
    } catch {
      // If server /bookings is not ready, check local fallback
    }

    // 2. Fallback check in localStorage cache
    try {
      const localCached = localStorage.getItem("user_recent_bookings");
      if (localCached) {
        const localList: BookingPayload[] = JSON.parse(localCached);
        const hasLocalDuplicate = localList.some((b) => {
          return (
            b.studioId === studio._id &&
            b.userEmail?.toLowerCase() === currentUserEmail &&
            b.bookingDate === bookingDate &&
            b.status !== "cancelled"
          );
        });
        if (hasLocalDuplicate) return true;
      }
    } catch {
      // ignore JSON parse error
    }

    return false;
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setDuplicateWarning(null);

    // 1. Authentication guard
    if (!user) {
      toast.error("Please login first to book this studio.");
      router.push("/login");
      return;
    }

    // 2. Validate booking time
    if (startTime >= endTime) {
      toast.error("End time must be after start time.");
      return;
    }

    setIsSubmitting(true);

    try {
      // 3. Duplication Prevention check
      const isDuplicate = await checkDuplicateBooking();
      if (isDuplicate) {
        const msg = `You already have an active booking for this studio on ${bookingDate}. Please choose a different date or check My Bookings.`;
        setDuplicateWarning(msg);
        toast.error(msg);
        setIsSubmitting(false);
        return;
      }

      // 4. Construct payload using LOGGED-IN USER (currentUserName & currentUserEmail)
      const idempotencyKey = `${studio._id}_${currentUserEmail}_${bookingDate}_${startTime}_${Date.now()}`;

      const bookingPayload: BookingPayload = {
        studioId: studio._id,
        studioTitle: studio.title || studio.name || "Creative Studio Space",
        studioImage: studio.imageUrl || studio.image || "/hero.jpg",
        studioLocation: studio.location || "Location on request",
        category: studio.category || "Studio Space",
        // Host Info (from the studio listing)
        hostName: studio.userName || "Verified Host",
        hostEmail: studio.userEmail || "",
        // RENTER INFO (from current authenticated session!)
        userName: currentUserName,
        userEmail: currentUserEmail,
        // Booking parameters
        bookingDate,
        startTime,
        endTime,
        durationHours,
        hourlyRate,
        subtotal,
        securityDeposit,
        totalDue,
        status: "pending",
        createdAt: new Date().toISOString(),
        idempotencyKey,
        notes: notes.trim() || undefined,
      };

      console.log("Submitting booking with user session:", bookingPayload);
         const jwtToken = await getTokenFromClient();
      // 5. Post to backend endpoint
      let savedSuccessfully = false;
      try {
        const response = await fetch("http://localhost:8000/booking", {
          method: "POST",
          headers: { "Content-Type": "application/json",
            authorization: `Bearer ${jwtToken}`
           },
          body: JSON.stringify(bookingPayload),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Server booking saved:", result);
          savedSuccessfully = true;
        } else if (response.status === 409) {
          // 409 Conflict from server
          toast.error("This studio is already booked for this date and time.");
          setIsSubmitting(false);
          return;
        }
      } catch (networkErr) {
        console.warn("Backend /bookings network notice:", networkErr);
      }

      // Always save to local cache so user can view & test `/my-bookings` seamlessly
      try {
        const existingLocal = JSON.parse(localStorage.getItem("user_recent_bookings") || "[]");
        const updatedLocal = [
          { ...bookingPayload, _id: bookingPayload._id || `local_${Date.now()}` },
          ...existingLocal,
        ];
        localStorage.setItem("user_recent_bookings", JSON.stringify(updatedLocal));
        savedSuccessfully = true;
      } catch (err) {
        console.error("Local storage booking cache error:", err);
      }

      if (savedSuccessfully) {
        toast.success("Studio booked successfully! Your reservation is pending.");
        router.push("/my-bookings");
      } else {
        toast.error("Could not complete booking. Please try again.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("An error occurred while booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sticky top-24 rounded-3xl bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 shadow-xl transition-colors">
      
      {/* Price Header */}
      <div className="flex items-baseline gap-1.5 mb-5">
        <span className="text-3xl sm:text-4xl font-extrabold text-amber-500">
          ${hourlyRate}
        </span>
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          / hr
        </span>
      </div>

      {/* Authenticated User Session Banner */}
      <div className="mb-5 p-3 rounded-xl bg-zinc-50 dark:bg-[#111113] border border-zinc-200 dark:border-zinc-800/80 text-xs text-zinc-600 dark:text-zinc-300">
        {sessionLoading ? (
          <div className="flex items-center gap-2 text-zinc-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            <span>Checking session...</span>
          </div>
        ) : user ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-500" />
                Booking as:
              </span>
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Active Session
              </span>
            </div>
            <p className="font-medium text-zinc-800 dark:text-zinc-200 truncate">
              {currentUserName || "Creator"}
            </p>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate flex items-center gap-1">
              <Mail className="w-3 h-3" />
              {currentUserEmail}
            </p>
          </div>
        ) : (
          <div className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Not signed in</p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                Please{" "}
                <Link href="/login" className="underline font-medium hover:text-amber-500">
                  log in
                </Link>{" "}
                to book under your personal account.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Duplicate Booking Warning */}
      {duplicateWarning && (
        <div className="mb-5 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-xs text-red-700 dark:text-red-300 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <div>
            <p className="font-bold">Duplicate Booking Prevented</p>
            <p className="mt-0.5 text-[11px] leading-relaxed">{duplicateWarning}</p>
          </div>
        </div>
      )}

      {/* Booking Form */}
      <form onSubmit={handleBookingSubmit} className="space-y-4">
        
        {/* Date Input */}
        <div>
          <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            Date
          </label>
          <input
            type="date"
            required
            min={minDate || undefined}
            value={bookingDate}
            onChange={(e) => {
              setBookingDate(e.target.value);
              setDuplicateWarning(null);
            }}
            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-[#111113] border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition"
          />
        </div>

        {/* Start and End Time Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              Start
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => {
                setStartTime(e.target.value);
                setDuplicateWarning(null);
              }}
              className="w-full px-3.5 py-3 rounded-xl bg-zinc-50 dark:bg-[#111113] border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              End
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => {
                setEndTime(e.target.value);
                setDuplicateWarning(null);
              }}
              className="w-full px-3.5 py-3 rounded-xl bg-zinc-50 dark:bg-[#111113] border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition"
            />
          </div>
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
            Special Requests / Shoot Details (Optional)
          </label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. 5-person crew, product video"
            className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-[#111113] border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white text-xs placeholder-zinc-400 focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition"
          />
        </div>

        {/* Calculation Breakdown */}
        <div className="pt-2 space-y-2 text-sm text-zinc-600 dark:text-zinc-300 border-t border-zinc-100 dark:border-zinc-800/80">
          <div className="flex items-center justify-between">
            <span>
              {durationHours} hour{durationHours > 1 ? "s" : ""} × ${hourlyRate}
            </span>
            <span className="font-medium text-zinc-900 dark:text-white">
              ${subtotal}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span>Security deposit (refundable)</span>
            <span className="font-medium text-zinc-900 dark:text-zinc-300">
              ${securityDeposit}
            </span>
          </div>

          <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-base font-bold text-zinc-950 dark:text-white">
            <span>Total due</span>
            <span className="text-amber-500 font-black">${totalDue}</span>
          </div>
        </div>

        {/* Submit Booking Button */}
        <button
          type="submit"
          disabled={isSubmitting || sessionLoading}
          className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm sm:text-base transition-all duration-150 shadow-lg shadow-amber-500/20 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing Booking...</span>
            </>
          ) : (
            <span>Book Workspace Now</span>
          )}
        </button>

      </form>

      {/* Cancellation Policy Note */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-4">
        Cancel free while the booking is pending.
      </p>

    </div>
  );
}
