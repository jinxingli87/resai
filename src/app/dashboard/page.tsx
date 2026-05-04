export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { OrderWithItems } from "@/types";

export const metadata = {
  title: "My Orders – FoxGlobe",
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/auth/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const typedOrders = (orders || []) as OrderWithItems[];

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Orders</h1>
        <p className="text-slate-500 mt-1">{user.email}</p>
      </div>

      {typedOrders.length === 0 ? (
        <div className="bg-slate-50 rounded-2xl border border-slate-200 p-12 text-center">
          <p className="text-slate-500 mb-4">You haven&apos;t placed any orders yet.</p>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {typedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-slate-200 p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-sm text-slate-400">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-sm text-slate-500 mt-0.5">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      order.status === "paid"
                        ? "bg-green-100 text-green-700"
                        : order.status === "pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(order.total_cents)}
                  </span>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-2">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-slate-700">{item.product_name}</span>
                    <span className="text-slate-500">{formatCurrency(item.price_cents)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
