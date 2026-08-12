// ============================================================================
// data.js — starting content, shown until you edit anything in Edit Mode.
// ----------------------------------------------------------------------------
// Once you unlock Edit Mode (owner passphrase) and make a change, that
// change is saved to the database and served to every visitor from then
// on — this file stops being read for that content. It still matters for:
//   - the very first load, before the database has anything saved
//   - a fallback if the database is ever unreachable
// You can still edit it and redeploy any time you want to reset defaults.
// ============================================================================

export const profile = {
  name: "Kaivalya Thombare",
  tagline: "Second-Year Computer Engineering Student & Aspiring Software Developer",
  location: "Mumbai, India",
  // Short bio shown in the About section. Plain text, a few sentences is ideal.
  bio: "I'm a Computer Engineering student at Pillai College of Engineering, currently deep in Data Structures & Algorithms and building toward a career — and eventually a startup — in applied AI. I like building things that work end-to-end: from a React dashboard to a Python model, and shipping them rather than leaving them half-finished.",
  // Big stat row under the hero — edit freely, add/remove entries.
  stats: [
    { label: "Year", value: "2nd" },
    { label: "Focus", value: "DSA + AI" },
    { label: "Based in", value: "Mumbai" },
  ],
};

// Skills — "level" is 0-100 and drives the HUD-style level bar animation.
// Group is used to cluster related skills together in the grid.
export const skills = [
  { name: "Java", level: 70, group: "Languages" },
  { name: "Python", level: 65, group: "Languages" },
  { name: "C", level: 60, group: "Languages" },
  { name: "MATLAB", level: 50, group: "Languages" },
  { name: "HTML / CSS", level: 75, group: "Web" },
  { name: "React", level: 60, group: "Web" },
];

// Projects — shown as a horizontal-scroll gallery.
export const projects = [
  {
    id: "contract-farming-dashboard",
    title: "Contract Farming Management Dashboard",
    description:
      "A frontend layout and interactive graphical dashboard with data entry panels and menus for managing contract farming operations.",
    tags: ["React", "Dashboard", "UI/UX"],
    image: "/projects/placeholder-1.svg",
    link: "", // add a live URL or GitHub link when ready
  },
  {
    id: "iks-fractal-model",
    title: "IKS Fractal Generation Model",
    description:
      "A modular demonstration model utilizing recursive mathematical structures, built in Python to visualize fractal generation.",
    tags: ["Python", "Recursion", "Math"],
    image: "/projects/placeholder-2.svg",
    link: "",
  },
];

// Achievements — certificates and awards, shown as an inline image gallery,
// nothing to click or download. issuer/date are optional — leave "" to hide.
export const achievements = [
  {
    id: "cognithon-2026",
    title: "Cognithon 2026 — Participation",
    issuer: "Cognithon",
    date: "Jul 2026",
    image: "/certificates/placeholder-cert.svg",
  },
  {
    id: "ml-course",
    title: "Machine Learning — Course Completion",
    issuer: "",
    date: "Apr 2026",
    image: "/certificates/placeholder-cert.svg",
  },
];

// Gallery — general photos (events, workshops, behind-the-scenes shots —
// anything that isn't a certificate). Same inline-image layout as
// Achievements, kept as a separate section and a separate list.
export const gallery = [
  {
    id: "gallery-placeholder-1",
    title: "Cognithon 2026 — Team photo",
    caption: "",
    date: "Jul 2026",
    image: "/certificates/placeholder-cert.svg",
  },
];

export const contact = {
  email: "itskv5107.kt@gmail.com",
  linkedin: "https://www.linkedin.com/in/kaivalya-thombare-930a1b386",
  github: "https://github.com/your-username", // placeholder
  resumeUrl: "", // optional: link to a hosted resume PDF/image
  // Formspree (or any form-endpoint service) URL for the working contact
  // form. Sign up free at https://formspree.io using itskv5107.kt@gmail.com,
  // create a form, and paste its endpoint here — every submission is
  // emailed straight to that inbox. Until you do this, submissions are
  // still saved to the in-site Messages panel (visible in Edit Mode) but
  // nothing is emailed.
  formEndpoint: "https://formspree.io/f/your-form-id",
};
