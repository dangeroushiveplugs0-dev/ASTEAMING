export const DEFAULT_PHYSICS = Object.freeze({
  fixedHz: 60,
  maxCatchUpSteps: 4,
  spring: {
    stiffness: 0.72,
    damping: 0.18,
    gravity: 1.0,
    maxStretch: 1.12,
    hardLimit: 1.18
  },
  inertia: {
    propagation: 0.72,
    distanceFalloff: 0.58,
    massFalloff: 0.82,
    maxDepth: 6
  },
  budgets: {
    maxDynamicBones: 160,
    maxColliders: 120,
    distantHz: 30
  }
});

export class PhysicsClock {
  constructor(config = DEFAULT_PHYSICS) {
    this.config = config;
    this.accumulator = 0;
    this.step = 1 / config.fixedHz;
    this.paused = false;
  }

  tick(deltaSeconds, simulate) {
    if (this.paused) return 0;
    this.accumulator = Math.min(this.accumulator + Math.max(0, deltaSeconds), this.step * this.config.maxCatchUpSteps);
    let steps = 0;
    while (this.accumulator >= this.step && steps < this.config.maxCatchUpSteps) {
      simulate(this.step);
      this.accumulator -= this.step;
      steps++;
    }
    return steps;
  }
}
