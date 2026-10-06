export class RigHealth {
  static analyze(root) {
    const bones = [];
    const meshes = [];
    root?.traverse?.(o => {
      if (o.isBone) bones.push(o);
      if (o.isSkinnedMesh) meshes.push(o);
    });

    const boneNames = new Set(bones.map(b => b.name));
    const chains = { arms: [], legs: [], spine: [] };
    const warnings = [];

    for (const mesh of meshes) {
      const skin = mesh.geometry?.attributes?.skinIndex;
      const weights = mesh.geometry?.attributes?.skinWeight;
      if (!skin || !weights) continue;

      let weightedVertices = 0;
      let zeroWeightVertices = 0;
      for (let i = 0; i < weights.count; i++) {
        const w = weights.getX(i) + weights.getY(i) + weights.getZ(i) + weights.getW(i);
        if (w > 1e-4) weightedVertices++;
        else zeroWeightVertices++;
      }
      if (zeroWeightVertices) warnings.push(`${mesh.name || "Mesh"}: ${zeroWeightVertices} vertices have no effective bone weight.`);
    }

    const find = names => bones.find(b => names.some(n => b.name.toLowerCase().includes(n)));
    const side = s => ({
      shoulder: find([s + "shoulder", s + "clavicle"]),
      upperArm: find([s + "upperarm", s + "arm"]),
      forearm: find([s + "forearm", s + "lowerarm"]),
      hand: find([s + "hand", s + "wrist"])
    });

    for (const s of ["left", "right"]) {
      const a = side(s);
      if (a.upperArm && a.forearm && a.hand) chains.arms.push({ side: s, ...a });
      const leg = {
        thigh: find([s + "thigh", s + "upleg"]),
        shin: find([s + "shin", s + "calf", s + "lowerleg"]),
        foot: find([s + "foot", s + "ankle"])
      };
      if (leg.thigh && leg.shin && leg.foot) chains.legs.push({ side: s, ...leg });
    }

    const weightedMeshes = meshes.filter(m => m.isSkinnedMesh && m.skeleton?.bones?.length);
    return {
      armatureDetected: bones.length > 0,
      boneCount: bones.length,
      meshCount: meshes.length,
      weightedMeshCount: weightedMeshes.length,
      skinningDetected: weightedMeshes.length > 0,
      chains,
      warnings,
      safeToAutoWeight: bones.length > 0 && weightedMeshes.length === 0,
      boneNames: [...boneNames]
    };
  }
}
