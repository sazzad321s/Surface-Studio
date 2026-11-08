"use client";

import { useRouter } from "next/navigation";

export default function GoBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-800 dark:bg-[#1a1a1e] dark:hover:bg-zinc-800 dark:border-zinc-800 dark:text-zinc-200 dark:hover:text-white font-medium rounded-xl transition-all duration-200 active:scale-[0.98]"
    >
      Go Back
    </button>
  );
}
