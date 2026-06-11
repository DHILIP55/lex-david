import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Admin from "../lib/models/Admin";
import Hero from "../lib/models/Hero";
import Community from "../lib/models/Community";
import Service from "../lib/models/Service";
import Faq from "../lib/models/Faq";
import Social from "../lib/models/Social";
import Nav from "../lib/models/Nav";

const MONGO_URI = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017/lex-david";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB");

  // Admin
  const existing = await Admin.findOne({ email: "admin@lexdavid.com" });
  if (!existing) {
    const passwordHash = await bcrypt.hash("admin123", 12);
    await Admin.create({ email: "admin@lexdavid.com", passwordHash });
    console.log("Admin created: admin@lexdavid.com / admin123");
  } else {
    console.log("Admin already exists");
  }

  // Hero
  await Hero.findByIdAndUpdate("hero", { words: ["Designing", "Creativity", "& Experience"], backgroundImageUrl: "" }, { upsert: true });
  console.log("Hero seeded");

  // Community
  await Community.findByIdAndUpdate("community", {
    aboutTitle: "About Us", aboutSubtitle: "Studio / Chennai",
    aboutBody: "Lex & David is a creative concept studio based in Chennai. We help brands define how they look, feel, and communicate across brand identity, packaging, merchandise, installations, and fabrication.",
    establishedYear: "Est. 2024",
    cards: [
      { index: "01", title: "What We Do", bgClass: "bg-[var(--orange-color-1)]", body: "We work across five connected disciplines: Brand Design, Packaging Design, Merchandise Graphics and Printing, Installation Design, and Fabrication." },
      { index: "02", title: "Our Approach", bgClass: "bg-[var(--grey-color-1)]", body: "We follow four stages: Understand, Design, Develop, and Deliver." },
      { index: "03", title: "Why Us", bgClass: "bg-[var(--blue-color-1)]", body: "There are studios that make things look good. We make things work and then make them look good doing it." },
    ],
  }, { upsert: true });
  console.log("Community seeded");

  // Services
  await Service.deleteMany({});
  await Service.insertMany([
    { order: 0, index: "01", title: "Brand Experience Design", isVisible: true, tags: ["Logo & Identity", "Brand Strategy", "Visual Language", "Brand Guidelines"], description: "We build brands that don't just look good — they behave with purpose and speak with intent." },
    { order: 1, index: "02", title: "Packaging Design", isVisible: true, tags: ["Structural Design", "Retail Packaging", "Label Design", "Print-Ready Files"], description: "We design packaging that stops people mid-scroll and holds up in the physical world." },
    { order: 2, index: "03", title: "Merchandise & Print", isVisible: true, tags: ["Merchandise Graphics", "Apparel Design", "Print Coordination", "Branded Collateral"], description: "We design merchandise and printed materials that carry your brand beyond screens." },
    { order: 3, index: "04", title: "Installation Design", isVisible: true, tags: ["Retail Environments", "Event Installations", "Exhibition Design", "Experiential Spaces"], description: "We design experiences that fill space with meaning." },
    { order: 4, index: "05", title: "Fabrication", isVisible: true, tags: ["Custom Fabrication", "Material Sourcing", "Vendor Coordination", "Signage Fabrication"], description: "We don't just design it — we build it." },
  ]);
  console.log("Services seeded");

  // FAQs
  await Faq.deleteMany({});
  await Faq.insertMany([
    { categoryName: "General", order: 0, items: [{ question: "What does Lex & David do?", answer: "We are a creative concept studio helping brands define how they look, feel, and communicate.", order: 0 }, { question: "How long does a typical project take?", answer: "It depends on the service. Brand design takes 3–5 weeks; packaging 2–3 weeks; merchandise 5–7 days.", order: 1 }] },
    { categoryName: "Brand Design", order: 1, items: [{ question: "What is brand design?", answer: "The process of creating the complete visual identity of your business.", order: 0 }, { question: "What do I receive at the end?", answer: "Logo variations, colour palette, typography system, usage guidelines, and all source files.", order: 1 }] },
    { categoryName: "Packaging Design", order: 2, items: [{ question: "What kinds of packaging do you design?", answer: "Folding cartons, rigid boxes, mailer boxes, pouches, and product labels.", order: 0 }] },
    { categoryName: "Merchandise & Print", order: 3, items: [{ question: "What kind of merchandise can you design for?", answer: "T-shirts, hoodies, caps, tote bags, mugs, stickers, notebooks, and most standard merchandise products.", order: 0 }] },
    { categoryName: "Installation Design", order: 4, items: [{ question: "What is installation design?", answer: "Creative planning of physical spaces — exhibition stalls, pop-up setups, retail interiors, event backdrops.", order: 0 }] },
    { categoryName: "Fabrication", order: 5, items: [{ question: "Do you fabricate in-house?", answer: "We work with a trusted fabrication partner who handles all physical construction and installation.", order: 0 }] },
  ]);
  console.log("FAQs seeded");

  // Social
  await Social.findByIdAndUpdate("social", {
    items: [
      { label: "Social Media", value: "@lexanddavidstudio", order: 0 },
      { label: "Contact", value: "hello@lexanddavidstudio.com", order: 1 },
      { label: "Number", value: "9636051115", order: 2 },
      { label: "", value: "lexanddavidstudio.com", order: 3 },
    ],
  }, { upsert: true });
  console.log("Social seeded");

  // Nav
  await Nav.findByIdAndUpdate("nav", {
    items: [
      { order: 0, prefixLabel: "", label: "About", type: "link", target: "/about" },
      { order: 1, prefixLabel: "Studio", label: "Work", type: "link", target: "/work" },
      { order: 2, prefixLabel: "Select", label: "Projects", type: "scroll", target: "ourservice" },
      { order: 3, prefixLabel: "Client", label: "FAQ", type: "scroll", target: "faqsection" },
    ],
    mobileFooterLinks: [
      { label: "TERMS & CONDITIONS", order: 0 },
      { label: "DISCLAIMER", order: 1 },
      { label: "PRIVACY POLICY", order: 2 },
    ],
  }, { upsert: true });
  console.log("Nav seeded");

  console.log("\nSeed complete!");
  await mongoose.disconnect();
}

seed().catch((err) => { console.error(err); process.exit(1); });
