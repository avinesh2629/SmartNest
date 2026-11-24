# SmartNest Web Application

A fully client-side React + TypeScript web app for demonstrating a software-only IoT automation project. It uses sample/static seed data and browser localStorage; no backend or database is required to run this version.

## Run locally
Install Node.js 20+ from https://nodejs.org, then in this folder:
```bash
npm install
npm run dev
```
Open the local URL Vite prints (typically http://localhost:5173).

## Working modules
- Overview: current device status, power estimate, recent events, sensor simulator.
- Devices: search/filter, add virtual devices, toggle devices.
- Automations: create, enable/disable, and delete temperature rules; run them from the Overview simulator.
- Energy analytics: illustrative energy profile, cost estimate, per-device rated loads.
- AI optimizer: transparent sample recommendations and demo policy toggle (not a trained model).
- Settings: export JSON and restore demo data.

State is saved in browser localStorage and survives refreshes on the same browser. Reset demo restores sample data.

## Scope honesty
This is a functional frontend prototype using simulated device data. The AI optimizer is a UI demonstration with sample recommendations, not a trained ML/RL implementation. A real database/API, MQTT integration, trained models, and formal test coverage can be added in later milestones.
