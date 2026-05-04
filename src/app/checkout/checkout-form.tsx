"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { COURSES } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("product") || "";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const course = COURSES.find((c) => c.id === productId);

  useEffect(() => {
    const { createClient } = require("@/lib/supabase/client");
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }: { data: { user: unknown } }) => {
      if (!data.user) {
        router.replace(`/auth/login?next=/checkout?product=${productId}`);
      }
    });
  }, []);

  if (!course) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Product not found</h1>
          <p className="text-slate-500">Please select a valid product.</p>
        </div>
      </div>
    );
  }

  async function handleCheckout() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-6">Order Summary</h1>

          <div className="bg-slate-50 rounded-xl p-5 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-slate-900">{course.name}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {course.duration} · {course.level}
                </p>
              </div>
              <span className="font-bold text-slate-900 shrink-0">
                {formatCurrency(course.price_cents)}
              </span>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 mb-6">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(course.price_cents)}</span>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm mb-4">
              {error}
            </div>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Redirecting to payment…" : "Proceed to Payment"}
          </button>
          <p className="text-center text-xs text-slate-400 mt-4">
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </div>
  );
}
