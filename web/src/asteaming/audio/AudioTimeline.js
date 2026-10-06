export class AudioTimeline {
  constructor() {
    this.tracks = [];
    this.masterVolume = 1;
  }

  addTrack(name = "Sound Effects") {
    const track = { id: crypto.randomUUID(), name, kind: "audio", clips: [], muted: false, solo: false, volume: 1 };
    this.tracks.push(track);
    return track;
  }

  addClip(track, asset, start = 0, options = {}) {
    if (!track || !asset) throw new Error("Audio clip requires a track and sound asset.");
    const clip = {
      id: crypto.randomUUID(),
      assetId: asset.id,
      name: asset.name,
      start,
      duration: options.duration ?? asset.duration ?? 0,
      sourceOffset: options.sourceOffset ?? 0,
      volume: options.volume ?? 1,
      fadeIn: options.fadeIn ?? 0,
      fadeOut: options.fadeOut ?? 0,
      loop: !!options.loop
    };
    track.clips.push(clip);
    return clip;
  }

  splitClip(track, clipId, time) {
    const clip = track.clips.find(c => c.id === clipId);
    if (!clip || time <= clip.start || time >= clip.start + clip.duration) return null;
    const leftDuration = time - clip.start;
    const right = { ...clip, id: crypto.randomUUID(), start: time, duration: clip.duration - leftDuration, sourceOffset: clip.sourceOffset + leftDuration };
    clip.duration = leftDuration;
    track.clips.push(right);
    return right;
  }

  moveClip(clip, newStart, snap = 0) {
    clip.start = snap > 0 ? Math.round(newStart / snap) * snap : Math.max(0, newStart);
  }
}
