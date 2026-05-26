import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../app/generated/prisma/client";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Technology", slug: "technology", color: "#6366f1", description: "Tech meetups, hackathons, and conferences" },
  { name: "Music", slug: "music", color: "#ec4899", description: "Concerts, festivals, and live performances" },
  { name: "Business", slug: "business", color: "#14b8a6", description: "Networking, workshops, and seminars" },
  { name: "Sports", slug: "sports", color: "#f59e0b", description: "Tournaments, races, and fitness events" },
  { name: "Art & Culture", slug: "art-culture", color: "#8b5cf6", description: "Exhibitions, theater, and cultural events" },
  { name: "Food & Drink", slug: "food-drink", color: "#ef4444", description: "Tastings, food festivals, and cooking classes" },
  { name: "Education", slug: "education", color: "#3b82f6", description: "Workshops, courses, and learning events" },
  { name: "Community", slug: "community", color: "#22c55e", description: "Local meetups and community gatherings" },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Create categories
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      create: cat,
      update: cat,
    });
  }
  console.log(`✅ Created ${categories.length} categories`);

  // Create admin user
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@evently.com" },
    create: {
      name: "Admin User",
      email: "admin@evently.com",
      password: adminPassword,
      role: "ADMIN",
    },
    update: {
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin user: admin@evently.com / admin123`);

  // Create demo user
  const demoPassword = await bcrypt.hash("demo1234", 12);
  const demoUser = await prisma.user.upsert({
    where: { email: "demo@evently.com" },
    create: {
      name: "Demo User",
      email: "demo@evently.com",
      password: demoPassword,
      role: "USER",
    },
    update: {
      password: demoPassword,
    },
  });
  console.log(`✅ Demo user: demo@evently.com / demo1234`);

  // Get category IDs
  const cats = await prisma.category.findMany();
  const catMap = Object.fromEntries(cats.map((c) => [c.slug, c.id]));

  // Create sample events
  const sampleEvents = [
    {
      title: "React Summit 2025",
      slug: "react-summit-2025",
      description: "The biggest React conference in the world. Join us for three days of talks, workshops, and networking with the React community. Learn about the latest features, best practices, and the future of React development.",
      location: "San Francisco, CA",
      venue: "Moscone Center",
      eventDate: new Date("2025-09-15T09:00:00Z"),
      endDate: new Date("2025-09-17T18:00:00Z"),
      capacity: 2000,
      price: 0,
      isFree: true,
      isPublished: true,
      categoryId: catMap["technology"],
      organizerId: admin.id,
    },
    {
      title: "Jazz in the Park",
      slug: "jazz-in-the-park",
      description: "An evening of smooth jazz under the stars. Bring your blankets and enjoy world-class musicians performing in the beautiful setting of Central Park.",
      location: "New York, NY",
      venue: "Central Park",
      eventDate: new Date("2025-08-20T18:00:00Z"),
      endDate: new Date("2025-08-20T22:00:00Z"),
      price: 25,
      isFree: false,
      isPublished: true,
      categoryId: catMap["music"],
      organizerId: admin.id,
    },
    {
      title: "Startup Networking Mixer",
      slug: "startup-networking-mixer",
      description: "Connect with fellow entrepreneurs, investors, and innovators. Share ideas, find co-founders, and grow your professional network over drinks and appetizers.",
      location: "Austin, TX",
      venue: "Capital Factory",
      eventDate: new Date("2025-07-10T17:00:00Z"),
      capacity: 150,
      price: 0,
      isFree: true,
      isPublished: true,
      categoryId: catMap["business"],
      organizerId: demoUser.id,
    },
    {
      title: "5K Fun Run for Charity",
      slug: "5k-fun-run-charity",
      description: "Join us for a fun-filled 5K run supporting local children's charities. Walkers, joggers, and runners of all levels are welcome!",
      location: "Chicago, IL",
      venue: "Millennium Park",
      eventDate: new Date("2025-10-05T07:00:00Z"),
      capacity: 500,
      price: 30,
      isFree: false,
      isPublished: true,
      categoryId: catMap["sports"],
      organizerId: demoUser.id,
    },
    {
      title: "Modern Art Exhibition",
      slug: "modern-art-exhibition",
      description: "Explore contemporary masterpieces from emerging artists around the world. This curated exhibition features over 100 pieces spanning paintings, sculptures, and digital art.",
      location: "Los Angeles, CA",
      venue: "LACMA",
      eventDate: new Date("2025-11-01T10:00:00Z"),
      endDate: new Date("2025-11-30T17:00:00Z"),
      price: 15,
      isFree: false,
      isPublished: true,
      categoryId: catMap["art-culture"],
      organizerId: admin.id,
    },
    {
      title: "Farm-to-Table Dinner Experience",
      slug: "farm-to-table-dinner",
      description: "A unique dining experience featuring a five-course meal prepared with locally sourced, seasonal ingredients. Meet the farmers and chefs behind your food.",
      location: "Portland, OR",
      venue: "Urban Farm Kitchen",
      eventDate: new Date("2025-08-15T18:30:00Z"),
      capacity: 40,
      price: 85,
      isFree: false,
      isPublished: true,
      categoryId: catMap["food-drink"],
      organizerId: demoUser.id,
    },
  ];

  for (const event of sampleEvents) {
    await prisma.event.upsert({
      where: { slug: event.slug },
      create: event,
      update: event,
    });
  }
  console.log(`✅ Created ${sampleEvents.length} sample events`);

  // Create some RSVPs
  const events = await prisma.event.findMany({ where: { isPublished: true } });
  for (const event of events.slice(0, 3)) {
    await prisma.rsvp.upsert({
      where: {
        eventId_userId: { eventId: event.id, userId: demoUser.id },
      },
      create: {
        eventId: event.id,
        userId: demoUser.id,
        status: "GOING",
        note: "Looking forward to it!",
      },
      update: {},
    });
  }
  console.log("✅ Created sample RSVPs");

  console.log("\n🎉 Seed complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
