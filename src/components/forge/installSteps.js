export const INSTALL_STEPS = [
  {
    title: "Check your metal",
    note: "The Arrow Lake NPU needs kernel 6.8+ (the intel_vpu driver ships in-tree from there). Pop!_OS 22.04+ with a recent kernel qualifies. Verify:",
    blocks: [
      {
        lang: "bash",
        code: `uname -r                      # want 6.8 or newer
python3 --version             # want 3.11+
ls /dev/accel/accel0 2>/dev/null && echo "NPU device node present" || echo "NPU node missing (see Step 4)"
nvidia-smi                    # RTX 5080 sanity check`,
      },
    ],
  },
  {
    title: "Set up the project + environment",
    note: "Unpack forge_ng wherever you keep it (e.g. ~/forge), then create an isolated venv. Nothing global, nothing heavy.",
    blocks: [
      {
        lang: "bash",
        code: `cd ~/forge
python3 -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install pytest            # the fabric itself is stdlib-only by design`,
      },
    ],
  },
  {
    title: "Prove the fabric is green",
    note: "Before touching anything, confirm all 119 tests pass on your machine. If anything is red here, stop and fix it first.",
    blocks: [
      {
        lang: "bash",
        code: `cd ~/forge
source .venv/bin/activate
python -m pytest forge_ng/ -q
# expect: 119 passed`,
      },
    ],
  },
  {
    title: "Wire the NPU (Arrow Lake on Pop!_OS)",
    note: "The NPU stack is three layers: the intel_vpu kernel driver, the Level Zero NPU user-space driver, and OpenVINO as the runtime your NpuSeat binds to. If /dev/accel/accel0 was missing in Step 1, do this:",
    blocks: [
      {
        lang: "bash",
        code: `# 1. Kernel driver (in-tree since 6.8) — load + confirm
sudo modprobe intel_vpu
lsmod | grep intel_vpu
ls /dev/accel/               # want accel0

# 2. Give yourself access to the device node
sudo usermod -aG render $USER   # then log out/in

# 3. Level Zero NPU user-space driver
#    Grab the latest .deb from:
#    https://github.com/intel/linux-npu-driver/releases
sudo apt install ./intel-driver-compiler-npu_*.deb ./intel-level-zero-npu_*.deb
sudo apt install level-zero

# 4. OpenVINO runtime (in your venv)
source ~/forge/.venv/bin/activate
pip install openvino

# 5. Verify the NPU is visible to the runtime
python -c "import openvino as ov; print(ov.Core().available_devices)"
# want: ['CPU', 'GPU', 'NPU']`,
      },
    ],
  },
  {
    title: "Kernel bootstrap — make it BOOT, not just import",
    note: "This is the Skeleton's known gap. Drop this in as forge_ng/main.py and adapt the imports/constructor args to your exact signatures — it assembles the organs, binds a seat, and runs the living tick loop. HeuristicSeat keeps it alive even with no NPU.",
    blocks: [
      {
        lang: "python",
        code: `#!/usr/bin/env python3
"""forge_ng/main.py — kernel bootstrap: the Forge as a living process.

Adapt import paths / constructor args to your exact signatures.
Philosophy preserved: deaf by default, one door, nothing bare.
"""
import signal, sys, time

from forge_ng.fabric.bus import SubstanceBus
from forge_ng.fabric.gate import Gate
from forge_ng.fabric.overseer import Overseer
from forge_ng.fabric.conduit import VectorConduit, HeuristicSeat

TICK_HZ = 2  # light: 2 ticks/sec is plenty; raise only when the NPU seat is real


def build_seat():
    """Try the real NPU; fall back to HeuristicSeat. Never dies for lack of silicon."""
    try:
        import openvino as ov
        core = ov.Core()
        if "NPU" in core.available_devices:
            # TODO: swap in your OpenVINOSeat(NpuSeat) implementation here
            print("[forge] NPU detected — bind OpenVINOSeat when ready; using HeuristicSeat for now")
    except ImportError:
        pass
    return HeuristicSeat()


def main():
    bus = SubstanceBus()
    gate = Gate()
    overseer = Overseer(bus=bus, gate=gate)
    conduit = VectorConduit(overseer=overseer, seat=build_seat())

    running = {"on": True}
    signal.signal(signal.SIGTERM, lambda *_: running.update(on=False))
    signal.signal(signal.SIGINT, lambda *_: running.update(on=False))

    print("[forge] awake — deaf sections sealed, tap live, seat bound")
    while running["on"]:
        conduit.tick()          # FEED UP -> JUDGE -> COMMAND
        time.sleep(1 / TICK_HZ)

    print("[forge] graceful sleep — nothing thrown away")
    return 0


if __name__ == "__main__":
    sys.exit(main())`,
      },
      {
        lang: "bash",
        code: `# boot it
cd ~/forge && source .venv/bin/activate
python -m forge_ng.main`,
      },
    ],
  },
  {
    title: "Bind the real NPU seat",
    note: "Once Step 4 shows 'NPU' in available_devices, implement the NpuSeat protocol on OpenVINO and hot-swap it with bind_seat() — no reboot, LEGO-style. Skeleton to adapt:",
    blocks: [
      {
        lang: "python",
        code: `# forge_ng/fabric/npu_seat.py — real silicon behind the NpuSeat protocol
import openvino as ov


class OpenVINOSeat:
    """Implements the same protocol as HeuristicSeat, judged on the NPU.

    Keep it light: compile ONE small model once, reuse forever.
    A compact embedding/classifier model is the right size for the
    judge role — the 5080 stays free for heavy capsule work.
    """

    def __init__(self, model_path: str, device: str = "NPU"):
        core = ov.Core()
        self._compiled = core.compile_model(model_path, device)

    def judge(self, vectors):
        # Adapt to your seat protocol's exact signature:
        # run inference on the drained tap vectors, return verdicts
        infer = self._compiled.create_infer_request()
        return infer.infer({0: vectors})`,
      },
    ],
  },
  {
    title: "Run it as a service (survives reboot)",
    note: "A systemd user unit keeps the Forge alive as a real resident process — light, auto-restarting, no root.",
    blocks: [
      {
        lang: "bash",
        code: `mkdir -p ~/.config/systemd/user
cat > ~/.config/systemd/user/forge.service <<'EOF'
[Unit]
Description=THE FORGE - local AI fabric

[Service]
WorkingDirectory=%h/forge
ExecStart=%h/forge/.venv/bin/python -m forge_ng.main
Restart=on-failure
RestartSec=3

[Install]
WantedBy=default.target
EOF

systemctl --user daemon-reload
systemctl --user enable --now forge
systemctl --user status forge        # watch it breathe
journalctl --user -u forge -f        # live logs`,
      },
    ],
  },
];