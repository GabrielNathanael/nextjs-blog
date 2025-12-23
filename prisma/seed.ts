import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

/* ======================
 * DB SETUP
 * ====================== */

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

/* ======================
 * HELPERS
 * ====================== */

// Picsum image — stable, no 404, no rate limit drama
const picsum = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/630`;

/* ======================
 * SEED
 * ====================== */

async function main() {
  console.log("🌱 Start seeding...");

  /* -------- Categories -------- */

  const categoriesData = [
    { name: "Technology" },
    { name: "Lifestyle" },
    { name: "Food" },
    { name: "Travel" },
    { name: "Education" },
  ];

  const categories = [];

  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });

    categories.push(category);
    console.log(`✅ Category: ${category.name}`);
  }

  /* -------- Admin User -------- */

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    },
  });

  console.log(`✅ Admin: ${admin.email}`);

  /* -------- Posts -------- */

  const postsData = [
    // Technology
    {
      title: "The Future of Web Development in 2025",
      slug: "future-web-development-2025",
      hashId: "tech-001",
      content: "Web development is evolving faster than ever...",
      shortDesc: "Trends shaping web development in 2025.",
      category: "Technology",
    },
    {
      title: "Introduction to Quantum Computing",
      slug: "intro-to-quantum-computing",
      hashId: "tech-002",
      content: "Quantum computing leverages quantum mechanics...",
      shortDesc: "Beginner guide to quantum computing.",
      category: "Technology",
    },
    {
      title: "Building Scalable Microservices with Node.js",
      slug: "scalable-microservices-nodejs",
      hashId: "tech-003",
      content: "Microservices allow scalable system design...",
      shortDesc: "Best practices for Node.js microservices.",
      category: "Technology",
    },

    // Lifestyle
    {
      title: "The Art of Slow Living",
      slug: "art-of-slow-living",
      hashId: "life-001",
      content: "Slow living promotes mindfulness...",
      shortDesc: "Living life at a more intentional pace.",
      category: "Lifestyle",
    },
    {
      title: "Sustainable Habits for a Better Home",
      slug: "sustainable-habits-better-home",
      hashId: "life-002",
      content: "Small sustainable habits make big impact...",
      shortDesc: "Eco-friendly habits for daily life.",
      category: "Lifestyle",
    },
    {
      title: "Mastering Your Morning Routine",
      slug: "mastering-morning-routine",
      hashId: "life-003",
      content: "Morning routines define your day...",
      shortDesc: "Build a productive morning routine.",
      category: "Lifestyle",
    },

    // Food
    {
      title: "Top 10 Healthy Breakfast Ideas",
      slug: "top-10-healthy-breakfast",
      hashId: "food-001",
      content: "Healthy breakfasts boost energy...",
      shortDesc: "Nutritious breakfast ideas.",
      category: "Food",
    },
    {
      title: "The Secret to Perfect Homemade Sourdough",
      slug: "perfect-homemade-sourdough",
      hashId: "food-002",
      content: "Sourdough baking basics...",
      shortDesc: "Bake sourdough at home.",
      category: "Food",
    },
    {
      title: "Exploring the Best Street Food in Asia",
      slug: "street-food-asia",
      hashId: "food-003",
      content: "Asia’s street food culture is vibrant...",
      shortDesc: "Street food journey across Asia.",
      category: "Food",
    },

    // Travel
    {
      title: "A Weekend Guide to Kyoto, Japan",
      slug: "weekend-guide-kyoto",
      hashId: "travel-001",
      content: "Kyoto is rich in culture and history...",
      shortDesc: "48-hour Kyoto travel guide.",
      category: "Travel",
    },
    {
      title: "Hidden Gems in the Italian Countryside",
      slug: "hidden-gems-italy",
      hashId: "travel-002",
      content: "Italy’s countryside hides real beauty...",
      shortDesc: "Explore lesser-known Italy.",
      category: "Travel",
    },
    {
      title: "Budget Travel Tips for Solo Adventurers",
      slug: "budget-travel-solo",
      hashId: "travel-003",
      content: "Solo travel doesn’t need to be expensive...",
      shortDesc: "Travel solo on a budget.",
      category: "Travel",
    },

    // Education
    {
      title: "Effective Study Techniques for Lifelong Learners",
      slug: "effective-study-techniques",
      hashId: "edu-001",
      content: "Effective learning needs strategy...",
      shortDesc: "Study smarter, not harder.",
      category: "Education",
    },
    {
      title: "The Impact of AI on Modern Education",
      slug: "ai-impact-education",
      hashId: "edu-002",
      content: "AI is changing education systems...",
      shortDesc: "AI in modern classrooms.",
      category: "Education",
    },
    {
      title: "How to Learn a New Language in 6 Months",
      slug: "learn-language-6-months",
      hashId: "edu-003",
      content: "Language learning requires consistency...",
      shortDesc: "Framework for rapid language learning.",
      category: "Education",
    },
  ];

  for (const post of postsData) {
    const category =
      categories.find((c) => c.name === post.category) ?? categories[0];

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: {
        title: post.title,
        slug: post.slug,
        hashId: post.hashId,
        content: post.content,
        shortDesc: post.shortDesc,
        published: true,
        thumbnail: picsum(post.slug), // ✅ STABLE
        categoryId: category.id,
        authorId: admin.id,
      },
    });

    console.log(`📝 Post: ${post.title}`);
  }

  console.log("🌱 Seeding finished.");
}

/* ======================
 * RUN
 * ====================== */

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
