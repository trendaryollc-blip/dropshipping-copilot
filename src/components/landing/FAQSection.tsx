"use client"

import { ChevronDown } from "lucide-react"
import { Reveal } from "./Reveal"
import { useState } from "react"

const faqs = [
  {
    question: "Is DropEase really free to start?",
    answer: "Yes, you can create a free account and get access to core research tools, sample AI listings, and basic supplier matching without entering any payment details. Upgrade when you need more power.",
  },
  {
    question: "How accurate are the AI product scores?",
    answer: "Our AI analyzes demand trends, competition levels, margin potential, and supplier reliability across multiple marketplaces. Users see a 94% match rate for products with high sales potential.",
  },
  {
    question: "Can I connect my existing Shopify or WooCommerce store?",
    answer: "Yes. DropEase integrates directly with Shopify, WooCommerce, eBay, and TikTok Shop. You can import products, sync orders, and publish AI-generated listings in one click.",
  },
  {
    question: "Do I need technical skills to use DropEase?",
    answer: "No. DropEase is built for dropshippers, not developers. The interface is designed to be simple — describe what you want, let AI do the research, list products, and automate orders in minutes.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely. Starter is free forever, and paid plans can be cancelled anytime from your account settings. There are no contracts or hidden fees.",
  },
  {
    question: "How is DropEase different from manual research tools?",
    answer: "DropEase replaces scattered spreadsheets, browser tabs, and manual guesswork with one AI-powered workspace. It automates product scoring, supplier comparison, listing creation, and order tracking so you can move faster with confidence.",
  },
]

export function FAQSection() {
  return (
    <section id="faq" className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" aria-hidden="true" />
      <Reveal className="mx-auto max-w-3xl">
        <div className="mb-14 text-center">
          <p className="section-label">FAQ</p>
          <h2 className="mt-4 text-4xl font-black tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Get answers to common questions.
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} index={index} />
          ))}
        </div>
      </Reveal>
    </section>
  )
}

function FAQItem({ question, answer, index }: { question: string; answer: string; index: number }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`rounded-[1.5rem] border border-white/40 bg-white/70 shadow-lg shadow-slate-950/5 backdrop-blur-xl transition-all duration-300 dark:border-white/10 dark:bg-white/5 ${open ? "border-violet-200 dark:border-violet-700/50" : ""}`}
      style={{ transitionDelay: `${index * 40}ms` }}
    >
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
        aria-expanded={open}
      >
        <span className="text-base font-bold text-slate-950 dark:text-white">{question}</span>
        <ChevronDown className={`size-5 shrink-0 text-slate-500 transition-transform duration-300 dark:text-slate-400 ${open ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <p className="px-6 pb-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">{answer}</p>
      </div>
    </div>
  )
}
