import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <span className="font-bold text-lg text-white">
              Fox<span className="text-blue-400">Globe</span>
            </span>
            <p className="mt-3 text-sm leading-relaxed">
              AI strategy, implementation, and education — built for businesses
              ready to lead the future.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/consulting" className="hover:text-white transition-colors">
                  AI Consulting
                </Link>
              </li>
              <li>
                <Link href="/courses" className="hover:text-white transition-colors">
                  AI Courses
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm mb-3">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="mailto:foxglobe2023@gmail.com"
                  className="hover:text-white transition-colors"
                >
                  foxglobe2023@gmail.com
                </a>
              </li>
              <li>foxglobe.us</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <span>© {new Date().getFullYear()} FoxGlobe. All rights reserved.</span>
          <div className="flex gap-6">
            <Link href="/auth/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              My Orders
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
