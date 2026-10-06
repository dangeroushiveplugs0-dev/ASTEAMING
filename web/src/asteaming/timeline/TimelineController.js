export class TimelineController {
  constructor(model, { onTimeChange, onPlayStateChange } = {}) {
    this.model = model;
    this.onTimeChange = onTimeChange;
    this.onPlayStateChange = onPlayStateChange;
    this.playing = false;
    this.lastNow = 0;
    this.raf = 0;
  }

  setTime(time) {
    this.model.current = Math.max(this.model.start, Math.min(this.model.end, this.model.snapTime(time)));
    this.onTimeChange?.(this.model.current);
  }

  togglePlay() {
    this.playing ? this.pause() : this.play();
  }

  play() {
    if (this.playing) return;
    this.playing = true;
    this.lastNow = performance.now();
    this.onPlayStateChange?.(true);
    const tick = now => {
      if (!this.playing) return;
      const dt = Math.min((now - this.lastNow) / 1000, 0.1);
      this.lastNow = now;
      this.setTime(this.model.current + dt);
      if (this.model.current >= this.model.end) this.setTime(this.model.start);
      this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
  }

  pause() {
    this.playing = false;
    cancelAnimationFrame(this.raf);
    this.onPlayStateChange?.(false);
  }
}
