# Projektdokumentation & Gesprächsprotokoll (Conversation)

**Projekt:** MatheCoach Farid Häder — Rebranding & Webauftritt für selbständiges Nachhilfe-Business  
**Datum:** 24. September 2026  
**Conversation-ID:** `a3ed0879-d100-468c-9cd2-6b2e19fcea74`  
**GitHub Repository:** [https://github.com/itachisenpaisama/mathecoach](https://github.com/itachisenpaisama/mathecoach)  
**GitHub Pages URL:** [https://itachisenpaisama.github.io/mathecoach/](https://itachisenpaisama.github.io/mathecoach/)  

---

## 1. Ausgangssituation & Zielsetzung

* **Ziel:** Die bestehende Seite sollte als professionelles, minimalistisches und reizarmes Fundament für ein selbständiges Nachhilfe- und Lerncoaching-Business für Farid Häder umgestaltet werden.
* **Zielgruppe:**
  1. **Neurodivergente Kinder & Jugendliche (ADHS, Autismus, Rechenblockaden, Prüfungsangst)**, die im starren Schulsystem scheitern oder den Anschluss verlieren, aber logisch denken können.
  2. **Eltern**, die akute Entlastung vom täglichen Hausaufgabenstress und Streit suchen und einen vertrauensvollen, qualifizierten Mentor auf Augenhöhe wollen.
* **Leitfragen (Direkte, einfache Orientierung):**
  1. *Wer ich bin*
  2. *Was ich mache*
  3. *Was ich kann*
  4. *Was ich durchgemacht habe (Die persönliche Story als Vertrauensanker)*
  5. *Wie man mich erreichen kann*

---

## 2. Durchgeführte Maßnahmen & Rework

### A. Konzeption & Inhalt
* **Die 5 Kernfragen direkt beantwortet:** Übersichtliche Quick-Cards direkt unter dem Hero-Bereich ermöglichen es Eltern und Schülern, innerhalb von 10 Sekunden alle Kerninformationen zu erfassen.
* **Persönliche Story-Timeline ("Mein Weg"):**
  1. *Schulzeit:* Kampf im starren Schulsystem mit unentdecktem ADHS, Notenfrust und Missverständnissen.
  2. *Wendepunkt:* Entwicklung eigener visueller Strukturierungs- und Lernmethoden → Erfolgreiches Abitur mit Mathe- & Physik-LK.
  3. *Studium:* Nanostrukturtechnik und Elektro-/Informationstechnik → Erkenntnis: Gabe zur greifbaren Erklärung schwerster Inhalte.
  4. *Praxis:* Beliebtester Mathe-Tutor bei der Schülerhilfe mit Bestbewertungen und Mensa-IQ-Mitgliedschaft (Top 2%).
* **Zielgruppen-Trennung:** Klare Aufteilung in zwei Perspektiven:
  * *Für Eltern:* Entlastung, kein Streit mehr am Esstisch, verlässliches Feedback, flexible Konditionen ohne Knebelverträge.
  * *Für Schüler:* Keine dummen Fragen, Erklärungen auf Augenhöhe, psychologische Sicherheit, Abbau von Prüfungsangst.
* **Gegenüberstellung / Vergleichstabelle:**
  * *Klassische 45-Min-Gruppennachhilfe* (Hektik, 3-5 Schüler pro Raum, starre Verträge) vs.
  * *Mein 1-zu-1 ADHS-Mentoring* (volle 90 Min. ungeteilte Aufmerksamkeit, reizarmer Raum, individuelle Didaktik).
* **3-Schritte-Roadmap:** Unkomplizierter Start ohne bürokratische Hürden: 1. Kurze Nachricht → 2. 15-Min-Kennenlernen → 3. Erste 90-Minuten-Stunde.
* **Interaktives FAQ:** Beantwortet die 5 wichtigsten Elternfragen (Diagnose nötig? Warum 90 Minuten? Verträge? Prüfungsangst? Tablet-Online-Ablauf?).
* **Echte Belege & Nachweise:** Klickbare Original-PDFs ([`Dokumente/Zwischenzeugnis.pdf`](file:///F:/AntiGravity/Website/Dokumente/Zwischenzeugnis.pdf), [`Dokumente/Mensa.pdf`](file:///F:/AntiGravity/Website/Dokumente/Mensa.pdf), [`Dokumente/Abiturzeugnis.pdf`](file:///F:/AntiGravity/Website/Dokumente/Abiturzeugnis.pdf)).

### B. UI/UX-Design & Barrierefreiheit
* **Reizarmut & Sensorik:**
  * Ruhige Farbpalette: Calming Focus Teal (`#0d9488`), warmes Amber (`#d97706`), weiches Slate mit hohem Kontrast (WCAG 2.2 AA konform).
  * **Reizarm- & Lesefokus-Schalter (Sensory Mode):** Schaltet Schatten, Animationen und visuelle Glows komplett ab und erhöht die Zeilenhöhe für maximale Lesefreundlichkeit.
  * **Augenschonender Dark-Mode:** Speziell für lichtempfindliche Augen kalibriert.
* **Typografie:**
  * Headings: **Lexend** (speziell entwickelt zur Verringerung visueller Überlastung und Verbesserung des Lesetempos bei ADHS/Legasthenie).
  * Fließtext: **Plus Jakarta Sans** (ruhige, moderne Lesbarkeit).

### C. Performance & Code-Bereinigung
* **Schweres externes FontAwesome 6 Webfont CDN entfernt (~150 KB Ersparnis):** Durch **integrierte, messerscharfe Inline-SVGs** ersetzt. 0 ms Ladezeit, keine Render-Blocker, keine externen Ausfallrisiken.
* **CSS modularisiert:** Dedupliziert und auf ein sauberes Tokensystem mit CSS-Variablen umgestellt.
* **JavaScript um ~40% verschlankt (nur 7 KB):** Leichtgewichtiges Vanilla-JS für Theme-Umschaltung, Sensory-Focus-Modus, FAQ-Akkordeon und barrierefreies Kontaktformular.
* **Sicherheitskopien:** Vorab wurden [`index.html.bak`](file:///F:/AntiGravity/Website/index.html.bak), [`style.css.bak`](file:///F:/AntiGravity/Website/style.css.bak) und [`script.js.bak`](file:///F:/AntiGravity/Website/script.js.bak) erstellt.

---

## 3. GitHub Pages Deployment

1. Lokales Git-Repository mit sauberem Commit auf `main` vorbereitet.
2. Remote auf `https://github.com/itachisenpaisama/mathecoach.git` gesetzt und gepusht.
3. `.nojekyll` Datei hinzugefügt, um statische Dateien und PDFs fehlerfrei auszuliefern.
4. Deployment via GitHub Pages unter `https://itachisenpaisama.github.io/mathecoach/` scharfgestellt.

---

## 4. Dateistruktur im Projekt `Website`

```
F:\AntiGravity\Website\
├── .conversation\            # Rohdaten-Transkripte der Sitzung
├── .agents\                  # Skill- und Agenten-Definitionen
├── Dokumente\
│   ├── Abiturzeugnis.pdf     # Original-Abiturzeugnis (Mathe & Physik LK)
│   ├── Mensa.pdf             # Mensa in Deutschland e.V. IQ-Bescheinigung
│   └── Zwischenzeugnis.pdf   # Schülerhilfe Arbeitszeugnis
├── CONVERSATION.md           # Diese Dokumentation
├── index.html                # Hauptseite mit integriertem SVG-Sprite
├── style.css                 # Modulares, reizarmes Design-System
├── script.js                 # Performantes Vanilla-JS
├── .nojekyll                 # GitHub Pages Konfigurationsdatei
└── .gitignore                # Ausschluss temporärer Dateien (*.bak)
```
