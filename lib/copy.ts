/**
 * Canonical microcopy — part of the brand ("Branded Web Tools.md" §7).
 * Tone: friendly-direct. Sentence case. Verb-first button labels.
 * Reuse these strings; don't write ad-hoc empty/error states in components.
 */
export const copy = {
  // Privacy line (shown under every tool workspace)
  privacy: "Everything runs in your browser — options and history are never uploaded.",

  // Buttons (verb-first, never "Submit" or "OK")
  spin: "Spin",
  add: "Add",
  spinAgain: "Spin again",
  clearAll: "Clear all",
  clear: "Clear",
  tryAgain: "Try again",

  // Workspace states
  emptyWheelTitle: "Your wheel is empty",
  emptyWheelHint: "Add at least two options to get spinning",
  oneOptionTitle: "One option isn't much of a decision…",
  oneOptionHint: "Add one more and you're in business",
  spinHint: "Tap Spin — or flick the wheel",
  spinningHint: "Round and round it goes…",

  // Options panel
  optionPlaceholder: "Add an option… (emoji welcome 🌮)",
  presetsLead: "Start fresh, or steal one of ours:",
  wheelFull: (max: number) => `Wheel's full — ${max} options max.`,
  duplicateOption: (label: string) => `"${label}" is already on the wheel.`,

  // History panel
  historyTitle: "Spin history",
  historyEmpty: "No spins yet — add some options and give it a whirl.",

  // Winner
  winnerKicker: "And the winner is",
  removeAndSpin: (label: string) => `Remove ${label} & spin the rest`,
  acceptFate: "Accept your fate",
  onARoll: (n: number, label: string) => `That's win #${n} for ${label}!`,

  // Header actions
  themeToggle: "Switch between light and dark",

  // Errors
  errorTitle: "The wheel came off",
  errorBody:
    "Something went wrong. Your options and history are safe in this browser — give it another spin.",

  // 404
  notFoundTitle: "This page isn't on the wheel",
  notFoundBody:
    "The address may be mistyped, or the page moved. Your spinner is right where you left it.",
  backToSpinner: "Back to the spinner",
} as const;
