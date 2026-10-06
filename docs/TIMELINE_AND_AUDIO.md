# ASTEAMING Timeline and Audio

## Project Sounds

Each ASTEAMING project has an internal Sounds folder. It is project storage, not a live view of Android's filesystem.

Users can import sound effects or music through the project's Sounds browser. Imported files are copied into project storage so they remain available even if the original phone file is moved or deleted.

## Timeline

The timeline is a multi-track sequencer rather than a decorative playback bar.

Track types:
- Animation clips
- Bone/property keyframes
- Sound effects/music
- Physics/bake events
- Markers

Core editing:
- frame-accurate playhead
- touch scrubbing
- snapping
- move/trim/split clips
- mute/solo/lock
- playback range
- markers
- undo/redo integration
- timecode and FPS
- zoom/pan

Audio clips support:
- waveform visualization when decoded
- volume
- fade in/out
- source offset
- looping
- split
- drag to reposition

## Main menu

The main menu owns project management. A project browser exposes:
- Create/open/duplicate/delete project
- project-local Sounds folder
- imported models
- exports
- autosave/version history

The project Sounds folder is intentionally separate from Android's general Downloads/Music folders.

## Playback

The timeline owns the authoritative project time. Three.js AnimationMixer can be driven from this clock using its setTime method or update method, keeping animation and audio synchronized. AnimationMixer supports global time and exact setTime, while AnimationAction supports clip timing, blending, looping and time scaling.

## Export

MP4 export renders the same timeline, including:
- model animation
- baked physics
- audio tracks
- markers/range selection

The video renderer should feed frames and the mixed timeline audio into Android's hardware video/audio encoder/muxer. Model export remains separate.

## Mobile interaction

Touch-first rules:
- one finger on ruler: scrub
- drag clip body: move
- drag clip edge: trim
- double tap: split/select
- pinch timeline: zoom
- two-finger pan: horizontal/vertical timeline navigation
- long press: context menu
- playhead remains visible while scrolling

A timeline library can be evaluated for the UI, but ASTEAMING should keep its document/model layer independent so a UI library can be replaced without rewriting animation or audio data.
