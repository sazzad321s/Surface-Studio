"use client";

import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import toast from "react-hot-toast";

export default function RegisterPage() {

  const handleSignUp = async(e:React.SubmitEvent<HTMLElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userData = Object.fromEntries(formData.entries()) as {name: string, image: string, email: string, password: string}
    console.log(userData);

    const {data, error} = await authClient.signUp.email({
        ...userData
    }) 

    if(data){
        console.log(data);
        redirect('/');
    }
    if(error){
        console.log(error);
    }

  }

    const handleGoogleSignIn = async() => {
        const {error} = await authClient.signIn.social({
            provider: "google",
            callbackURL: "/"
        })
         if (error) {
    toast.error("Something Went Wrong!");
  } else {
    toast.success("Sign In Successfull");
  }

   }

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f8f9fa] dark:bg-[#111113] transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-[#16161a] p-8 rounded-3xl border border-zinc-200 dark:border-zinc-800 shadow-xl">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Image src="/logo.png" alt="Logo" width={36} height={36} className="object-contain" />
            <span className="text-2xl font-bold text-zinc-950 dark:text-white">SurfaceStudio</span>
          </Link>
          <h2 className="text-2xl font-bold text-zinc-950 dark:text-white tracking-tight">Join StudioSpace</h2>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-amber-600 dark:text-amber-400 hover:text-amber-500">
              Sign in
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSignUp}>
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
              placeholder="Alex Johnson"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Image Url
            </label>
            <input
              type="url"
              name="image"
              id="image"
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
              placeholder="https://"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Email address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
              placeholder="alex@creative.com"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="w-full px-4 py-3 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 transition"
              placeholder="Create a strong password"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 active:scale-95"
          >
            Create Account
          </button>

         <div className="my-2 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-500">or</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          
            <button
              type="button"
              className="w-full py-3.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 active:scale-95"
              onClick={handleGoogleSignIn}
            >
              
              Login with Google
            </button>
           
        </form>
        
      </div>
    </div>
  );
}
