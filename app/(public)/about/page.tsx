"use client";

import { motion } from "framer-motion";
import { Users, Calendar, ShieldCheck, Heart, Sparkles, Award } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const stats = [
    { icon: Calendar, value: "15,000+", label: "Events Hosted" },
    { icon: Users, value: "120,000+", label: "Happy Attendees" },
    { icon: Award, value: "99.8%", label: "Satisfaction Rate" },
  ];

  const values = [
    {
      icon: Sparkles,
      title: "Design Excellence",
      description: "We believe software should be as beautiful as it is functional. Our interface is designed to keep the focus entirely on your event.",
    },
    {
      icon: ShieldCheck,
      title: "Reliability & Trust",
      description: "Event ticketing and scheduling require absolute consistency. We guarantee 99.9% uptime so you never miss an attendee.",
    },
    {
      icon: Heart,
      title: "Community First",
      description: "We build features that foster real human connection. Gathering people together is our core mission.",
    },
  ];

  const team = [
    {
      name: "Tushar Dev",
      role: "Founder & Lead Developer",
      bio: "Passionate about building fast, accessible web experiences.",
      initials: "TD",
    },
    {
      name: "Sarah Chen",
      role: "Head of Product Design",
      bio: "Striving to make event planning simple and visually stunning.",
      initials: "SC",
    },
    {
      name: "Marcus Vance",
      role: "Customer Success Lead",
      bio: "Dedicated to helping organizers run smooth, successful events.",
      initials: "MV",
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 space-y-20">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-6 max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span>Our Story</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          We bring people together
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          Evently was founded in 2025 with a simple goal: to make planning, hosting, and attending events seamless and enjoyable. We build tools that empower organizers to focus on what matters most — creating memorable experiences for their attendees.
        </p>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="grid gap-6 sm:grid-cols-3"
      >
        {stats.map((stat, index) => (
          <motion.div key={index} variants={itemVariants}>
            <Card className="border-border/50 bg-card/40 backdrop-blur-sm">
              <CardContent className="p-6 text-center space-y-3">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-3xl font-extrabold tracking-tight">{stat.value}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>

      {/* Values Section */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">Our Core Values</h2>
          <p className="text-muted-foreground">
            The principles that guide our product and team decisions every day.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-8 md:grid-cols-3"
        >
          {values.map((val, index) => (
            <motion.div key={index} variants={itemVariants} className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                <val.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold">{val.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {val.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Team Section */}
      <section className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">Meet the Team</h2>
          <p className="text-muted-foreground">
            The small, dedicated group of designers, engineers, and support reps behind Evently.
          </p>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid gap-6 sm:grid-cols-3"
        >
          {team.map((member, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="border-border/50 bg-card/25 h-full hover:border-primary/20 transition-all">
                <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xl">
                    {member.initials}
                  </div>
                  <div>
                    <h3 className="font-semibold text-base">{member.name}</h3>
                    <p className="text-xs text-primary font-medium mt-0.5">{member.role}</p>
                    <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
}
