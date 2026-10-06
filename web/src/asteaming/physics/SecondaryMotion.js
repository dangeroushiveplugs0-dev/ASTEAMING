export class SpringNode {
  constructor(bone, options = {}) {
    this.bone = bone;
    this.stiffness = options.stiffness ?? 0.72;
    this.damping = options.damping ?? 0.18;
    this.mass = options.mass ?? 1;
    this.inertia = options.inertia ?? 1;
    this.velocity = { x: 0, y: 0, z: 0 };
    this.rest = { x: 0, y: 0, z: 0 };
  }
}

export class SecondaryMotionChain {
  constructor(nodes = []) {
    this.nodes = nodes;
    this.enabled = true;
    this.blend = 1;
  }

  step(dt, targetPose) {
    if (!this.enabled) return;
    for (const node of this.nodes) {
      const target = targetPose?.get?.(node.bone) ?? node.rest;
      const p = node.bone.position;
      const ax = (target.x - p.x) * node.stiffness - node.velocity.x * node.damping;
      const ay = (target.y - p.y) * node.stiffness - node.velocity.y * node.damping;
      const az = (target.z - p.z) * node.stiffness - node.velocity.z * node.damping;
      node.velocity.x += ax * dt / node.mass;
      node.velocity.y += ay * dt / node.mass;
      node.velocity.z += az * dt / node.mass;
      p.x += node.velocity.x * dt * node.inertia * this.blend;
      p.y += node.velocity.y * dt * node.inertia * this.blend;
      p.z += node.velocity.z * dt * node.inertia * this.blend;
    }
  }
}
