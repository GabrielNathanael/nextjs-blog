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

// Stable image (no rate limit / 404)
const picsum = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/1200/630`;

// ✅ UNIQUE & DETERMINISTIC hashId
const hashIdFromSlug = (slug: string) => {
  return `post_${slug.replace(/[^a-z0-9]/gi, "_").toLowerCase()}`;
};

/* ======================
 * SEED
 * ====================== */

async function main() {
  console.log("🌱 Start seeding...");

  /* -------- Categories -------- */

  const categoriesData = [
    { name: "Writing" },
    { name: "Learning" },
    { name: "Tech" },
    { name: "Notes" },
    { name: "Career" },
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
    // Tech
    {
      title: "The Future of Web Development in 2025",
      slug: "future-web-development-2025",
      content: "Web development is evolving faster than ever...",
      shortDesc: "Trends shaping web development in 2025.",
      category: "Tech",
    },
    {
      title: "Introduction to Quantum Computing",
      slug: "intro-to-quantum-computing",
      content: "Quantum computing leverages quantum mechanics...",
      shortDesc: "Beginner guide to quantum computing.",
      category: "Tech",
    },
    {
      title: "Building Scalable Microservices with Node.js",
      slug: "scalable-microservices-nodejs",
      content: "Microservices allow scalable system design...",
      shortDesc: "Best practices for Node.js microservices.",
      category: "Tech",
    },

    // Notes
    {
      title: "The Art of Slow Living",
      slug: "art-of-slow-living",
      content: "Slow living promotes mindfulness...",
      shortDesc: "Living life at a more intentional pace.",
      category: "Notes",
    },
    {
      title: "Sustainable Habits for a Better Home",
      slug: "sustainable-habits-better-home",
      content: "Small sustainable habits make big impact...",
      shortDesc: "Eco-friendly habits for daily life.",
      category: "Notes",
    },
    {
      title: "Mastering Your Morning Routine",
      slug: "mastering-morning-routine",
      content: "Morning routines define your day...",
      shortDesc: "Build a productive morning routine.",
      category: "Notes",
    },

    // Career
    {
      title: "Top 10 Healthy Breakfast Ideas",
      slug: "top-10-healthy-breakfast",
      content: "Healthy breakfasts boost energy...",
      shortDesc: "Nutritious breakfast ideas.",
      category: "Career",
    },
    {
      title: "The Secret to Perfect Homemade Sourdough",
      slug: "perfect-homemade-sourdough",
      content: "Sourdough baking basics...",
      shortDesc: "Bake sourdough at home.",
      category: "Career",
    },
    {
      title: "Exploring the Best Street Career in Asia",
      slug: "street-career-asia",
      content: "Asia’s street career culture is vibrant...",
      shortDesc: "Street career journey across Asia.",
      category: "Career",
    },

    // Travel / Career
    {
      title: "A Weekend Guide to Kyoto, Japan",
      slug: "weekend-guide-kyoto",
      content: "Kyoto is rich in culture and history...",
      shortDesc: "48-hour Kyoto travel guide.",
      category: "Career",
    },
    {
      title: "Hidden Gems in the Italian Countryside",
      slug: "hidden-gems-italy",
      content: "Italy’s countryside hides real beauty...",
      shortDesc: "Explore lesser-known Italy.",
      category: "Career",
    },
    {
      title: "Budget Career Tips for Solo Adventurers",
      slug: "budget-career-solo",
      content: "Solo travel doesn’t need to be expensive...",
      shortDesc: "Travel solo on a budget.",
      category: "Career",
    },

    // Learning
    {
      title: "Effective Study Techniques for Lifelong Learners",
      slug: "effective-study-techniques",
      content: "Effective learning needs strategy...",
      shortDesc: "Study smarter, not harder.",
      category: "Learning",
    },
    {
      title: "The Impact of AI on Modern Learning",
      slug: "ai-impact-learning",
      content: "AI is changing learning systems...",
      shortDesc: "AI in modern classrooms.",
      category: "Learning",
    },
    {
      title: "How to Learn a New Language in 6 Months",
      slug: "learn-language-6-months",
      content: "Language learning requires consistency...",
      shortDesc: "Framework for rapid language learning.",
      category: "Learning",
    },
  ];

  for (const post of postsData) {
    const category =
      categories.find((c) => c.name === post.category) ?? categories[0];

    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {
        title: post.title,
        content: post.content,
        shortDesc: post.shortDesc,
        published: true,
        thumbnail: picsum(post.slug),
        categoryId: category.id,
      },
      create: {
        title: post.title,
        slug: post.slug,
        hashId: hashIdFromSlug(post.slug), // ✅ FIX UTAMA
        content: post.content,
        shortDesc: post.shortDesc,
        published: true,
        thumbnail: picsum(post.slug),
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
