export function inspectSkinning(root) {
  let skinned = 0;
  let unskinned = 0;
  root?.traverse?.(o => {
    if (o.isSkinnedMesh) skinned++;
    else if (o.isMesh) unskinned++;
  });
  return { skinned, unskinned, hasExistingWeights: skinned > 0 };
}

export function canAutoWeight(root) {
  const state = inspectSkinning(root);
  return state.skinned === 0;
}

export function assertAutoWeightAllowed(root, overwrite = false) {
  const state = inspectSkinning(root);
  if (state.hasExistingWeights && !overwrite) {
    throw new Error("Auto Weight blocked: existing skinning is protected. Use explicit Recalculate/Overwrite Weights.");
  }
  return true;
}
