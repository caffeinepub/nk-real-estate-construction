import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  FileCheck,
  Home,
  MapPin,
  Search,
  Shield,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import PropertyCard from "../components/PropertyCard";
import { useAvailableListings } from "../hooks/useQueries";

const SAMPLE_LISTINGS = [
  {
    id: BigInt(1),
    title: "Riverside Agricultural Land",
    propertyType: "land" as const,
    price: 125000,
    size: 43560,
    location: "Rajamahendravaram, AP",
    status: "available" as const,
    description:
      "Prime agricultural land along the river with year-round water access.",
    images: ["/assets/generated/land-placeholder-1.dim_600x400.jpg"],
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
  },
  {
    id: BigInt(2),
    title: "Hilltop Residential Plot",
    propertyType: "plot" as const,
    price: 45000,
    size: 8712,
    location: "Rajamahendravaram, AP",
    status: "available" as const,
    description: "Stunning hilltop plot with panoramic views.",
    images: ["/assets/generated/plot-placeholder-1.dim_600x400.jpg"],
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
  },
  {
    id: BigInt(3),
    title: "Industrial Commercial Plot",
    propertyType: "commercial" as const,
    price: 280000,
    size: 21780,
    location: "Rajamahendravaram, AP",
    status: "available" as const,
    description: "Strategic commercial land on the main industrial corridor.",
    images: ["/assets/generated/commercial-placeholder-1.dim_600x400.jpg"],
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
  },
  {
    id: BigInt(4),
    title: "Lakeview Farm Parcel",
    propertyType: "land" as const,
    price: 95000,
    size: 87120,
    location: "Rajamahendravaram, AP",
    status: "available" as const,
    description: "Fertile farm land with scenic views — ideal for agriculture.",
    images: ["/assets/generated/land-placeholder-1.dim_600x400.jpg"],
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
  },
  {
    id: BigInt(5),
    title: "Gated Estate Plot",
    propertyType: "plot" as const,
    price: 62000,
    size: 6534,
    location: "Rajamahendravaram, AP",
    status: "pending" as const,
    description: "Premium plot in a gated estate with all utilities in place.",
    images: ["/assets/generated/plot-placeholder-1.dim_600x400.jpg"],
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
  },
  {
    id: BigInt(6),
    title: "Retail Commercial Land",
    propertyType: "commercial" as const,
    price: 175000,
    size: 15246,
    location: "Rajamahendravaram, AP",
    status: "available" as const,
    description: "High-traffic commercial land in the heart of the city.",
    images: ["/assets/generated/commercial-placeholder-1.dim_600x400.jpg"],
    createdAt: BigInt(0),
    updatedAt: BigInt(0),
  },
];

const STEPS = [
  {
    icon: Search,
    title: "Browse",
    desc: "Explore verified land and plot listings across Rajamahendravaram and nearby areas.",
  },
  {
    icon: FileCheck,
    title: "Inquire",
    desc: "Contact us about any property. Our team responds promptly.",
  },
  {
    icon: Home,
    title: "Own",
    desc: "Complete the transaction securely and receive your title deed.",
  },
];

const STATS = [
  { icon: TrendingUp, value: "100+", label: "Active Listings" },
  { icon: MapPin, value: "Rajamahendravaram", label: "Location" },
  { icon: Shield, value: "Trusted", label: "Platform" },
];

const SERVICES = [
  { icon: "🏠", title: "Residential Construction" },
  { icon: "🏢", title: "Commercial Construction" },
  { icon: "🌍", title: "Land Development" },
  { icon: "🏗", title: "Building Planning & Design" },
  { icon: "📊", title: "Real Estate Consultancy" },
  { icon: "🔑", title: "Property Buying & Selling" },
];

