export interface BlogPostItem {
  id: string;
  slug: string;
  href: string;
  title: string;
  category: string;
  image: string;
  excerpt: string;
  date: string;
  readTime: string;
  metaDescription: string;
}

export const BLOGS: BlogPostItem[] = [
  {
    id: "1",
    slug: "why-smart-fleets-and-gig-platforms-are-moving-fast-on-esim",
    href: "/blogs/why-smart-fleets-and-gig-platforms-are-moving-fast-on-esim",
    title: "Why Smart Fleets And Gig Platforms Are Moving Fast On eSIM",
    category: "FLEET CONNECTIVITY",
    image: "/images/Frame 1707483089.png",
    excerpt:
      "Modern fleet and gig platforms depend on seamless, reliable connectivity. Physical SIM cards can’t keep up with the speed of deployment required today. Discover how eSIM technology enables faster, smarter, and scalable fleet operations.",
    date: "Sep 18, 2026",
    readTime: "5 min read",
    metaDescription:
      "Discover why smart fleets and gig platforms are adopting eSIM technology for faster provisioning, multi-carrier coverage, and simplified management.",
  },
  {
    id: "2",
    slug: "the-connectivity-gap-thats-costing-your-time-and-money",
    href: "/blogs/the-connectivity-gap-thats-costing-your-time-and-money",
    title: "The Connectivity Gap That’s Costing Your Time and Money",
    category: "OPERATIONS & DOWNTIME",
    image: "/images/Frame 1707483089 (1).png",
    excerpt:
      "Every moment of downtime impacts revenue and efficiency. Whether you manage fleets, delivery teams, or field operations, unreliable connectivity slows communication, tracking, and transactions.",
    date: "Sep 25, 2026",
    readTime: "6 min read",
    metaDescription:
      "Learn how connection drops stall operations and how multi-network redundancy with DriverX eliminates dead zones and lost revenue.",
  },
  {
    id: "3",
    slug: "the-infrastructure-edge-that-keeps-fleets-moving",
    href: "/blogs/the-infrastructure-edge-that-keeps-fleets-moving",
    title: "The Infrastructure Edge That Keeps Fleets Moving",
    category: "TELECOM INFRASTRUCTURE",
    image: "/images/Frame 1707483089 (2).png",
    excerpt:
      "Mobility is a network system. Your connectivity should be too. Explore how telecom-grade multi-carrier infrastructure, API provisioning, and real-time telemetry power modern enterprise fleets.",
    date: "Sep 30, 2026",
    readTime: "6 min read",
    metaDescription:
      "Explore DriverX telecom-grade infrastructure built for enterprise mobility, API automation, and 99.9% fleet uptime.",
  },
  {
    id: "4",
    slug: "reliable-delivery-driver-mobile-service",
    href: "/blogs/reliable-delivery-driver-mobile-service",
    title: "Reliable Delivery Driver Mobile Service: Choosing the Right Phone Plan for Gig Work",
    category: "GIG DRIVER GUIDES",
    image: "/images/blogs/Header.jpg",
    excerpt:
      "Finding the right phone plan becomes easier when you compare network coverage, high-speed data, unlimited talk and text, flexible prepaid vs. postpaid billing, and real-world gig requirements.",
    date: "Oct 6, 2026",
    readTime: "7 min read",
    metaDescription:
      "Learn how to choose reliable delivery driver mobile service, including prepaid, postpaid, unlimited talk and text, data, coverage and affordable plans.",
  },
];
