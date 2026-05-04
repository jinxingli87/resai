import Link from "next/link";
import { COURSES } from "@/lib/data";
import { formatCurrency } from "@/lib/utils";

export const metadata = {
  title: "AI & ML Courses – ResAI",
  description:
    "Master machine learning, LLMs, computer vision, and AI strategy with ResAI's expert-led courses.",
};

export default function CoursesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-slate-950 text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <span className="inline-block text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
            AI & ML Education
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-2xl">
            World-Class AI Courses for Every Level
          </h1>
          <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
            Whether you&apos;re a software engineer diving into deep learning or an
            executive navigating the AI landscape, we have a course built for you.
          </p>
        </div>
      </section>

      {/* Courses */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          {COURSES.map((course, index) => (
            <div
              key={course.id}
              id={course.id}
              className={`grid md:grid-cols-2 gap-12 items-start ${index % 2 === 1 ? "md:grid-flow-dense" : ""}`}
            >
              <div className={index % 2 === 1 ? "md:col-start-2" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {course.level}
                  </span>
                  <span className="text-xs text-slate-400">{course.duration}</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-3">
                  {course.name}
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed mb-6">
                  {course.description}
                </p>
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.topics.map((topic) => (
                      <span
                        key={topic}
                        className="text-sm bg-slate-100 text-slate-700 px-3 py-1 rounded-full"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-3xl font-bold text-slate-900">
                    {formatCurrency(course.price_cents)}
                  </span>
                  <Link
                    href={`/checkout?product=${course.id}`}
                    className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Enroll Now
                  </Link>
                </div>
              </div>

              <div className={`bg-slate-50 rounded-2xl p-8 ${index % 2 === 1 ? "md:col-start-1" : ""}`}>
                <h3 className="font-bold text-slate-900 mb-4">Course Highlights</h3>
                <ul className="space-y-3">
                  {[
                    "Live online instruction with Q&A sessions",
                    "Hands-on projects and coding assignments",
                    "Course materials accessible for 1 year",
                    "Certificate of completion",
                    "Access to ResAI alumni community",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <svg
                        className="w-4 h-4 text-blue-600 mt-0.5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Are the courses live or self-paced?",
                a: "Courses include live online sessions with the instructor, supplemented by recorded materials you can revisit anytime.",
              },
              {
                q: "Do I need prior coding experience?",
                a: "Most technical courses require basic Python knowledge. The AI for Business Leaders course is designed for non-technical professionals.",
              },
              {
                q: "What payment methods are accepted?",
                a: "We accept all major credit and debit cards via Stripe. Payments are secure and processed immediately.",
              },
              {
                q: "Can my company pay for multiple seats?",
                a: "Yes — contact foxglobe2023@gmail.com for group enrollment and enterprise pricing.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="bg-white rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-2">{q}</h3>
                <p className="text-slate-500 text-sm">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
