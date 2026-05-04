import Link from "next/link";
import { SERVICES } from "@/lib/data";

export const metadata = {
  title: "AI Consulting – FoxGlobe",
  description:
    "FoxGlobe AI consulting: Agentic AI workflow automation and Generative AI integration for your business.",
};

export default function ConsultingPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-slate-950 text-white py-24">
        <div className="max-w-6xl mx-auto px-6">
          <span className="inline-block text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4">
            AI Strategy & Implementation
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 max-w-2xl">
            Enterprise AI Consulting Built for Results
          </h1>
          <p className="text-slate-300 text-lg max-w-xl leading-relaxed">
            We work alongside your leadership and engineering teams to design,
            build, and operate AI systems that drive measurable business outcomes.
          </p>
        </div>
      </section>

      {/* Services detail */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 space-y-20">
          {SERVICES.map((service, index) => (
            <div
              key={service.id}
              id={service.id}
              className={`grid md:grid-cols-2 gap-12 items-start ${index % 2 === 1 ? "md:grid-flow-dense" : ""}`}
            >
              <div className={index % 2 === 1 ? "md:col-start-2" : ""}>
                <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                  AI Consulting
                </span>
                <h2 className="text-3xl font-bold text-slate-900 mt-4 mb-3">
                  {service.name}
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3 mb-8">
                  {service.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-slate-700">
                      <svg
                        className="w-5 h-5 text-blue-600 mt-0.5 shrink-0"
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
                <Link
                  href={`/auth/login?next=/checkout?product=consulting-${service.id}`}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>

              <div className={`bg-slate-50 rounded-2xl p-8 ${index % 2 === 1 ? "md:col-start-1" : ""}`}>
                <h3 className="font-bold text-slate-900 mb-4">What to Expect</h3>
                <ul className="space-y-4">
                  {[
                    { step: "1", title: "Discovery Call", desc: "We learn your business goals, current stack, and success criteria." },
                    { step: "2", title: "Solution Design", desc: "Our team designs a tailored AI architecture and project roadmap." },
                    { step: "3", title: "Implementation", desc: "We build, integrate, and test the AI system alongside your team." },
                    { step: "4", title: "Handoff & Support", desc: "Full documentation, training, and ongoing operational support." },
                  ].map(({ step, title, desc }) => (
                    <li key={step} className="flex gap-4">
                      <span className="flex-none w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {step}
                      </span>
                      <div>
                        <p className="font-semibold text-slate-900 text-sm">{title}</p>
                        <p className="text-slate-500 text-sm">{desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-950 py-20 text-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Let&apos;s build your AI advantage together</h2>
          <p className="text-slate-400 mb-8 max-w-md mx-auto">
            Contact us to discuss your AI goals and get a custom proposal.
          </p>
          <a
            href="mailto:foxglobe2023@gmail.com"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition-colors"
          >
            Contact Us
          </a>
        </div>
      </section>
    </>
  );
}
