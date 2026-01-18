# PLZ Team Finder (ALK Scanning)

Kleine, offline-fähige Web-App (PWA): PLZ eingeben → Team (mit Farbe) + zuständiges RAV anzeigen.

## Features
- 4-stellige PLZ-Eingabe (nur Ziffern)
- Ergebnis-Karte: Team groß + Glow in Team-Farbe, RAV darunter, Ort(e) klein
- Offline verfügbar (Service Worker + Cache)
- Installierbar als App (Android/iOS/Windows/macOS je nach Browser)

## Daten
Die Zuordnung liegt lokal in: `data/plz-map.json`  
Diese Datei wurde aus den Excel-Listen generiert (PLZ, Team, RAV, Farben).

## Lokal testen
Du kannst es ohne Build-Tools laufen lassen – wichtig: über einen lokalen Webserver (nicht per Doppelklick öffnen).

### Option 1: Python (falls installiert)
```bash
python -m http.server 5173
```
Dann öffnen: http://localhost:5173

### Option 2: VS Code Live Server
Extension „Live Server“ installieren → `index.html` starten.

## Deployment auf GitHub Pages
1. Repo erstellen (z.B. `plz-team-finder`)
2. Alle Dateien hochladen
3. GitHub → **Settings → Pages**
4. Source: **Deploy from a branch**
5. Branch: `main`, Folder: `/ (root)`
6. Danach ist die App erreichbar unter:
   `https://DEIN-USERNAME.github.io/plz-team-finder/`

Hinweis: Weil wir relative Pfade (`./...`) verwenden, funktioniert es sauber auf GitHub Pages.

## Installation als App
- **Android (Chrome/Edge):** Menü → „App installieren“ / „Zum Startbildschirm“
- **iPhone (Safari):** Teilen → „Zum Home-Bildschirm“
- **Desktop (Chrome/Edge):** Install-Icon in der Adressleiste oder Button in der App

## Anpassungen
- Team-Farben: fix und verbindlich in `app.js` (TEAM_COLORS), wie in der Genspark-Version.
- UI: `styles.css`
- Logik: `app.js`
