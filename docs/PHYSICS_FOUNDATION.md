# ASTEAMING Physics Foundation

## Goal

Build a mobile-first character animation system capable of high-quality physics-assisted secondary motion, ragdolls, constraints, collisions, and animation/physics blending.

## Core decision

ASTEAMING should use two complementary simulation layers:

1. **Jolt Physics** for rigid bodies, collision detection/response, constraints, motors, ragdolls, and future character physics.
2. **A dedicated SpringBone solver** for inexpensive secondary motion such as hair, tails, ears, ribbons, loose clothing, and similar bone chains.

Jolt is a strong fit for the native Android/NDK architecture because it is open source under MIT, supports Android ARM64, and provides animated ragdolls, constraint motors, collision shapes, and skeleton/ragdoll facilities.

The SpringBone layer should follow the proven VRM model: a chain has inertia, stiffness/rigidity, damping/deceleration, gravity, and optional colliders. The VRMC_springBone specification defines procedural spring-like animation for hair and costumes plus sphere/capsule collision.

## Simulation pipeline

Animation pose
-> Physics pre-step
-> Dynamic rigid-body / ragdoll simulation
-> SpringBone secondary simulation
-> Collision and constraint correction
-> Physics/animation blending
-> Final skeleton pose
-> Skinning/render

Physics must never permanently destroy the authored animation pose. The animation pose is the target/reference pose that physics can influence.

## Fixed timestep

Physics should use a fixed simulation timestep independent of render FPS.

Recommended starting point:

- Target physics rate: 60 Hz
- Maximum catch-up steps per render frame: 4
- Accumulator-based stepping
- Render interpolation for visual smoothness
- Pause simulation when the app is backgrounded
- Clamp unusually large frame deltas after resume

## Physics layers

### Layer 1: SpringBone

Designed for cheap, expressive secondary motion.

Per-chain parameters:

- stiffness / rigidity
- damping / drag
- gravity direction
- gravity strength
- inertia
- length/rest direction
- radius
- center/reference transform
- collision groups
- maximum angular deviation
- simulation weight

Colliders initially:

- sphere
- capsule

Spring chains should be solved in local character space where practical, with a configurable center/reference transform so whole-character movement does not create unwanted world-origin shaking.

### Layer 2: Ragdoll

Jolt-backed rigid bodies and constraints.

Initial collider shapes:

- capsule
- sphere
- box

Initial joint types:

- fixed
- point
- hinge
- cone
- swing-twist / limited rotational constraint
- 6DOF where needed

Important behavior:

- parent/child self-collision filtering
- joint limits
- motorized animation matching
- kinematic and dynamic modes
- animated-to-ragdoll transition
- ragdoll-to-animation recovery

Jolt specifically supports animated ragdolls, including driving constraint motors toward an animated pose and mapping between high-detail animation skeletons and lower-detail ragdoll skeletons.

## Animation + physics blending

Do not use a simple binary "animation OR physics" switch.

Each physics-enabled bone should eventually support:

- animation weight
- physics weight
- blend-in time
- blend-out time
- positional correction weight
- rotational correction weight

Conceptually:

finalPose = blend(animatedPose, simulatedPose, physicsWeight)

The simulated pose should remain constrained toward the animation target when using active ragdoll/secondary motion rather than behaving like an uncontrolled loose ragdoll.

## Performance rules for mobile

- Native C++ simulation for the expensive physics path.
- Avoid allocating objects inside the simulation loop.
- Reuse collider/body/constraint objects.
- Keep render meshes separate from physics proxies.
- Use simple collision shapes before mesh collision.
- Sleep inactive rigid bodies.
- Run only enabled physics chains.
- Allow per-character simulation budgets.
- Allow lower physics rates for distant/non-critical chains.
- Never require the render loop to wait on unnecessary asset work.

## Architecture

Keep the physics system modular:

native/physics/PhysicsWorld
native/physics/RigidBody
native/physics/Collider
native/physics/Constraint
native/physics/Ragdoll
native/physics/SpringBone
native/physics/PhysicsCharacter
native/physics/PhysicsBridge

The bridge should expose a small stable API to the Android/UI layer rather than leaking the Jolt API throughout the application.

## Debug visualization

Physics debugging is a first-class feature, not an afterthought.

Eventually provide toggles for:

- collider shapes
- joint anchors
- joint limits
- bone axes
- spring chains
- spring target directions
- rigid-body centers of mass
- contact points
- velocity vectors
- simulation statistics
- physics step time

## First implementation milestone

Before attempting full ragdolls, prove the foundation with one test character:

1. Animated root motion.
2. One 5-10 bone spring chain.
3. Gravity.
4. Stiffness.
5. Damping.
6. Capsule/sphere collision.
7. Animation-follow target.
8. Physics weight slider.
9. Stable fixed timestep.
10. Debug collider/spring visualization.

Only after this behaves correctly should full ragdoll and more complex collision systems be added.

## Research references

- Jolt Physics: Android support, rigid bodies, constraints, animated ragdolls, soft bodies, and character simulation.
- VRMC_springBone 1.0: standardized spring-bone model for glTF.
- UniVRM SpringBone: practical implementation/reference for spring chains and collider groups.
- ReactPhysics3D and Rapier were evaluated as alternatives. They are capable open-source physics engines, but Jolt aligns particularly well with ASTEAMING's native C++/Android direction and the desired ragdoll/animation features.
