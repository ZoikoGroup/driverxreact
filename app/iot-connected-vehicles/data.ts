// All page content lives here so it can be edited (or later fetched from an API) without touching the UI.
export const tabs = [
  { label: "Prepaid", href: "/prepaid-plans" },
  { label: "Postpaid", href: "/postpaid-plans" },
  { label: "Data-Only", href: "/data-only-plans" },
  { label: "Business", href: "/business-plans" },
  { label: "Top-Ups", href: "/top-up-plans" },
  { label: "IoT & Connected Vehicles", href: "/iot-connected-vehicles", active: true },
];

export const images = {
  hero: "/images/new/DriverX-branded delivery vans parked at a logistics depot at sunrise.png",
  deployment: "/images/new/A fleet operations manager reviewing a tablet beside a row of delivery vans.png",
  cta: "/images/new/image (45).png",
};

export const solutions = [
  { icon: "Car", title: "Fleet & Telematics", desc: "Connectivity for vehicle trackers, dashcams and OBD-II devices.", value: "Fleet & Telematics" },
  { icon: "MapPin", title: "Asset Tracking", desc: "Connect high-value equipment, tools and mobile assets.", value: "Asset Tracking" },
  { icon: "Boxes", title: "Smart Logistics", desc: "Connect sensors and devices across routes, operations and supply chains.", value: "Smart Logistics" },
  { icon: "Store", title: "Retail & POS", desc: "Mobile connectivity for POS terminals, kiosks and unattended devices.", value: "Retail & POS" },
  { icon: "HardHat", title: "Field Workforces", desc: "Connectivity options for tablets and rugged field devices.", value: "Field Workforces" },
  { icon: "Cpu", title: "OEM & Embedded SIM", desc: "Explore SIM/eSIM integration for connected products, subject to solution design and verification.", value: "OEM & Embedded SIM" },
];

export const deviceTypes = ["Vehicle tracker", "Dashcam", "OBD-II device", "POS terminal", "Rugged tablet", "Sensor / gateway", "Other"];
export const deviceScales = ["1–10 devices", "11–50 devices", "51–250 devices", "251–1,000 devices", "1,000+ devices"];
export const locations = ["United States", "Canada", "Mexico", "Multiple countries"];
export const dataUse = ["Under 1 GB / device", "1–5 GB / device", "5–20 GB / device", "Shared data pool"];

export const proposalCovers = [
  "SIM / eSIM options (for eligible devices)",
  "Per-device or shared data configurations",
  "Activation and fleet management approach",
  "API integration requirements (as needed)",
];

export const deployment = [
  { icon: "FileText", title: "SIM & eSIM options", desc: "Flexible connectivity for eligible devices." },
  { icon: "Layers", title: "Data configuration", desc: "Right-size data for your devices and operations." },
  { icon: "Smartphone", title: "Connectivity visibility", desc: "Operational insight into usage and device status." },
  { icon: "Settings", title: "Integration planning", desc: "Work with our team on your integration requirements." },
];

export const rollout = [
  { title: "Discover needs", desc: "Understand your use case, devices, usage profile and locations." },
  { title: "Verify coverage & device fit", desc: "Confirm coverage, device compatibility and integration approach." },
  { title: "Pilot & validate", desc: "Where applicable, test representative devices and connectivity for your operation." },
  { title: "Approve proposal & deploy", desc: "Finalize signed terms, then activate your devices." },
];

export const faqs = [
  { q: "How does custom IoT pricing work?", a: "Pricing depends on device count, data needs and coverage. Share your requirements and we'll prepare a tailored proposal." },
  { q: "Can I bring existing devices?", a: "In many cases yes, subject to compatibility and network verification." },
  { q: "Are pooled data and APIs available?", a: "Shared data pools and API integration can be scoped where applicable to your solution." },
  { q: "What happens before deployment?", a: "We confirm coverage and device fit, and may run a pilot before full rollout." },
  { q: "Can this work across multiple countries?", a: "Multi-country coverage can be assessed during solution design." },
  { q: "Do you supply devices or GPS tracking software?", a: "DriverX focuses on connectivity. Talk to a specialist about device and software options." },
];
