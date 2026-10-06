# DAP Character Format

DAP is ASTEAMING's native character asset format. The base payload follows glTF 2.0 / GLB so standard geometry, textures, materials, skins, armatures, animations and binary buffers remain compatible with the existing 3D ecosystem.

DAP adds an ASTEAMING-specific character-data layer on top of GLB.

## Design principle

A DAP file should be usable as a normal GLB-like 3D asset while carrying additional ASTEAMING character information.

Conceptually:

DAP
- GLB-compatible core
  - meshes
  - textures
  - materials
  - nodes
  - armatures / skins
  - morph targets / shape keys
  - animations
  - binary buffer data
- DAP character extension
  - character metadata
  - body-shape controls
  - outfit definitions
  - outfit variants
  - visibility/toggle groups
  - morph/shape-key presets
  - physics definitions
  - SpringBone definitions
  - collider definitions
  - ragdoll definitions
  - bone metadata
  - ASTEAMING UI metadata

## Container strategy

DAP should preferably remain a valid GLB-derived binary container rather than inventing a new binary mesh format.

Preferred architecture:

- GLB JSON chunk contains standard glTF data.
- GLB BIN chunk contains mesh/animation/buffer data.
- DAP-specific information is represented through a namespaced glTF extension, tentatively ASTEAMING_dap.
- Additional binary resources remain referenced through normal glTF mechanisms.

This lets standard GLB tooling continue seeing the core model while ASTEAMING reads the additional character data.

## Required standard 3D data

DAP must support meshes, node hierarchy, transforms, materials, textures, images, UVs, normals, tangents where available, vertex colors, morph targets / shape keys, skins, joints / armatures, inverse bind matrices and animation clips/channels.

## Armatures

Armatures are first-class DAP data.

A DAP character should preserve:

- bone hierarchy
- bone names
- parent relationships
- rest transforms
- inverse bind matrices
- skin assignments
- bone metadata
- constraints when representable
- physics associations

Bone metadata may identify a bone as deform, control, physics, attachment, helper, IK target or IK pole.

The importer must not generate physics bones merely because geometry happens to exist nearby.

## Shape keys / morph targets

Morph targets are first-class character features.

Each morph can have:

- stable ID
- display name
- category
- default weight
- minimum/maximum weight
- target mesh references
- UI visibility
- mutually exclusive groups where required
- optional preset membership

Example categories include Body, Face, Chest, Gluteal, Clothing and Expression.

DAP should preserve actual morph target data in the GLB-compatible core and use the DAP extension for organization and UI metadata.

## Character customization

DAP supports named customization controls without baking a separate mesh for every combination.

Example controls can include body shape, muscle, weight, height, chest shape, gluteal shape, waist shape, limb proportions and facial controls.

The UI should read these definitions dynamically rather than hard-code body-part names.

## Outfit system

Outfits are named asset groups.

Example:

Outfits
- Default
- Casual
- Armor
- Formal
- Swimwear

Each outfit can contain mesh references, material overrides, texture references, visibility state, required morph mappings, compatible body-shape groups, physics configuration and attachment bones.

The DAP UI can therefore expose an Outfit panel without knowing how the character was modeled.

## Toggle groups

DAP supports generic toggle groups.

Examples:

Body
- Base body
- Alternate body
- Body variant

Outfit
- Shirt
- Pants
- Shoes
- Accessories

Features
- Tail
- Ears
- Hair variant
- Facial markings

Each toggle references actual nodes, meshes, materials or morph controls rather than duplicating data.

## Physics metadata

DAP stores portable character physics configuration:

- SpringBone chains
- stiffness
- damping
- inertia
- gravity
- collision groups
- sphere colliders
- capsule colliders
- rigid-body definitions
- masses
- constraints
- joint limits
- motor settings
- animation/physics weights
- ragdoll mappings

The runtime simulation remains in ASTEAMING. DAP stores the portable configuration and associations.

## UI metadata

DAP can describe how customization appears in ASTEAMING.

A control may contain:

- ID
- display label
- category
- control type
- minimum
- maximum
- default
- target morphs
- target visibility nodes
- target materials
- dependencies
- conflicts

The UI should be generated from this metadata.

## Compatibility

DAP follows graceful degradation.

If the DAP-specific extension is ignored or stripped, the GLB-compatible core should still render.

If ASTEAMING opens the complete DAP asset, it should recover character structure, armature, shape keys, outfits, customization controls, physics configuration and animation metadata.

Unknown future DAP fields must be safely ignored.

## Versioning

DAP requires an explicit format version, for example dapVersion: 1.

The extension should also have its own semantic version so ASTEAMING can migrate older character files.

## Security and robustness

The importer must validate buffers and indices, reject hierarchy cycles, clamp unsafe numeric values, prevent runaway physics settings, avoid trusting UI metadata as executable code, and never execute arbitrary scripts from DAP files.

DAP is data, not a plugin format.

## Future compatibility

Leave room for facial rigs, IK definitions, procedural animation, cloth metadata, hair systems, material presets, decals, audio/phoneme mappings, LODs, retargeting profiles, physics presets, character poses and animation libraries.

## First DAP milestone

Do not implement the complete format immediately.

First prove:

1. GLB-compatible mesh
2. textures
3. materials
4. armature
5. skinning
6. morph targets
7. one DAP character metadata extension
8. one outfit group
9. one body-shape control
10. one SpringBone configuration

Once this round-trips correctly, expand the schema.

## Important implementation rule

DAP must not become a giant custom replacement for glTF.

Use glTF/GLB for things glTF already handles well.

Use DAP only for ASTEAMING-specific character organization, customization and physics metadata.
