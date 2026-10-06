# ASTEAMING Project Storage

ASTEAMING projects own their imported assets.

A project contains its own Sounds folder. Adding a sound through the project browser copies the selected file into project storage using IndexedDB in the WebView. The original Android file is not required after import.

This separation is intentional:
- Android Downloads/Music remain the user's normal device files.
- ASTEAMING Sounds contains assets used by the project.
- Deleting or moving the original phone file does not remove an imported project sound.
- Projects can later serialize their metadata into DAP without exposing the browser's internal storage implementation.

The Android document picker remains the source for importing a new sound. Playback is handled by the Web Audio layer during editing. Final MP4 export must mix the timeline audio with rendered video using Android's native encoder/muxer layer.
