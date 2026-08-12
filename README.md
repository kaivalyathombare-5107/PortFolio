# Kaivalya Thombare — Portfolio

A dark, animated, single-page portfolio built with React + Vite and plain CSS
(no animation libraries), deployed on Vercel with serverless API routes for
edit access, content storage, and file uploads.

## How editing works now

There is no separate admin login page anymore. The site always loads as a
normal visitor would see it. To edit:

1. Scroll to the very bottom of the page (the footer).
2. Click the small `·` dot next to the copyright line — it's deliberately
   subtle, it's not meant to be noticed by visitors.
3. Enter your passphrase (set as `OWNER_PASSPHRASE`, see below — no
   username, just one shared secret).
4. You're now in Edit Mode: every section shows "+ Add..." / "Edit" /
   "Remove" controls. Changes save to the database immediately — no code
   edits, no redeploy.
5. Click "Exit edit mode" in the footer when you're done.

Edit Mode is protected by a signed, `HttpOnly` session cookie that expires
after 12 hours — it can't be read or forged from the browser console.

## Where your data lives

Content (profile, skills, projects, achievements, gallery) is stored in an
**Upstash Redis** database attached to the Vercel project. Uploaded images
and PDFs go to **Vercel Blob** storage. Both are read/written only through
the `/api/*` serverless functions — never directly from the browser.

`src/data.js` is still there as the **starting content** shown before you've
ever saved anything through Edit Mode (or if the database is ever
unreachable). Once you make your first edit, the database takes over and
`src/data.js` is no longer read for that content.

Contact-form messages are stored the same way (`portfolio:messages` key) so
the Messages panel (visible only in Edit Mode) works from any device, not
just the browser that received them.

## Required environment variables

Set these in **Vercel → Project → Settings → Environment Variables**
(never prefix them with `VITE_` — that would ship them to every visitor's
browser):

| Variable | What it's for |
|---|---|
| `OWNER_PASSPHRASE` | The single passphrase that unlocks Edit Mode. Make it long and unique. |
| `AUTH_SECRET` | Random string used to sign the session cookie. Generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | Added automatically when you attach an Upstash Redis database (see below). |
| `BLOB_READ_WRITE_TOKEN` | Added automatically when you create a Blob store (see below). |

## Setting up the database and file storage on Vercel

1. Push this project to a GitHub repo and import it into Vercel
   (**Add New Project** → select the repo). Framework preset: **Vite**,
   auto-detected.
2. Before or after the first deploy, go to your project's **Storage** tab:
   - **Add a Redis database:** click **Marketplace Database Providers** →
     **Upstash** → create a Redis database → connect it to this project.
     This sets `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`
     automatically.
   - **Add a Blob store:** click **Create Database** → **Blob** → connect
     it to this project. This sets `BLOB_READ_WRITE_TOKEN` automatically.
3. Go to **Settings → Environment Variables** and add `OWNER_PASSPHRASE`
   and `AUTH_SECRET` (values of your choice — see table above).
4. Redeploy once (Deployments tab → ⋯ → Redeploy) so the new environment
   variables take effect.

Until you complete this, the site still works fully as a viewer would see
it — Edit Mode will just show an error saying the database/passphrase
isn't configured yet.

## Turning on the contact form email

The form posts to [Formspree](https://formspree.io) (free tier is fine),
which is what actually emails you — nothing in this codebase sends email
directly.

1. Create a free Formspree account **using itskv5107.kt@gmail.com**
   (or whichever inbox you want messages delivered to) and make a new
   form.
2. Copy the endpoint URL it gives you (looks like
   `https://formspree.io/f/abcdEFGh`).
3. Paste it into `contact.formEndpoint` in `src/data.js`, commit, and push.

Until you do this, submissions still land in the in-site Messages panel
(visible in Edit Mode), but nothing is emailed.

## Run it locally

The frontend alone:
```bash
npm install
npm run dev
```
Opens at `http://localhost:5173` — content, login, saving, and uploads
won't work here since those need the `/api` functions.

To test the full stack locally (recommended), install the Vercel CLI and
pull your real environment variables once:
```bash
npm install -g vercel
vercel link
vercel env pull .env.local
vercel dev
```
`vercel dev` serves the Vite frontend and the `/api` functions together.

## Deploying to Vercel

1. Push this project to a GitHub repo.
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import
   the repo. Build command `npm run build`, output directory `dist` —
   Vercel fills these in automatically.
3. Complete the **Storage** and **environment variable** setup above.
4. Click **Deploy**. Every future push redeploys automatically — but you
   won't need to push for content changes anymore, only for design/code
   changes.

## A note on the previous version

An earlier version of this project used a `VITE_OWNER_USERNAME` /
`VITE_OWNER_PASSWORD` pair stored in `.env.example`, which is how a
plaintext-looking username and password ended up committed to the repo —
exactly the risk you flagged. If this repo was ever pushed to a public (or
even private) GitHub remote, treat that old password as compromised: it's
gone from this version entirely, but it may still be recoverable from git
history unless that history is rewritten or the repo is deleted/recreated.

## Project structure

```
api/
  auth.js              ← POST: check passphrase, set session cookie. DELETE: log out
  data.js              ← GET (public): portfolio content. PUT (owner-only): save it
  messages.js          ← POST (public): save a contact-form message. GET (owner-only): list them
  upload.js            ← POST (owner-only): upload an image/PDF to Vercel Blob
lib/
  auth.js              ← cookie signing/verification, passphrase check
  redis.js             ← Upstash Redis client
src/
  data.js              ← starting content (see "Where your data lives")
  App.jsx              ← assembles all sections, owns the content state
  lib/api.js            ← fetch wrappers for the /api functions
  components/
    Navbar.jsx
    Hero.jsx            ← animated gradient orb + welcome photo
    About.jsx
    Skills.jsx          ← HUD-style level bars
    Gallery.jsx         ← shared horizontal-scroll carousel (used by Projects, Achievements, PhotoGallery)
    Projects.jsx
    Achievements.jsx     ← certificates/awards — image gallery, nothing to download
    PhotoGallery.jsx      ← general photos — same features as Achievements, separate section
    Contact.jsx           ← links + working form (posts to Formspree + saves to Messages)
    Messages.jsx           ← owner-only view of saved contact messages
    OwnerAccess.jsx         ← hidden footer button + passphrase modal
    Footer.jsx
  hooks/
    useReveal.js          ← scroll-triggered fade-in-up
    useCarousel.js         ← carousel scroll progress + arrow nav
  styles/
    index.css              ← design tokens, resets, shared classes
    components.css          ← per-section styles
public/
  certificates/             ← default/placeholder certificate images
  projects/                  ← default/placeholder project screenshots
```
