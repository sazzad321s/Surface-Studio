"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Eye,
  Loader2,
  Lock,
  MapPin,
  Pencil,
  PlusCircle,
  RefreshCw,
  SearchX,
  Sparkles,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-hot-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Studio } from "@/app/studios/page";
import { getTokenFromClient } from "@/lib/getTokenFromClient";



export default function MyListingPage() {
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;
  const userEmail = user?.email?.trim().toLowerCase() ?? "";
  const userName = user?.name?.trim() ?? "";

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Studio | null>(null);

  // Only the studios added by the signed-in host are listed (and editable)
  useEffect(() => {
    if (isPending) return;
    // Not signed in: the sign-in guard below renders instead, no state to set
    if (!userEmail && !userName) return;

    let cancelled = false;

    const loadMyStudios = async () => {
      try {
        const res = await fetch(`http://localhost:8000/studios`);
        if (!res.ok) {
          throw new Error(`Failed to fetch studios (${res.status} ${res.statusText})`);
        }
        const data = await res.json();
        const all: Studio[] = Array.isArray(data) ? data : [];

        const mine = all.filter((studio) => {
          const ownerEmail = studio.userEmail?.trim().toLowerCase();
          if (ownerEmail) return ownerEmail === userEmail;
          // Older listings without an email fall back to the host name
          return !!userName && studio.userName?.trim() === userName;
        });

        if (!cancelled) setStudios(mine);
      } catch (err) {
        if (cancelled) return;
        console.error("Error loading my listings:", err);
        setError(
          err instanceof Error ? err.message : "Unable to connect to the studio service."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadMyStudios();

    return () => {
      cancelled = true;
    };
  }, [isPending, userEmail, userName]);

  // A signed-in host always has an email (or at least a name) to match listings against
  const signedIn = !!user && (!!userEmail || !!userName);

  const handleDelete = async () => {
    if (!deleteTarget || deletingId) return;
    const studio = deleteTarget;
     const token = await getTokenFromClient()
    try {
      setDeletingId(studio._id);
      const res = await fetch(`http://localhost:8000/studio/${studio._id}`, {
        method: "DELETE",
        headers: {
          authorization: `Bearer ${token}`
        }
      });
      if (!res.ok) {
        throw new Error(`Delete failed (${res.status} ${res.statusText})`);
      }

      setStudios((prev) => prev.filter((item) => item._id !== studio._id));
      setDeleteTarget(null);
      toast.success("Listing deleted");
    } catch (err) {
      console.error("Failed to delete listing:", err);
      setDeleteTarget(null);
      toast.error("Could not delete this listing. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  /* ---------------------------------- Guards --------------------------------- */

  if (isPending || (loading && signedIn)) {
    return (
      <div className="bg-[#f8f9fa] dark:bg-[#111113] min-h-screen py-10 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-4 w-28 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse" />
          <div className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded-3xl animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden animate-pulse"
              >
                <div className="aspect-16/10 w-full bg-zinc-200 dark:bg-zinc-800" />
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                  <div className="h-6 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-xl w-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="bg-[#f8f9fa] dark:bg-[#111113] min-h-screen py-16 transition-colors duration-200">
        <div className="max-w-xl mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-4">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-zinc-950 dark:text-white mb-2">
            Sign in to see your listings
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6">
            Your added studios and their edit options live here.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-semibold transition"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ---------------------------------- Content -------------------------------- */

  return (
    <div className="bg-[#f8f9fa] dark:bg-[#111113] min-h-screen py-10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

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

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between pb-8 border-b border-zinc-200 dark:border-zinc-800 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 dark:bg-[#2a2213] text-amber-900 dark:text-[#f5a623] border border-amber-300 dark:border-[#59431b] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              Host Portal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 dark:text-white tracking-tight">
              My Listing
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base mt-2 max-w-2xl">
              Manage the studios you have added. Only your own listings can be edited here.
            </p>
          </div>

          <Link
            href="/add-studio"
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/20 transition active:scale-95"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add New Studio
          </Link>
        </div>

        {/* Error State */}
        {!loading && error && (
          <div className="mt-8 p-8 rounded-3xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-center max-w-lg mx-auto">
            <SearchX className="w-10 h-10 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-red-900 dark:text-red-300">
              Failed to load your listings
            </h3>
            <p className="text-xs text-red-700 dark:text-red-400 mt-1 mb-4">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && studios.length === 0 && (
          <div className="mt-8 py-16 px-6 rounded-3xl bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 text-center max-w-xl mx-auto shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mx-auto mb-5">
              <PlusCircle className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-950 dark:text-white tracking-tight">
              You haven&apos;t listed a studio yet
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-sm mt-2 mb-6 max-w-md mx-auto leading-relaxed">
              Add your creative space and it will show up here, ready to edit whenever
              you need to update pricing, amenities or photos.
            </p>
            <Link
              href="/add-studio"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition shadow-md shadow-amber-500/20"
            >
              <PlusCircle className="w-4 h-4" />
              Add Your First Studio
            </Link>
          </div>
        )}

        {/* My Studios Grid */}
        {!loading && !error && studios.length > 0 && (
          <>
            <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-6">
              {studios.length} {studios.length === 1 ? "listing" : "listings"} under {user?.email}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
              {studios.map((studio) => {
                const studioTitle = studio.title || studio.name || "Untitled Creative Studio";
                const studioImage = studio.imageUrl || studio.image || "/hero.jpg";
                const hourlyRate = studio.hourlyRate || 0;
                const rating = studio.rating || "4.9";
                const capacity = studio.maxCapacity || "10+";

                return (
                  <div
                    key={studio._id}
                    className="bg-white dark:bg-[#16161a] border border-zinc-200 dark:border-zinc-800/80 rounded-2xl overflow-hidden group hover:border-amber-500/50 hover:shadow-xl transition duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Studio Image */}
                      <div className="relative aspect-16/10 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
                        <Image
                          src={studioImage}
                          alt={studioTitle}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#111113]/85 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-400 border border-zinc-200 dark:border-zinc-700/60 shadow-sm">
                          {studio.category}
                        </div>
                        {studio.maxCapacity && (
                          <div className="absolute top-3 right-3 bg-[#111113]/80 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-medium text-white flex items-center gap-1">
                            <Users className="w-3 h-3 text-amber-400" />
                            <span>Up to {capacity}</span>
                          </div>
                        )}
                      </div>

                      {/* Studio Details */}
                      <div className="p-6">
                        <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 mb-2">
                          <span className="flex items-center gap-1 font-medium truncate max-w-[65%]">
                            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                            <span className="truncate">
                              {studio.location || "Location on request"}
                            </span>
                          </span>
                          <span className="flex items-center gap-1 text-zinc-800 dark:text-zinc-200 font-semibold shrink-0">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            {rating}
                          </span>
                        </div>

                        <Link href={`/studios/${studio._id}`} className="block group/link">
                          <h3 className="text-xl font-bold text-zinc-950 dark:text-white mb-2 group-hover/link:text-amber-500 transition-colors line-clamp-1">
                            {studioTitle}
                          </h3>
                        </Link>

                        {studio.overview && (
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                            {studio.overview}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Price & Actions */}
                    <div className="px-6 pb-6 pt-3 border-t border-zinc-100 dark:border-zinc-800/60">
                      <div className="flex flex-wrap items-center justify-between gap-3">
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

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/studios/${studio._id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-300 dark:border-zinc-800 bg-white hover:bg-zinc-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </Link>
                          <Link
                            href={`/updatestudio/${studio._id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 shadow-md shadow-amber-500/10 transition active:scale-95"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(studio)}
                            disabled={deletingId !== null}
                            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-xl border border-red-300 dark:border-red-900/60 bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-950/60 text-red-600 dark:text-red-400 transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={!!deleteTarget}
          onOpenChange={(open) => {
            // Keep the dialog open while the delete request is in flight
            if (!open && !deletingId) setDeleteTarget(null);
          }}
        >
          <AlertDialogContent size="sm" className="max-w-sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive">
                <Trash2 />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete this listing?</AlertDialogTitle>
              <AlertDialogDescription>
                <span className="font-medium text-foreground">
                  {deleteTarget
                    ? deleteTarget.title || deleteTarget.name || "Untitled Studio"
                    : ""}
                </span>{" "}
                will be permanently removed from SurfaceStudio, along with its pricing,
                photos and amenities. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deletingId !== null}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deletingId !== null}
                variant="destructive"
              >
                {deletingId !== null ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 />
                    Delete Listing
                  </>
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </div>
    </div>
  );
}
