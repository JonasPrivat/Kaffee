# Espresso Tagebuch

Minimalistische, moderne Web-App für dein Espresso-Tagebuch. Läuft komplett im Browser (LocalStorage) und ist so aufgebaut, dass später ein Backend oder eine PWA ergänzt werden kann.

## Features
- Übersicht aller Shots mit Filter/Sortierung nach Datum und Maschine
- Übersichts-Kachel mit Gesamtanzahl, gefilterten Einträgen und letztem Shot
- Formular für neue oder bearbeitbare Shots mit allen relevanten Espresso-Parametern
- Angabe eines Bohnen-Blends (z. B. 80% Robusta / 20% Arabica)
- Export als PDF für einen frei wählbaren Zeitraum
- Backup & Restore als JSON-Datei (ergänzend oder ersetzend)
- Optionaler Dark Mode

## Entwicklung
```bash
npm install
npm run dev
```

Standardmäßig startet Vite unter `http://localhost:5173`.

### Produktion
```bash
npm run build
npm run preview
```

## PDF-Export
- Wähle im Bereich **PDF & Sicherungen** einen Zeitraum (Heute, Woche, Monat, Alles oder Benutzerdefiniert).
- Klick auf **PDF erzeugen** erstellt ein minimalistisches PDF mit Titel, Zeitraum und einer Tabelle der Shots.

## JSON-Backup & Import
- **Daten exportieren (JSON)** lädt alle Shots als Datei herunter.
- **Daten importieren (JSON)** liest eine Datei ein. Wähle vorher, ob die Daten ergänzt oder komplett ersetzt werden sollen.

### JSON-Format
Die Datei folgt diesem Schema und sollte unverändert importiert werden:
```json
{
  "version": 1,
  "shots": [
    {
      "id": "uuid",
      "date": "2024-01-01T08:00:00.000Z",
      "bean": "Kaffeesorte",
      "blendInfo": "80% Robusta / 20% Arabica",
      "roastery": "Optional",
      "dose": 18,
      "grindSize": "Mahlgrad",
      "tamp": "Optional",
      "brewTime": 28,
      "output": 36,
      "temperature": 93,
      "machine": "Maschine",
      "basket": "1er" | "2er",
      "tastingTags": ["süß", "säurebetont"],
      "expectedProfile": "Erwartung"
    }
  ]
}
```

## Technologie
- React + TypeScript + Vite
- Tailwind CSS für das minimalistische Styling
- jsPDF + jsPDF-Autotable für PDF-Export
- LocalStorage für Datenhaltung

## Designideen
- Viel Weißraum, Akzentfarbe Orange (`#f97316`), Schrift: Inter
- Responsive Layout für Desktop, Tablet und Smartphone
- Toggle für Dark Mode

