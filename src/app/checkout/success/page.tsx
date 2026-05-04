import Link from "next/link";

export const metadata = {
  title: "Order Confirmed – ResAI",
};

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-10">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-3">Payment Confirmed!</h1>
          <p className="text-slate-500 mb-2">
            Thank you for your purchase. A confirmation email has been sent to you.
          </p>
          <p className="text-slate-400 text-sm mb-8">
            Our team will reach out within 1–2 business days to get started.
          </p>
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Orders
            </Link>
            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
