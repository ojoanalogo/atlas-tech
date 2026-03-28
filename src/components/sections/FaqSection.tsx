'use client'

import { FAQS } from '@/config'

export function FaqSection() {
  return (
    <section className="py-4 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-sans font-bold text-primary">
            Preguntas frecuentes
          </h2>
          <p className="mt-2 text-secondary">
            Todo lo que necesitas saber sobre Tech Atlas
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq) => (
            <details key={faq.question} className="group bg-card border border-border rounded-lg">
              <summary className="flex items-center justify-between cursor-pointer px-5 py-4 font-sans font-semibold text-primary hover:text-accent transition-colors list-none">
                <span>{faq.question}</span>
                <svg
                  className="w-4 h-4 shrink-0 text-muted group-open:rotate-180 transition-transform duration-200"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </summary>
              <div className="px-5 pb-4 text-sm text-secondary leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
