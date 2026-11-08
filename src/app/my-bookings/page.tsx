"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Building2, 
  User, 
  Mail, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Trash2, 
  ExternalLink,
  ShieldAlert,
  Loader2,
  Lock,
  Timer
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { BookingPayload } from "@/components/studio-booking-card";
import { getTokenFromClient } from "@/lib/getTokenFromClient";

const REVALIDATION_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

export default function MyBookingsPage() {
  const { data: session, isPending: sessionLoading } = authClient.useSession();
  const user = session?.user;
  const userEmail = user?.email?.trim().toLowerCase() || "";
  const userName = user?.name?.trim() || "";

  const [bookings, setBookings] = useState<BookingPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selectedBookingToCancel, setSelectedBookingToCancel] = useState<BookingPayload | null>(null);
  const [lastRevalidatedAt, setLastRevalidatedAt] = useState<string>("");
  const [secondsUntilNextRevalidation, setSecondsUntilNextRevalidation] = useState(300); // 5 min in seconds

  // Fetch bookings for the logged in user
  const loadMyBookings = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    setError(null);

    let serverBookings: BookingPayload[] = [];
    let fetchSucceeded = false;

    const token = await getTokenFromClient();
    try {
      const res = await fetch(`http://localhost:8000/my-bookings/${user?.email}`,{
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        const all: BookingPayload[] = Array.isArray(data) ? data : data.bookings || [];
        serverBookings = all;
        fetchSucceeded = true;
      }
    } catch (err) {
      console.warn("Could not reach http://localhost:8000/bookings:", err);
    }

    // Merge with any local cache fallback if server is still in setup
    const combinedBookings: BookingPayload[] = [...serverBookings];
    try {
      const cached = localStorage.getItem("user_recent_bookings");
      if (cached) {
        const localList: BookingPayload[] = JSON.parse(cached);
        localList.forEach((localItem) => {
          const existsOnServer = serverBookings.some(
            (sb) => sb._id === localItem._id || sb.idempotencyKey === localItem.idempotencyKey
          );
          if (!existsOnServer) {
            combinedBookings.push(localItem);
          }
        });
      }
    } catch {
      // ignore JSON parse error
    }

    // Filter to bookings belonging to current user
    if (userEmail) {
      const myBookings = combinedBookings.filter((b) => {
        return (
          b.userEmail?.toLowerCase() === userEmail ||
          (userName && b.userName === userName)
        );
      });

      // Sort newest first
      myBookings.sort((a, b) => {
        const timeA = new Date(a.createdAt || 0).getTime();
        const timeB = new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });

      setBookings(myBookings);
    }

    setLastRevalidatedAt(new Date().toLocaleTimeString());
    setSecondsUntilNextRevalidation(300);
    if (!isSilent) setLoading(false);
  }, [userEmail, userName]);

  // Initial load
  useEffect(() => {
    if (sessionLoading) return;
    if (userEmail) {
      loadMyBookings();
    } else {
      setLoading(false);
    }
  }, [sessionLoading, userEmail, loadMyBookings]);

  // Automatic 5-minute pending revalidation timer
  useEffect(() => {
    if (!userEmail) return;

    // 5-minute recurring revalidation interval
    const revalidationInterval = setInterval(() => {
      console.log("5-minute pending revalidation triggered.");
      loadMyBookings(true);
    }, REVALIDATION_INTERVAL_MS);

    // 1-second countdown ticker for user UI visibility
    const countdownTicker = setInterval(() => {
      setSecondsUntilNextRevalidation((prev) => {
        if (prev <= 1) {
          return 300;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(revalidationInterval);
      clearInterval(countdownTicker);
    };
  }, [userEmail, loadMyBookings]);

  // Handle Booking Cancellation (only allowed when status is 'pending')
  const handleConfirmCancel = async () => {
    if (!selectedBookingToCancel || cancellingId) return;
    const booking = selectedBookingToCancel;
    const targetId = booking._id;

    if (booking.status !== "pending") {
      toast.error("Only pending bookings can be cancelled.");
      setSelectedBookingToCancel(null);
      return;
    }

    setCancellingId(targetId || "temp");
   const jwtToken = await getTokenFromClient();
    try {
      // 1. Send DELETE request to server API with dynamic id
      if (targetId && !targetId.startsWith("local_")) {
        const res = await fetch(`http://localhost:8000/my-bookings/${targetId}`, {
          method: "DELETE",
          headers: {
            authorization: `Bearer ${jwtToken}`
          }
        });

        if (!res.ok) {
          throw new Error(`Failed to delete booking (${res.status} ${res.statusText})`);
        }
      }

      // 2. Remove from UI state
      setBookings((prev) =>
        prev.filter((b) => {
          if (targetId && b._id) return b._id !== targetId;
          return b.idempotencyKey !== booking.idempotencyKey;
        })
      );

      // 3. Update local cache
      try {
        const cached = localStorage.getItem("user_recent_bookings");
        if (cached) {
          const localList: BookingPayload[] = JSON.parse(cached);
          const updated = localList.filter((b) => {
            if (targetId && b._id) return b._id !== targetId;
            return b.idempotencyKey !== booking.idempotencyKey;
          });
          localStorage.setItem("user_recent_bookings", JSON.stringify(updated));
        }
      } catch (cacheErr) {
        console.error("Local storage update error:", cacheErr);
      }

      toast.success("Booking cancelled and removed successfully.");
    } catch (err) {
      console.error("Cancellation error:", err);
      toast.error("Failed to cancel booking. Please try again.");
    } finally {
      setCancellingId(null);
      setSelectedBookingToCancel(null);
    }
  };

  // Format countdown mm:ss
  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // Format Date string
  const formatDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  // Guard: User must be signed in
  if (!sessionLoading && !user) {
    return (
      <div className="bg-[#f8f9fa] dark:bg-[#111113] min-h-[calc(100vh-80px)] py-16 flex items-center justify-center transition-colors">
        <div className="max-w-md w-full mx-4 p-8 rounded-3xl bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 text-center shadow-xl">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white tracking-tight mb-2">
            Authentication Required
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6 leading-relaxed">
            Please log in to your account to view your scheduled studio bookings and reservation statuses.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition shadow-lg shadow-amber-500/20"
          >
            Log In to View Bookings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#111113] min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Breadcrumb & Page Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/studios"
            className="inline-flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Studios
          </Link>

          {/* 5-Min Pending Revalidation Status Indicator */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 shadow-sm">
              <Timer className="w-3.5 h-3.5 text-amber-500" />
              <span>Pending Revalidation: <strong>5 min</strong></span>
              <span className="text-zinc-400 dark:text-zinc-500">
                (next in {formatCountdown(secondsUntilNextRevalidation)})
              </span>
            </div>

            <button
              type="button"
              onClick={() => loadMyBookings()}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#16161a] hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 text-xs font-semibold text-zinc-700 dark:text-zinc-300 transition shadow-sm active:scale-95 disabled:opacity-50"
              title="Revalidate bookings now"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-500 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden xs:inline">Revalidate</span>
            </button>
          </div>
        </div>

        {/* Title Bar */}
        <div className="pb-8 border-b border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
              My Studio Bookings
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-2">
              Review your reserved studio dates, manage sessions, or cancel reservations while in pending status.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold">
              {bookings.length} Reservation{bookings.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="mt-8 rounded-3xl bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
            <div className="flex items-center justify-center gap-3 py-16 text-zinc-500 dark:text-zinc-400 text-sm">
              <Loader2 className="w-5 h-5 animate-spin text-amber-500" />
              <span>Loading your bookings...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && bookings.length === 0 && (
          <div className="mt-8 py-16 px-6 rounded-3xl bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-4">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
              No Studio Bookings Found
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2 mb-6 max-w-md mx-auto leading-relaxed">
              You haven&apos;t booked any creative workspaces yet. Explore available cycloramas, podcast suites, and sound stages to book your session!
            </p>
            <Link
              href="/studios"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 active:scale-95"
            >
              Explore Studios
            </Link>
          </div>
        )}

        {/* Bookings Table */}
        {!loading && bookings.length > 0 && (
          <div className="mt-8 rounded-3xl bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
            
            <Table>
              <TableHeader className="bg-zinc-50 dark:bg-[#111113]/80 border-b border-zinc-200 dark:border-zinc-800">
                <TableRow className="hover:bg-transparent border-zinc-200 dark:border-zinc-800">
                  <TableHead className="w-[320px] text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider py-4">
                    Studio Details
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                    Date & Time
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                    Host Info
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                    Pricing
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider">
                    Status
                  </TableHead>
                  <TableHead className="text-right text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider pr-6">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {bookings.map((booking, idx) => {
                  const isPendingStatus = booking.status === "pending";
                  const isConfirmed = booking.status === "confirmed";
                  const isCancelled = booking.status === "cancelled";

                  return (
                    <TableRow
                      key={booking._id || booking.idempotencyKey || idx}
                      className="border-b border-zinc-100 dark:border-zinc-800/80 hover:bg-zinc-50/70 dark:hover:bg-zinc-900/50 transition-colors"
                    >
                      {/* Studio Column */}
                      <TableCell className="py-4 font-medium">
                        <div className="flex items-center gap-3.5">
                          <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 shrink-0 border border-zinc-200 dark:border-zinc-800">
                            <Image
                              src={booking.studioImage || "/hero.jpg"}
                              alt={booking.studioTitle}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <Link
                              href={`/studios/${booking.studioId}`}
                              className="font-bold text-zinc-950 dark:text-white hover:text-amber-500 transition-colors truncate block text-sm"
                            >
                              {booking.studioTitle}
                            </Link>
                            <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                              <span className="truncate">{booking.category}</span>
                              <span>•</span>
                              <span className="truncate flex items-center gap-1">
                                <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                                {booking.studioLocation}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>

                      {/* Date & Time Column */}
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-900 dark:text-white">
                            <Calendar className="w-3.5 h-3.5 text-amber-500" />
                            <span>{formatDisplayDate(booking.bookingDate)}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                            <Clock className="w-3 h-3" />
                            <span>
                              {booking.startTime} - {booking.endTime} ({booking.durationHours} hr{booking.durationHours > 1 ? "s" : ""})
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      {/* Host Info Column */}
                      <TableCell>
                        <div className="space-y-0.5 text-xs">
                          <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                            {booking.hostName || "Verified Host"}
                          </p>
                          {booking.hostEmail && (
                            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate max-w-[150px]">
                              {booking.hostEmail}
                            </p>
                          )}
                        </div>
                      </TableCell>

                      {/* Pricing Column */}
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="text-sm font-black text-amber-500">
                            ${booking.totalDue}
                          </div>
                          <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
                            Rate: ${booking.hourlyRate}/hr
                          </div>
                        </div>
                      </TableCell>

                      {/* Status Column */}
                      <TableCell>
                        {isPendingStatus && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            Pending
                          </div>
                        )}
                        {isConfirmed && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Confirmed
                          </div>
                        )}
                        {isCancelled && (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-300 dark:border-zinc-700">
                            <XCircle className="w-3.5 h-3.5" />
                            Cancelled
                          </div>
                        )}
                      </TableCell>

                      {/* Action Column */}
                      <TableCell className="text-right pr-6">
                        {isPendingStatus ? (
                          <button
                            type="button"
                            onClick={() => setSelectedBookingToCancel(booking)}
                            disabled={cancellingId === booking._id}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 text-xs font-semibold transition active:scale-95 disabled:opacity-50 cursor-pointer"
                            title="Cancel pending booking"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Cancel</span>
                          </button>
                        ) : isCancelled ? (
                          <span className="text-xs text-zinc-400 italic">
                            Cancelled
                          </span>
                        ) : (
                          <span className="text-xs text-emerald-500 font-medium">
                            Active
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>

            {/* Table Footer Info */}
            <div className="p-4 bg-zinc-50/50 dark:bg-[#111113]/50 border-t border-zinc-200 dark:border-zinc-800 text-xs text-zinc-500 dark:text-zinc-400 flex flex-col sm:flex-row items-center justify-between gap-2">
              <p>
                * Pending bookings can be cancelled at any time without fees. Revalidated every 5 minutes.
              </p>
              <p className="text-[11px]">
                Last checked: {lastRevalidatedAt || "Just now"}
              </p>
            </div>

          </div>
        )}

      </div>

      {/* Confirmation Dialog for Cancellation */}
      <AlertDialog
        open={!!selectedBookingToCancel}
        onOpenChange={(open) => {
          if (!open) setSelectedBookingToCancel(null);
        }}
      >
        <AlertDialogContent className="bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-7 max-w-md">
          <AlertDialogHeader>
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-3">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <AlertDialogTitle className="text-xl font-bold text-zinc-950 dark:text-white">
              Cancel Studio Booking?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mt-2">
              Are you sure you want to cancel your reservation for{" "}
              <strong className="text-zinc-900 dark:text-white">
                {selectedBookingToCancel?.studioTitle}
              </strong>{" "}
              on {selectedBookingToCancel?.bookingDate} ({selectedBookingToCancel?.startTime} - {selectedBookingToCancel?.endTime})?
              <br />
              <span className="text-xs text-zinc-500 mt-2 block">
                This action is immediate and your reserved time slot will be made available to other creators.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex gap-3">
            <AlertDialogCancel
              onClick={() => setSelectedBookingToCancel(null)}
              className="rounded-xl border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmCancel}
              className="rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-md shadow-red-600/20"
            >
              Yes, Cancel Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
