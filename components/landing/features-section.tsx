"use client";

import { motion } from "framer-motion";
import {
  Calendar,
  Link2,
  BarChart3,
  Shield,
  Zap,
  Users,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Event Creation",
    description:
      "Create beautiful event pages in seconds with our intuitive builder. Set dates, locations, and capacity limits effortlessly.",
  },
  {
    icon: Link2,
    title: "Shareable Invites",
    description:
      "Generate unique invite links for each event. Track who opened them and monitor RSVP responses in real-time.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description:
      "See attendee trends, response rates, and engagement metrics. Make data-driven decisions for your next event.",
  },
  {
    icon: Users,
    title: "Attendee Management",
    description:
      "View going, maybe, and declined responses at a glance. Export guest lists and send targeted updates.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "Role-based access control keeps your data safe. Control who can view, edit, or manage your events.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Built on modern infrastructure for instant page loads. Your attendees will never wait for a slow page again.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export function FeaturesSection() {
  return (
    <section id="features" className="px-4 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-primary mb-3">Features</p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to run great events
          </h2>
          <p className="mt-4 text-muted-foreground">
            A complete toolkit for event organizers — from creation to
            post-event analytics.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/20 hover:bg-card/80"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
