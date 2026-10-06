export class IKChain {
  constructor({ name, bones, target = null, pole = null, stretch = false }) {
    this.name = name;
    this.bones = bones;
    this.target = target;
    this.pole = pole;
    this.stretch = stretch;
    this.enabled = true;
    this.blend = 1;
    this.stretchLimit = 1.12;
    this.mode = "human";
  }
}

export function inferIKChains(rigHealth) {
  const chains = [];
  for (const arm of rigHealth.chains.arms) {
    chains.push(new IKChain({
      name: `${arm.side}_arm`,
      bones: [arm.shoulder, arm.upperArm, arm.forearm, arm.hand].filter(Boolean)
    }));
  }
  for (const leg of rigHealth.chains.legs) {
    chains.push(new IKChain({
      name: `${leg.side}_leg`,
      bones: [leg.thigh, leg.shin, leg.foot].filter(Boolean)
    }));
  }
  return chains;
}

export function applyJointLimits(rotation, limits) {
  if (!limits) return rotation;
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  return {
    x: clamp(rotation.x ?? 0, limits.x?.[0] ?? -Infinity, limits.x?.[1] ?? Infinity),
    y: clamp(rotation.y ?? 0, limits.y?.[0] ?? -Infinity, limits.y?.[1] ?? Infinity),
    z: clamp(rotation.z ?? 0, limits.z?.[0] ?? -Infinity, limits.z?.[1] ?? Infinity)
  };
}

export const HUMAN_LIMITS = {
  shoulder: { x: [-1.5, 1.5], y: [-2.0, 2.0], z: [-2.0, 2.0] },
  elbow: { x: [-2.6, 0.0], y: [-0.15, 0.15], z: [-0.15, 0.15] },
  wrist: { x: [-1.2, 1.2], y: [-1.0, 1.0], z: [-1.2, 1.2] },
  knee: { x: [-2.7, 0.0], y: [-0.1, 0.1], z: [-0.1, 0.1] }
};
