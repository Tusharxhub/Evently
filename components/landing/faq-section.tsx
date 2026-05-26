"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "How do I create my first event?",
    answer:
      "After signing up, head to your dashboard and click 'Create Event'. Fill in the details like title, date, location, and description. You can publish it immediately or save it as a draft.",
  },
  {
    question: "Is there a free plan?",
    answer:
      "Yes! Our free plan lets you create up to 3 events with basic RSVP tracking and email notifications. It's perfect for getting started and testing the platform.",
  },
  {
    question: "How does RSVP tracking work?",
    answer:
      "Each event gets a unique invite link. When you share it, guests can respond with Going, Maybe, or Not Going. You'll see all responses in your dashboard in real-time.",
  },
  {
    question: "Can I customize my event page?",
    answer:
      "Pro and Enterprise plans allow custom branding, including your logo, colors, and custom invite pages. Free plans use our default Evently branding.",
  },
  {
    question: "How do I manage multiple organizers?",
    answer:
      "Enterprise plans support team collaboration with role-based access. You can invite team members as editors or viewers for specific events.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards, PayPal, and bank transfers for Enterprise plans. All payments are processed securely through Stripe.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-sm font-medium pr-4">{faq.question}</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm leading-relaxed text-muted-foreground">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <p className="text-sm font-medium text-primary mb-3">FAQ</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-muted-foreground">
            Everything you need to know about Evently.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              faq={faq}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex(openIndex === index ? null : index)
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
}
