# WiFi AP Mapper

Map and explore WiFi access point data from a CSV file. Drop in a file. See markers on an interactive Leaflet map. Inspect details in a synced table. Filter by ESSID. Toggle dark mode. Load sample data if you just want to try it.

## Overview

This app helps you visualize WiFi AP scan exports. It parses a semicolon‐delimited CSV with required columns: `BSSID`, `ESSID`, `Latitude`, `Longitude`. Each row becomes a marker. Selecting a marker highlights the table row. Selecting a row focuses the map marker. It runs fully client side.

## Features

- CSV upload (drag + drop or click)
- Sample dataset included
- Header validation and error feedback
- Graceful parse errors with messages
- Semicolon delimiter support
- Dynamic PapaParse loader via CDN
- Leaflet map auto-fit to data bounds
- Marker tooltip + info popup
- Smooth focus on selection
- Search filter by ESSID (case‑insensitive)
- Scroll-to-selected table row
- Light / dark theme with persistence
- Responsive split layout

## Live Demo

Add a link here when deployed (e.g. GitHub Pages / Vercel).

## Tech Stack

- React 19 + JSX
- TypeScript
- Vite
- Tailwind (CDN config inline)
- Leaflet (CDN)
- PapaParse (CDN, lazy loaded)

## Data Format

CSV must be `;` delimited and include headers:

```
BSSID;ESSID;Latitude;Longitude;Date;WPA PSK;WPS PIN
```

Required: `BSSID`, `ESSID`, `Latitude`, `Longitude`.
Optional extras are shown if present: `Date`, `WPA PSK`, `WPS PIN`.

Latitude / Longitude must parse to numbers. Invalid rows are skipped.

## Sample Data

See `sample-data.ts`. You can load it via the button. Values mimic a typical wardriving style export.

## Getting Started

Install dependencies:

```bash
npm install
```

Run dev server:

```bash
npm run dev
```

Open the shown local URL. Upload a CSV or load sample data.

Build for production:

```bash
npm run build
```

Preview build:

```bash
npm run preview
```

## Usage Flow

1. Start app.
2. Drag a CSV into the upload zone (or click to browse).
3. Fix any reported header or parse errors.
4. Inspect map. Hover for ESSID. Click for details.
5. Use search to filter list + markers.
6. Click a row or marker to sync focus.
7. Toggle theme anytime.

## Architecture

Component summary:

- `App.tsx` orchestrates state (data, selection, search).
- `FileUpload` handles drag/drop, PapaParse loading, validation, sample injection.
- `MapView` initializes Leaflet once. Rebuilds markers on data change. Fits bounds. Centers on selection.
- `DataTable` renders scrollable table and autoscrolls to selection.
- `Header` + `ThemeToggle` manage layout + theme.
- `useTheme` custom hook syncs mode with `localStorage` and `<html>` class.

No backend. All parsing in browser.

## Environment Variables

`vite.config.ts` exposes `process.env.GEMINI_API_KEY` if defined. Not currently used by components. Safe to remove if not needed.

## Accessibility

- Descriptive button labels
- High contrast themes
- Focus handled by native browser behavior
- Table uses semantic `<table>` markup

Potential future improvements: keyboard navigation across markers, ARIA live region for parse feedback.

## Performance Notes

- Lazy load PapaParse only when needed
- Map markers recreated per upload; fine for small to moderate files
- For very large datasets consider clustering or WebGL layers

## Error Handling

- Invalid file type -> user message
- Missing headers -> list of missing columns
- Empty / no valid rows -> message
- PapaParse load failure -> retry supported (script promise resets on error)

## Project Structure

```
App.tsx
index.html
index.tsx
sample-data.ts
types.ts
vite.config.ts
components/
	DataTable.tsx
	FileUpload.tsx
	Header.tsx
	MapView.tsx
	ThemeToggle.tsx
	icons.tsx
hooks/
	useTheme.ts
```

## Testing Ideas (Future)

- Unit test CSV validation logic (mock Papa)
- Integration test selection sync (table ↔ map)
- Snapshot test sample dataset rendering

## Roadmap

- Marker clustering for dense areas
- CSV delimiter auto-detect
- GeoJSON export
- Column mapping UI
- Keyboard navigation
- Deploy demo site

## Troubleshooting

Map blank: ensure Leaflet CSS loaded (see `index.html`).

No markers: check required headers and coordinate numeric values.

Script load error: network may block CDN; retry or bundle libs locally.

Dark tiles too bright: adjust CSS filter in `index.html`.

## Security Considerations

All parsing client side. No network calls for uploaded data.


## Contributing

Fork. Create a feature branch. Keep PRs small. Explain test scope. Use clear commit messages.


