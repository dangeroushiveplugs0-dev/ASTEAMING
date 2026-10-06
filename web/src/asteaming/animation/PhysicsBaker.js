export class PhysicsBaker {
  constructor({ sampleRate = 60 } = {}) {
    this.sampleRate = sampleRate;
  }

  bake({ start, end, sample, capture, setFrame }) {
    const keys = [];
    const dt = 1 / this.sampleRate;
    for (let t = start; t <= end + 1e-6; t += dt) {
      setFrame(t);
      sample(dt);
      const pose = capture(t);
      if (pose) keys.push(pose);
    }
    return keys;
  }

  static range(mode, timeline) {
    if (mode === "current") return [timeline.current, timeline.current];
    if (mode === "current_to_next") return [timeline.current, timeline.nextKey ?? timeline.current];
    if (mode === "selected") return [timeline.selectionStart, timeline.selectionEnd];
    return [timeline.start, timeline.end];
  }
}