export default function HomePage() {
  const { data: listings } = useAvailableListings();
  const featured = (
    listings && listings.length > 0 ? listings : SAMPLE_LISTINGS
  ).slice(0, 6);

  return (
    <main>
      {/* Hero */}
      <section className="relative h-[600px] overflow-hidden">
        <img
          src="/assets/generated/hero-land.dim_1200x600.jpg"
          alt="Aerial view of land"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 via-foreground/50 to-transparent" />
        <div className="relative container mx-auto h-full flex items-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-2xl"
          >
            <span className="inline-block text-accent font-semibold text-sm tracking-widest uppercase mb-4">
              Premium Land & Plot Sales
            </span>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white leading-tight mb-3">
              Welcome to NK Real Estate &amp; Constructions
            </h1>
            <p className="text-white/90 text-xl font-semibold mb-3">
              Building dreams with trust and quality.
            </p>
            <p className="text-white/70 text-base mb-5 leading-relaxed">
              NK Real Estate &amp; Constructions specializes in residential and
              commercial construction, land development, and property solutions.
            </p>
            <ul className="text-white/80 text-sm mb-8 space-y-1">
              {[
                "Quality Construction",
                "Trusted Real Estate Services",
                "Modern Designs",
                "Customer Satisfaction",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <span className="text-green-400 font-bold">✔</span> {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 text-base px-8"
                data-ocid="hero.primary_button"
              >
                <Link to="/listings">
                  Browse Listings <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/40 text-white hover:bg-white/10 bg-transparent text-base"
                data-ocid="hero.secondary_button"
              >
                <Link to="/listings">View All Properties</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-6">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center"
              >
                <Icon className="w-5 h-5 mb-1 opacity-80" />
                <div className="font-display text-xl font-bold">{value}</div>
                <div className="text-primary-foreground/70 text-sm">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Us */}
      <section className="py-16 bg-secondary/40" data-ocid="about.section">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">
              Who We Are
            </span>
            <h2 className="font-display text-4xl font-bold text-foreground mt-2 mb-6">
              About Us
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              NK Real Estate &amp; Constructions is committed to delivering
              high-quality construction and real estate services. With a strong
              focus on trust, innovation, and customer satisfaction, we help
              clients build their dream homes and invest in valuable properties.
            </p>
            <p className="text-muted-foreground text-base leading-relaxed">
              Our mission is to provide reliable construction and real estate
              solutions with modern design and strong infrastructure.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16" data-ocid="services.section">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">
              What We Offer
            </span>
            <h2 className="font-display text-4xl font-bold text-foreground mt-2">
              Our Services
            </h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES.map(({ icon, title }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-2xl p-6 shadow-card flex items-center gap-4"
                data-ocid={`services.item.${i + 1}`}
              >
                <span className="text-3xl">{icon}</span>
                <h3 className="font-semibold text-foreground text-base">
                  {title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured listings */}
      <section className="py-16 bg-secondary/40 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-end justify-between mb-10"
        >
          <div>
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">
              Latest Properties
            </span>
            <h2 className="font-display text-4xl font-bold text-foreground mt-1">
              Featured Listings
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            className="hidden sm:flex gap-2"
            data-ocid="listings.secondary_button"
          >
            <Link to="/listings">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((listing, i) => (
            <motion.div
              key={listing.id.toString()}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <PropertyCard listing={listing} index={i + 1} />
            </motion.div>
          ))}
        </div>
        <div className="mt-8 flex justify-center sm:hidden">
          <Button
            asChild
            variant="outline"
            className="gap-2"
            data-ocid="listings.secondary_button"
          >
            <Link to="/listings">
              View All Listings <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/60 py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-primary text-sm font-semibold tracking-widest uppercase">
              Simple Process
            </span>
            <h2 className="font-display text-4xl font-bold text-foreground mt-1">
              How It Works
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {STEPS.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                className="bg-card rounded-2xl p-8 shadow-card text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div className="font-display text-sm text-muted-foreground mb-2">
                  Step {i + 1}
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground mb-3">
                  {title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-primary rounded-3xl py-14 px-8"
        >
          <h2 className="font-display text-4xl font-bold text-primary-foreground mb-4">
            Ready to Find Your Land?
          </h2>
          <p className="text-primary-foreground/80 mb-2 text-lg max-w-xl mx-auto">
            Browse our curated listings of verified land and plots in
            Rajamahendravaram.
          </p>
          <p className="text-primary-foreground/70 mb-2 text-base">
            Call us:{" "}
            <a href="tel:+917093846299" className="underline">
              +91 7093846299
            </a>{" "}
            &nbsp;|&nbsp;{" "}
            <a href="tel:+919398442753" className="underline">
              +91 9398442753
            </a>
          </p>
          <p className="text-primary-foreground/70 mb-8 text-base">
            Email:{" "}
            <a href="mailto:padalasai2021@gmail.com" className="underline">
              padalasai2021@gmail.com
            </a>
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-primary hover:bg-white/90 text-base px-10"
            data-ocid="cta.primary_button"
          >
            <Link to="/listings">
              Explore Properties <ArrowRight className="w-4 h-4 inline ml-1" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </main>
  );
}
