# 🎡 Decision Spinner

Can't agree on dinner, a movie, or whose turn it is to do the dishes?
Add your options, spin the wheel, and let fate settle it.

## Features

- **Physical spin** — the wheel runs on a real friction simulation
  (exponential drag + linear braking), not a canned CSS animation. Tap
  **SPIN**, or grab the wheel and flick it in either direction.
- **Satisfying feedback** — synthesized ratchet ticks as the pointer passes
  each peg (pitch rises with speed), pointer kick-back, haptic buzzes on
  supported phones, and a confetti + fanfare celebration for the winner.
- **Winner flow** — the winning slice flashes, then a result card offers
  *Spin again* or *Remove winner & spin the rest* for elimination rounds.
- **Persistence** — options, spin history (with win tallies), and the mute
  setting are stored in `localStorage`, so everything survives a refresh.
  No accounts, no server, no data leaves the browser.
- **Presets** — one-tap starter wheels for dinner, movie night, and weekend
  plans.
- Mobile-first. Respects `prefers-reduced-motion`.
- **Branded** — built to the suite brand in `../Branded Web Tools.md`:
  shared `ToolShell` (header → H1 → workspace → FAQ → related tools →
  footer), design tokens in `app/globals.css`, canonical microcopy in
  `lib/copy.ts`, and brand constants (suite name, domain, colors) in
  `lib/brand.ts`. The suite name/domain are still `TODO` in the brand doc —
  swap the placeholders in `lib/brand.ts` once decided.

## Getting started

```bash
npm install
npm run dev       # http://localhost:3000
```

## Production

```bash
npm run build
npm run start
```

The app is fully static (no server state, no env vars), so it deploys
anywhere Next.js runs — Vercel, Netlify, or any Node host.

`npm run lint` runs ESLint with the Next.js ruleset.

## Stack

- [Next.js 15](https://nextjs.org/) (App Router, TypeScript)
- [Tailwind CSS v4](https://tailwindcss.com/)
- WebAudio API for synthesized sound (no audio assets)
- Canvas 2D for confetti (no animation libraries)
