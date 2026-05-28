export const APP_NAME = "Evently";
export const APP_DESCRIPTION = "Discover and create unforgettable events. From intimate gatherings to grand conferences, manage everything in one place.";

export const NAV_LINKS = [
  { label: "Events", href: "/events" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const DASHBOARD_NAV = [
  { label: "Overview", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "My Events", href: "/dashboard/events", icon: "Calendar" },
  { label: "Create Event", href: "/dashboard/events/new", icon: "Plus" },
  { label: "Profile", href: "/dashboard/profile", icon: "User" },
  { label: "Settings", href: "/dashboard/settings", icon: "Settings" },
] as const;

export const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin", icon: "BarChart3" },
  { label: "Users", href: "/admin/users", icon: "Users" },
  { label: "Events", href: "/admin/events", icon: "Calendar" },
  { label: "Categories", href: "/admin/categories", icon: "Tag" },
] as const;

export const EVENT_CATEGORIES = [
  { name: "Technology", slug: "technology", color: "#6366f1", description: "Tech meetups, hackathons, and conferences" },
  { name: "Music", slug: "music", color: "#ec4899", description: "Concerts, festivals, and live performances" },
  { name: "Business", slug: "business", color: "#14b8a6", description: "Networking, workshops, and seminars" },
  { name: "Sports", slug: "sports", color: "#f59e0b", description: "Tournaments, races, and fitness events" },
  { name: "Art & Culture", slug: "art-culture", color: "#8b5cf6", description: "Exhibitions, theater, and cultural events" },
  { name: "Food & Drink", slug: "food-drink", color: "#ef4444", description: "Tastings, food festivals, and cooking classes" },
  { name: "Education", slug: "education", color: "#3b82f6", description: "Workshops, courses, and learning events" },
  { name: "Community", slug: "community", color: "#22c55e", description: "Local meetups and community gatherings" },
] as const;

export const PRICING_PLANS = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for getting started",
    features: [
      "Create up to 3 events",
      "Basic RSVP tracking",
      "Email notifications",
      "Public event page",
    ],
    cta: "Get Started",
    highlighted: false,
  },
  {
    name: "Pro",
    price: 19,
    description: "For serious event organizers",
    features: [
      "Unlimited events",
      "Advanced analytics",
      "Custom branding",
      "Priority support",
      "Ticket sales",
      "Custom invite pages",
    ],
    cta: "Start Free Trial",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: 49,
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Dedicated account manager",
      "API access",
      "SSO integration",
      "White-label solution",
      "99.9% uptime SLA",
    ],
    cta: "Contact Sales",
    highlighted: false,
  },
] as const;
