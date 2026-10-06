# ASTEAMING Architecture

## Source of truth

Imported meshes, skeletons, weights, materials, textures, morphs, animations and existing physics metadata are preserved. ASTEAMING adds control layers instead of silently rewriting source data.

## Import pipeline

1. Load GLB/glTF/DAP/other supported source.
2. Detect meshes, armatures, skins, morphs and animations.
3. Run Rig Health analysis.
4. If valid skinning exists, protect it.
5. Offer Auto Weight only when an armature exists and no valid skinning is present.
6. Infer IK chains without changing the source hierarchy.
7. Add physics and secondary-motion controllers as separate runtime layers.

## IK

Two modes are planned:
- **Human:** joint limits and anatomical constraints.
- **Stylized:** configurable stretch, spring-back and hard deformation limits.

IK targets are control objects. The original skeleton remains intact.

## Physics

The runtime uses a fixed-step simulation boundary. A future native Jolt layer can own rigid bodies and constraints, while the web/Three.js layer owns presentation and SpringBone-style chains.

Pipeline:

Animation pose -> physics pre-step -> rigid bodies -> spring chains -> constraints -> animation/physics blend -> final skeleton pose -> skinning/render

## Secondary motion

Spring chains support hair, clothing, tails and other configured soft/secondary regions. Physics is blended into the authored pose instead of permanently replacing it.

## Inertia

Distal motion propagates toward parents with configurable distance, mass and depth falloff. This prevents infinite propagation while allowing connected chains to carry motion into the torso.

## Baking

Live physics remains dynamic during posing. Users explicitly choose **Bake Physics / Bake Stretch** to sample a timeline range and generate animation keys.

## Export

Model export and video export remain separate:
- GLB/glTF/DAP export preserves model data.
- MP4 export renders timeline frames through Android's hardware encoder.

## Mobile performance

The viewport can reduce physics frequency and render complexity independently of the editable asset. Suggested controls include dynamic budgets, sleeping, distant-chain rate reduction, and debug statistics.

## Debugging

A Rig Health panel should expose:
- armature detected
- bone count
- skinning detected
- weighted mesh count
- zero-weight warnings
- detected arm/leg chains
- IK state
- physics state

No questionable rig is silently repaired.
