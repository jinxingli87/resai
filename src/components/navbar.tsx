"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Import lazily to avoid SSG issues when env vars aren't set
    const { createClient } = require("@/lib/supabase/client");
    const supabase = createClient();

    supabase.auth.getUser().then(({ data }: { data: { user: User | null } }) =>
      setUser(data.user)
    );

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: User | null } | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    const { createClient } = require("@/lib/supabase/client");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-bold text-xl text-slate-900">
            Res<span className="text-blue-600">AI</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/consulting"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Consulting
          </Link>
          <Link
            href="/courses"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Courses
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                My Orders
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="space-y-1.5">
            <span
              className={`block h-0.5 w-6 bg-slate-900 transition-all ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-slate-900 transition-all ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-0.5 w-6 bg-slate-900 transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-6 py-4 flex flex-col gap-4">
          <Link
            href="/consulting"
            className="text-sm font-medium text-slate-700"
            onClick={() => setMenuOpen(false)}
          >
            Consulting
          </Link>
          <Link
            href="/courses"
            className="text-sm font-medium text-slate-700"
            onClick={() => setMenuOpen(false)}
          >
            Courses
          </Link>
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-slate-700"
                onClick={() => setMenuOpen(false)}
              >
                My Orders
              </Link>
              <button
                onClick={handleSignOut}
                className="text-sm font-medium text-slate-700 text-left"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg text-center"
              onClick={() => setMenuOpen(false)}
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
