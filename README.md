# Digital Showcase Kiosk

A multi-screen interactive kiosk built to showcase student projects at a digital showcase event. One tablet acts as the controller; two large displays mirror whatever the tablet selects, so presenters can walk up, tap a project, and have it appear on the big screens instantly.

## How it works

- **Hub (`index.html`)** — landing page linking to each part of the system.
- **Tablet (`tablet/`)** — the controller interface. Picking a project writes the selection to Firebase.
- **Displays (`display1/`, `display2/`)** — full-screen viewers that listen for changes and update in real time.
- **Firebase (`firebase/`)** — a shared Realtime Database keeps the tablet and both displays in sync with no page refreshes.

## Tech

- HTML, CSS, vanilla JavaScript (ES modules)
- Firebase Realtime Database for live sync between screens
- Designed for touch: large tap targets, full-screen media, no keyboard or mouse required

## Running it

Serve the folder with any static host (or open the hosted GitHub Pages version), then:

1. Open `tablet/` on the controller device.
2. Open `display1/` and `display2/` on the display screens.
3. Tap a project on the tablet — both displays update immediately.

## Notes

This was a team project (Team 4). The showcase media in `assets/` includes project stills and screen recordings from the event build.
