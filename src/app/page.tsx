import Link from "next/link";
import { SERVICES, COURSES } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-cyan-950 opacity-80" />
        <div className="relative max-w-6xl mx-auto px-6 py-32 md:py-40">
          <div className="max-w-2xl">
            <span className="inline-block text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
              AI Consulting & Education
            </span>
            <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
              Transform Your Business with{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                AI That Works
              </span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-10 max-w-xl">
              FoxGlobe delivers end-to-end AI strategy, agentic workflow
              automation, and world-class AI/ML training — so your organization
              can lead the intelligence era.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/consulting"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
              >
                Explore Consulting
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center px-6 py-3 border border-slate-600 text-white font-semibold rounded-lg hover:border-slate-400 hover:bg-white/5 transition-colors"
              >
                Browse Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              AI Consulting
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              We partner with leadership teams to design and execute AI
              strategies that create durable competitive advantage.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="border border-slate-200 rounded-2xl p-8 hover:shadow-lg hover:border-blue-200 transition-all group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-5 group-hover:bg-blue-600 transition-colors">
                  <svg
                    className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {service.name}
                </h3>
                <p className="text-blue-600 text-sm font-medium mb-3">
                  {service.tagline}
                </p>
                <p className="text-slate-500 text-sm leading-relaxed mb-5">
                  {service.description}
                </p>
                <ul className="space-y-2">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                      <svg
                        className="w-4 h-4 text-blue-500 mt-0.5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/consulting"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors"
            >
              Learn more about our consulting →
            </Link>
          </div>
        </div>
      </section>

      {/* Courses section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              AI & ML Courses
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              From machine learning fundamentals to cutting-edge LLMs and
              computer vision — courses for every level.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {COURSES.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col hover:shadow-lg hover:border-blue-200 transition-all"
              >
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full self-start mb-4">
                  {course.level}
                </span>
                <h3 className="font-bold text-slate-900 mb-2 leading-snug">
                  {course.name}
                </h3>
                <p className="text-sm text-slate-500 mb-4 flex-1">
                  {course.tagline}
                </p>
                <div className="text-sm text-slate-400 mb-4">{course.duration}</div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">
                    {formatCurrency(course.price_cents)}
                  </span>
                  <Link
                    href={`/courses#${course.id}`}
                    className="text-sm text-blue-600 font-medium hover:text-blue-700"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Trust section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {[
              { stat: "100%", label: "Custom solutions, built for your business" },
              { stat: "4", label: "Specialized AI/ML courses" },
              { stat: "2", label: "Core AI consulting services" },
            ].map(({ stat, label }) => (
              <div key={stat} className="p-8">
                <div className="text-5xl font-bold text-blue-600 mb-3">{stat}</div>
                <p className="text-slate-500">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 py-20 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to build your AI advantage?
          </h2>
          <p className="text-blue-100 mb-8 max-w-lg mx-auto">
            Whether you&apos;re implementing AI at the enterprise level or
            upskilling your team, FoxGlobe has the expertise you need.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/consulting"
              className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-700 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
            >
              Get Started with Consulting
            </Link>
            <Link
              href="/courses"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/40 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
