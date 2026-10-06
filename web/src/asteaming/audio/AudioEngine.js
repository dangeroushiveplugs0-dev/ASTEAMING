export class AudioEngine {
  constructor() {
    this.context = null;
    this.buffers = new Map();
    this.active = new Set();
  }

  async ensureContext() {
    if (!this.context) this.context = new AudioContext();
    if (this.context.state === "suspended") await this.context.resume();
    return this.context;
  }

  async load(asset) {
    if (this.buffers.has(asset.id)) return this.buffers.get(asset.id);
    const ctx = await this.ensureContext();
    const data = await asset.blob.arrayBuffer();
    const buffer = await ctx.decodeAudioData(data);
    this.buffers.set(asset.id, buffer);
    return buffer;
  }

  async playClip(asset, when = 0, offset = 0, duration = null, volume = 1) {
    const ctx = await this.ensureContext();
    const buffer = await this.load(asset);
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    source.buffer = buffer;
    gain.gain.value = volume;
    source.connect(gain).connect(ctx.destination);
    const safeOffset = Math.max(0, Math.min(offset, buffer.duration));
    const maxDuration = Math.max(0, buffer.duration - safeOffset);
    source.start(ctx.currentTime + Math.max(0, when), safeOffset, duration == null ? maxDuration : Math.min(duration, maxDuration));
    this.active.add(source);
    source.onended = () => this.active.delete(source);
    return source;
  }

  stopAll() {
    for (const source of this.active) {
      try { source.stop(); } catch {}
    }
    this.active.clear();
  }
}
