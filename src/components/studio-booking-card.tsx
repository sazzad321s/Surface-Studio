"use client";

import { useState, useMemo } from "react";
import { Check, ShieldCheck, Clock, Calendar } from "lucide-react";
import { Studio } from "@/app/studios/page";



export default function StudioBookingCard({studio}:{studio:Studio}) {

    const hourlyRate = Number(studio.hourlyRate);
  const securityDeposit = Number(studio.securityDeposit);

  const [bookingDate, setBookingDate] = useState("2026-11-12");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("14:00");
  const [isBooked, setIsBooked] = useState(false);

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

  const subtotal = durationHours * hourlyRate
  const totalDue = subtotal < securityDeposit ? 0 : subtotal - securityDeposit;

  const handleBook = () => {
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
    }, 4000);
  };

  return (
    <div className="sticky top-24 rounded-3xl bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 shadow-xl transition-colors">
      {/* Price Header */}
      <div className="flex items-baseline gap-1.5 mb-6">
        <span className="text-3xl sm:text-4xl font-extrabold text-amber-500">
          ${studio.hourlyRate}
        </span>
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          / hr
        </span>
      </div>

      {/* Date Input */}
      <div className="mb-4">
        <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
          Date
        </label>
        <div className="relative">
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-[#111113] border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Start and End Time Inputs */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
            Start
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full px-3.5 py-3 rounded-xl bg-zinc-50 dark:bg-[#111113] border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1.5">
            End
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full px-3.5 py-3 rounded-xl bg-zinc-50 dark:bg-[#111113] border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/50 focus:border-amber-500 transition"
          />
        </div>
      </div>

      {/* Calculation Breakdown matching screenshot */}
      <div className="space-y-2 mb-6 text-sm text-zinc-600 dark:text-zinc-300">
        <div className="flex items-center justify-between">
          <span>
            {durationHours} hours × ${studio.hourlyRate}
          </span>
          <span className="font-medium text-zinc-900 dark:text-white">
            ${subtotal}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <span>Security deposit (refundable)</span>
          <span className="font-medium text-zinc-900 dark:text-zinc-300">
            ${studio.securityDeposit}
          </span>
        </div>

        <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800/80 flex items-center justify-between text-base font-bold text-zinc-950 dark:text-white">
          <span>Total due</span>
          <span className="text-amber-500">${totalDue}</span>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        onClick={handleBook}
        className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm sm:text-base transition-all duration-150 shadow-lg shadow-amber-500/20 active:scale-[0.98] cursor-pointer"
      >
        {isBooked ? "Booking Requested!" : "Book Workspace Now"}
      </button>

      {/* Booking Feedback Banner */}
      {isBooked && (
        <div className="mt-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>Session reserved for {durationHours} hrs on {bookingDate}!</span>
        </div>
      )}

      {/* Cancellation Policy Footer */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center mt-4">
        Cancel free while the booking is pending.
      </p>
    </div>
  );
}

