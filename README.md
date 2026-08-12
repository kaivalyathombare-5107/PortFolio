<div align="center">

<!-- Animated banner using SVG -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=200&section=header&text=Kaivalya%20Thombare&fontSize=50&fontColor=fff&animation=twinkling&fontAlignY=35&desc=Portfolio%20%E2%80%94%20Built%20Different&descAlignY=60&descSize=18" width="100%" />

<br/>

<!-- Typing animation badge -->
[![Typing SVG](https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=22&pause=1000&color=5CE1E6&center=true&vCenter=true&width=600&lines=React+%2B+Vite+%2B+Vercel+Serverless;Dark+%26+Animated+Single-Page+Portfolio;Live+Edit+Mode+%E2%80%94+No+Redeploy+Needed;Scroll+%E2%80%94+Parallax+%E2%80%94+Game-like+Feel)](https://git.io/typing-svg)

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white" />
  <img src="https://img.shields.io/badge/Upstash-Redis-00C389?style=for-the-badge&logo=redis&logoColor=white" />
  <img src="https://img.shields.io/badge/CSS-No_Framework-FF6FAE?style=for-the-badge&logo=css3&logoColor=white" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/License-MIT-8B7CF6?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Live-5CE1E6?style=flat-square&logo=statuspage" />
  <img src="https://img.shields.io/badge/PRs-Welcome-FF6FAE?style=flat-square" />
</p>

</div>

---

## ✦ What This Is

A **dark, animated, game-feel single-page portfolio** — no animation libraries, no UI frameworks, just React, plain CSS, and a few clever scroll tricks. Built to feel like scrolling through a scene, not reading a document.

Every section you scroll past **animates in and back out** as you move through the page. A HUD-style progress bar tracks your position. Ambient parallax orbs drift at different depths behind the content.

And the whole site is **live-editable** from a hidden owner panel — add projects, reorder cards, upload images — all without touching code or redeploying.

---

## ✦ Feature Highlights

<table>
<tr>
<td width="50%">

### 🎮 Scroll Experience
- Game-like scrolling — sections animate **in and out** as you scroll
- Continuous parallax depth layers that drift behind content
- HUD progress bar (cyan glow) pinned to the very top edge
- Direction-aware reveal: enter slides up, exit retreats upward
- `prefers-reduced-motion` respected — no motion for users who need it

</td>
<td width="50%">

### 🔐 Owner / Edit Mode
- Hidden `·` dot in the footer — invisible to visitors
- Passphrase-protected session (signed `HttpOnly` cookie, 12h TTL)
- Add, remove, and **drag to reorder** items in every section
- Changes save to Redis instantly — no redeploy, works from any device
- All edit controls are invisible to non-owners

</td>
</tr>
<tr>
<td width="50%">

### 🗄️ Backend & Storage
- Vercel Serverless Functions (`/api/*`) — no Express, no server
- Content stored in **Upstash Redis** (free tier)
- Images & PDFs stored in **Vercel Blob** (public CDN)
- Contact messages saved to Redis and viewable in the Messages panel
- Session cookie signed with `AUTH_SECRET` — tamper-proof

</td>
<td width="50%">

### 🎨 Design System
- Pure CSS design tokens — one file to re-theme everything
- Accent palette: Cyan `#5CE1E6` · Violet `#8B7CF6` · Pink `#FF6FAE`
- Dark background `#08090b` with layered surfaces
- `Inter` display font + `JetBrains Mono` for code/labels
- All animations defined in CSS, zero JS animation libraries

</td>
</tr>
</table>

---

## ✦ Tech Stack

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend                                 │
│  React 18  ·  Vite 5  ·  Plain CSS  ·  IntersectionObserver   │
├─────────────────────────────────────────────────────────────────┤
│                         Backend                                 │
│  Vercel Serverless Functions  ·  HttpOnly Cookies              │
├─────────────────────────────────────────────────────────────────┤
│                         Storage                                 │
│  Upstash Redis  ·  Vercel Blob (images/PDFs)                   │
├─────────────────────────────────────────────────────────────────┤
│                       Integrations                              │
│  Formspree (contact email)  ·  Vercel CLI (local dev)          │
└─────────────────────────────────────────────────────────────────┘
```

---

## ✦ Project Structure

```
📁 portfolio/
│
├── 📁 api/                         ← Vercel Serverless Functions
│   ├── auth.js                     ← POST/DELETE: passphrase check + session cookie
│   ├── data.js                     ← GET (public) / PUT (owner): portfolio content
│   ├── messages.js                 ← POST (public) / GET (owner): contact messages
│   └── upload.js                   ← POST (owner): image/PDF → Vercel Blob
│
├── 📁 lib/
│   ├── auth.js                     ← Cookie signing, passphrase verification
│   └── redis.js                    ← Upstash Redis client wrapper
│
├── 📁 src/
│   ├── App.jsx                     ← Root: all sections, content state, commit()
│   ├── data.js                     ← Default content (shown before first DB save)
│   │
│   ├── 📁 components/
│   │   ├── Hero.jsx                ← Animated gradient orb + photo
│   │   ├── About.jsx               ← Bio + editable stats row
│   │   ├── Skills.jsx              ← Skill cards, draggable in owner mode
│   │   ├── Projects.jsx            ← Horizontal gallery + upload form
│   │   ├── Gallery.jsx             ← Shared carousel (Projects, Achievements, Photos)
│   │   ├── Achievements.jsx        ← Certificate image gallery
│   │   ├── PhotoGallery.jsx        ← Event/workshop photo gallery
│   │   ├── Contact.jsx             ← Links + working Formspree contact form
│   │   ├── Messages.jsx            ← Owner-only saved message viewer
│   │   ├── OwnerAccess.jsx         ← Hidden unlock button + passphrase modal
│   │   ├── Navbar.jsx              ← Sticky nav with section links
│   │   ├── Footer.jsx              ← Copyright + exit edit mode
│   │   └── WelcomeIntro.jsx        ← First-load intro animation
│   │
│   ├── 📁 hooks/
│   │   ├── useReveal.js            ← Direction-aware scroll reveal (enter + exit)
│   │   ├── useScrollProgress.js    ← Writes --scroll-y / --scroll-progress to CSS
│   │   ├── useCarousel.js          ← Scroll progress + arrow navigation
│   │   └── useDragSort.js          ← Drag-and-drop reorder for lists + grids
│   │
│   ├── 📁 lib/
│   │   └── api.js                  ← fetch() wrappers for all /api/* routes
│   │
│   └── 📁 styles/
│       ├── index.css               ← Design tokens, resets, scroll reveal, drag UI
│       └── components.css          ← Per-section and per-component styles
│
├── 📁 public/
│   ├── certificates/               ← Placeholder certificate SVGs
│   └── projects/                   ← Placeholder project SVGs
│
├── .env                            ← Template — copy to .env.local, fill in values
├── vite.config.js
└── package.json
```

---

## ✦ Local Development

### Prerequisites

- Node.js 18+
- Vercel CLI (`npm i -g vercel`)
- A Vercel account with the project linked

### Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Link to your Vercel project (one-time)
vercel link

# 3. Pull real environment variables from Vercel
vercel env pull .env.local

# 4. Start the full local stack (Vite + serverless functions)
vercel dev
```

> ⚠️ `npm run dev` starts Vite only — the `/api` routes won't work.
> Always use `vercel dev` for the full experience.

```bash
# Frontend only (content/login/uploads won't work)
npm run dev     # → http://localhost:5173

# Full stack (recommended)
vercel dev      # → http://localhost:3000
```

---

## ✦ Environment Variables

Set these in **Vercel → Project → Settings → Environment Variables**.
Never prefix with `VITE_` — that would expose them to every visitor's browser.

| Variable | Required | Description |
|---|:---:|---|
| `OWNER_PASSPHRASE` | ✅ | The passphrase that unlocks Edit Mode. Make it long and unique. |
| `AUTH_SECRET` | ✅ | Signs the session cookie. Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `UPSTASH_REDIS_REST_URL` | ✅ | Auto-added when you attach an Upstash Redis database on Vercel. |
| `UPSTASH_REDIS_REST_TOKEN` | ✅ | Auto-added alongside the URL above. |
| `BLOB_READ_WRITE_TOKEN` | ✅ | Auto-added when you create a Vercel Blob store. |

For local dev, run `vercel env pull .env.local` — this fills everything in automatically from your Vercel project.

---

## ✦ First-Time Vercel Setup

```
1. Push this repo to GitHub
         │
         ▼
2. vercel.com → Add New Project → import the repo
   Framework: Vite (auto-detected)
   Build command: npm run build
   Output dir: dist
         │
         ▼
3. Project → Storage tab
   ├── Marketplace Database Providers → Upstash → Create Redis → Connect
   └── Create Database → Blob → Public access → ✅ Add read-write token
         │
         ▼
4. Settings → Environment Variables
   ├── OWNER_PASSPHRASE = <your-passphrase>
   └── AUTH_SECRET = <random-hex-string>
         │
         ▼
5. Deployments → ⋯ → Redeploy
         │
         ▼
6. Done ✦
```

---

## ✦ Edit Mode — How to Use

```
Scroll to the very bottom of your live site
              │
              ▼
Click the small · dot next to the copyright line
(it's invisible to visitors — intentionally)
              │
              ▼
Enter your OWNER_PASSPHRASE
              │
              ▼
Edit Mode is now active
  ├── Every section shows "+ Add / Remove" controls
  ├── Drag the ⠿ handle to reorder cards
  ├── Upload images/PDFs directly from the form
  └── All changes save to Redis instantly
              │
              ▼
Click "Exit edit mode" in the footer when done
```

> Session is protected by a signed `HttpOnly` cookie — 12 hour TTL.
> It cannot be read or forged from the browser console.

---

## ✦ Contact Form Setup (Formspree)

The contact form emails you via [Formspree](https://formspree.io) — free tier is enough.

```bash
# 1. Create a Formspree account at formspree.io
# 2. Create a new form — name it "Portfolio Contact"
# 3. Copy the endpoint: https://formspree.io/f/xxxxxxxx
# 4. Paste it into src/data.js:

export const contact = {
  formEndpoint: "https://formspree.io/f/xxxxxxxx",  # ← here
  ...
};

# 5. Commit and push
```

> Until Formspree is connected, contact messages are still saved to Redis
> and visible in the **Messages panel** (owner mode only).

---

## ✦ Deployment

Every push to `main` redeploys automatically via Vercel's GitHub integration.
You only need to push for **design or code changes** — content is live-edited
through the owner panel and saved directly to the database.

```bash
git add .
git commit -m "update design"
git push origin main
# → Vercel picks it up and redeploys in ~30s
```

---

## ✦ Scroll Animation System

The scroll engine is built entirely without animation libraries:

```
useScrollProgress()
  └── writes --scroll-y and --scroll-progress to <html> every rAF frame
        │
        ├── CSS parallax layers read --scroll-y to drift at 3 different speeds
        ├── HUD progress bar width = calc(var(--scroll-progress) * 100%)
        └── Hero orb / grid translate with the scroll for depth

useReveal(options)
  └── IntersectionObserver watches each element
        ├── Scrolling DOWN → .is-visible added (slides up, fades in)
        ├── Scrolling UP   → .is-visible removed (retreats upward, fades out)
        └── once: true     → reveals once and stays (used on Contact / last section)
```

---

## ✦ Security Notes

- The `OWNER_PASSPHRASE` is checked **server-side only** — never sent to the browser
- Session cookie is `HttpOnly; Secure; SameSite=Strict` — unreadable from JS
- All write endpoints (`PUT /api/data`, `POST /api/upload`) verify the cookie before acting
- `BLOB_READ_WRITE_TOKEN` lives only in server environment — never in the client bundle
- Never prefix secrets with `VITE_` — anything prefixed that way is shipped to every visitor

---

## ✦ License

```
MIT License — use, modify, and deploy freely.
If you build something cool with it, a ⭐ is always appreciated.
```

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer&animation=twinkling" width="100%" />

**Built by [Kaivalya Thombare](https://www.linkedin.com/in/kaivalya-thombare-930a1b386)**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kaivalya-thombare-930a1b386)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-username)

*Computer Engineering Student · Mumbai, India · Open to Opportunities*

</div>
