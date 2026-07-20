export const CHEAT_SECTIONS = [
  {
    title: "The Laws (never break these)",
    color: "amber",
    items: [
      ["Deaf by default", "Sections cannot hear each other. Only the overseer's tap hears everything. 'Everyone knows everything' is impossible by design."],
      ["One door", "Every privileged action goes through the Gate — signed, verified, replay-guarded. Even the overseer can't act twice silently."],
      ["Nothing bare", "A raw model is a hostile binary until it's wrapped, sealed, and gated — the baptism."],
      ["Bonded, not fused", "The NPU brain bonds through the VectorConduit. Reclaiming a capsule never erases memory."],
      ["Nothing thrown away", "Retire → archive. The Wardrobe keeps every stripped suit and peeled concept."],
    ],
  },
  {
    title: "The Verbs (what the fabric can do)",
    color: "cyan",
    items: [
      ["Spawn", "Bring a new capsule/section to life inside the fabric."],
      ["Mount", "Attach storage or a resource to a sealed section."],
      ["Egress", "The only sanctioned way anything leaves a section."],
      ["NpuEval", "Send work to the brain seat for judgment."],
      ["Conform", "Seal a raw model into a wrap — the baptism verb."],
      ["Splice", "Cut and recombine substance — multiple models on one body, viewing and commanding each other."],
      ["Reclaim", "Strip a suit back to parts in the Wardrobe; memory survives."],
    ],
  },
  {
    title: "The Control Deck (how to drive it)",
    color: "magenta",
    items: [
      ["Sliders", "DJ-style live dials — drag and release to commit. Values sync in real time to everyone viewing, and to your Forge through the bridge."],
      ["Toggles", "Engage/disengage a mode — tap toggle, deaf mode, NPU seat, sandbox observe."],
      ["Buttons", "Fire a one-shot task — each press counts up, and your Forge treats a count change as a command."],
      ["New control", "Snap on your own slider/toggle/button, name it, pick a section and neon color. LEGO rule: nothing welded in — delete any control anytime."],
      ["The bridge", "Your Forge on the metal polls the deck (Install Guide step 08) and reacts to changes. The deck is codeless; the fabric does the work."],
    ],
  },
  {
    title: "The Rubric (grades)",
    color: "green",
    items: [
      ["🟢 GREEN", "Solid — built and tested."],
      ["🟡 YELLOW", "Needs a look."],
      ["🔴 RED", "Weak or missing."],
      ["🟣 PURPLE", "Revolutionary — seed-stage north star."],
      ["🟠 ORANGE", "Needs custom work."],
    ],
  },
  {
    title: "Order of Operations (don't skip)",
    color: "violet",
    items: [
      ["1. Green tests", "119/119 pass before anything else."],
      ["2. NPU visible", "intel_vpu + Level Zero + OpenVINO show 'NPU'."],
      ["3. Boot", "Kernel bootstrap main.py — the skeleton runs, not just imports."],
      ["4. Real seat", "Swap HeuristicSeat → OpenVINOSeat with bind_seat(). Hot, no reboot."],
      ["5. Bridge", "Connect the Forge to this deck and drive it codeless."],
      ["6. Service", "systemd unit — it survives reboots and breathes on its own."],
    ],
  },
];