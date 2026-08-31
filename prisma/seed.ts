import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    slug: "ethiopia-yirgacheffe",
    name: "Ethiopia Yirgacheffe",
    description:
      "A bright, floral single-origin with notes of bergamot and stone fruit. Light roast, washed process.",
    category: "Beans",
    priceCents: 1800,
    stock: 42,
    imageSeed: "coffee-beans-1",
  },
  {
    slug: "colombia-huila",
    name: "Colombia Huila",
    description:
      "Balanced medium roast with caramel sweetness and a clean, nutty finish. Great everyday cup.",
    category: "Beans",
    priceCents: 1600,
    stock: 60,
    imageSeed: "coffee-beans-2",
  },
  {
    slug: "sumatra-mandheling",
    name: "Sumatra Mandheling",
    description:
      "Full-bodied and earthy with low acidity and notes of dark chocolate and cedar.",
    category: "Beans",
    priceCents: 1700,
    stock: 35,
    imageSeed: "coffee-beans-3",
  },
  {
    slug: "ceramic-pour-over-dripper",
    name: "Ceramic Pour-Over Dripper",
    description:
      "A classic cone-shaped dripper with a ribbed interior for even extraction. Fits standard 02 filters.",
    category: "Brewers",
    priceCents: 3200,
    stock: 24,
    imageSeed: "pour-over-1",
  },
  {
    slug: "glass-carafe-brewer",
    name: "Glass Carafe Pour-Over Set",
    description:
      "Borosilicate glass dripper and carafe in one piece — brews directly into a 500ml serving carafe.",
    category: "Brewers",
    priceCents: 4500,
    stock: 18,
    imageSeed: "pour-over-2",
  },
  {
    slug: "stainless-french-press",
    name: "Stainless Steel French Press",
    description:
      "Double-walled insulated press that keeps coffee hot for over an hour. 34oz capacity.",
    category: "Brewers",
    priceCents: 5200,
    stock: 20,
    imageSeed: "french-press-1",
  },
  {
    slug: "manual-burr-grinder",
    name: "Manual Conical Burr Grinder",
    description:
      "Adjustable ceramic burrs for pour-over through espresso grind sizes. Compact and travel-friendly.",
    category: "Grinders",
    priceCents: 6800,
    stock: 15,
    imageSeed: "grinder-1",
  },
  {
    slug: "electric-burr-grinder",
    name: "Electric Conical Burr Grinder",
    description:
      "31 grind settings with a built-in timer. Steel conical burrs for consistent, low-heat grinding.",
    category: "Grinders",
    priceCents: 12900,
    stock: 10,
    imageSeed: "grinder-2",
  },
  {
    slug: "gooseneck-kettle",
    name: "Gooseneck Pour-Over Kettle",
    description:
      "Precision spout for controlled pouring, with a built-in thermometer on the lid. 900ml capacity.",
    category: "Accessories",
    priceCents: 4900,
    stock: 28,
    imageSeed: "kettle-1",
  },
  {
    slug: "digital-coffee-scale",
    name: "Digital Coffee Scale with Timer",
    description:
      "0.1g precision scale with an integrated timer, ideal for dialing in pour-over ratios.",
    category: "Accessories",
    priceCents: 3900,
    stock: 33,
    imageSeed: "scale-1",
  },
  {
    slug: "paper-filters-100pk",
    name: "Cone Filters (100-pack)",
    description:
      "Unbleached natural paper filters sized for standard 02 cone drippers.",
    category: "Accessories",
    priceCents: 900,
    stock: 80,
    imageSeed: "filters-1",
  },
];

async function main() {
  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: product,
      create: product,
    });
  }
  console.log(`Seeded ${products.length} products.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
