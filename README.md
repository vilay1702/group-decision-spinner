# 🎡 Decision Spinner

Can't agree on dinner, a movie, or whose turn it is to do the dishes?
Add your options, spin the wheel, and let fate take the blame.

No signup. No app to install. Nothing you type ever leaves your browser.

## How to use it

1. **Add your options** — type them in one at a time (emoji welcome 🌮),
   or load a starter wheel: Dinner, Movie night, or Weekend plans.
2. **Spin** — tap the big Spin button, or grab the wheel and flick it in
   either direction. The harder you flick, the longer it spins.
3. **Accept your fate** — or spin again. For elimination rounds, remove
   the winner and spin the rest until one option is left standing.

That's it. The wheel holds up to 16 options.

## Is it actually random?

Yes. Every spin launches with a random speed and coasts to a stop under a
physics simulation — real friction, not a scripted animation — so no slice
is ever favored. You control the flick; fate controls the result.

## Little things you'll notice

- The pointer clicks past each peg like a real carnival wheel, with ticks
  that rise in pitch as the wheel speeds up.
- Your phone buzzes on ticks and on the win (if it supports haptics).
- Confetti and a fanfare greet the winner. There's a mute button (🔊) if
  your meeting is in five minutes.
- Spin history keeps score, so you can prove pizza has won three times
  this week.
- If motion effects bother you, the wheel respects your system's
  reduced-motion setting.

## Your data

Your options, spin history, and sound preference are saved in this
browser only, so everything survives a refresh. Nothing is uploaded —
there are no accounts, no trackers, and no server to send anything to.
See the Privacy page in the app for details.

## Coming back

Everything is right where you left it — same browser, same device. Use
"Clear all" to start a fresh wheel.

---

## For developers

This is a [Next.js 15](https://nextjs.org/) app (App Router, TypeScript,
Tailwind CSS v4). Sound is synthesized with the WebAudio API and confetti
is Canvas 2D — no media assets or animation libraries.

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (fully static — deploys anywhere Next.js runs)
```

Branding follows `../Branded Web Tools.md`: design tokens in
`app/globals.css`, brand constants in `lib/brand.ts`, canonical microcopy
in `lib/copy.ts`. The parent brand name is still `TODO` in the brand doc —
set `PARENT_BRAND` in `lib/brand.ts` once it's decided.

Made with ♥ by Vilay
