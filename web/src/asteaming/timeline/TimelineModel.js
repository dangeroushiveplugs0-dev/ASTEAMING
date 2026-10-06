export const TRACK_KINDS = Object.freeze({
  animation: "animation",
  keyframe: "keyframe",
  audio: "audio",
  marker: "marker",
  physics: "physics"
});

export class TimelineModel {
  constructor({ fps = 30 } = {}) {
    this.fps = fps;
    this.current = 0;
    this.start = 0;
    this.end = 10;
    this.snap = true;
    this.snapFrames = 1;
    this.tracks = [];
    this.markers = [];
  }

  timeToFrame(time) { return Math.round(time * this.fps); }
  frameToTime(frame) { return frame / this.fps; }

  snapTime(time) {
    if (!this.snap) return Math.max(0, time);
    const frame = Math.round(time * this.fps / this.snapFrames) * this.snapFrames;
    return Math.max(0, frame / this.fps);
  }

  addTrack(kind, name) {
    const track = { id: crypto.randomUUID(), kind, name, muted: false, solo: false, locked: false, items: [] };
    this.tracks.push(track);
    return track;
  }

  addKey(track, time, property, value) {
    const key = { id: crypto.randomUUID(), frame: this.timeToFrame(this.snapTime(time)), property, value };
    track.items.push(key);
    return key;
  }

  setRange(start, end) {
    this.start = Math.max(0, start);
    this.end = Math.max(this.start, end);
  }
}
