# Assets – Platzhalter & Hinweise

Dieser Ordner ist für eigene Bilder, Icons und das Favicon vorgesehen.
Ersetzen Sie die Picsum-Platzhalter durch Ihre echten Fotos.

---

## Welche Bilder müssen ersetzt werden?

| Seite / Bereich         | Empfohlene Größe  | Wo im Code suchen                          |
|-------------------------|-------------------|--------------------------------------------|
| Hero – Homepage         | 1600 × 900 px     | `index.html` → `seed/zimmerei-hero`        |
| Hero – Leistungen       | 1600 × 700 px     | `leistungen.html` → `seed/leistungen-hero` |
| Hero – Über uns         | 1600 × 700 px     | `ueber-uns.html` → `seed/ueber-uns-hero`   |
| Hero – Aktuelles        | 1600 × 700 px     | `aktuelles.html` → `seed/aktuelles-hero`   |
| Referenzprojekte (6×)   | 600 × 450 px      | `index.html` → `seed/projekt-...`          |
| Leistungskarte 1        | 800 × 500 px      | `leistungen.html` → `seed/dachstuhl-detail`|
| Leistungskarte 2        | 800 × 500 px      | `leistungen.html` → `seed/holzrahmen-detail`|
| Leistungskarte 3        | 800 × 500 px      | `leistungen.html` → `seed/innenausbau-detail`|
| Leistungskarte 4        | 800 × 500 px      | `leistungen.html` → `seed/restaurierung-detail`|
| Teamfoto (Gruppe)       | 800 × 600 px      | `ueber-uns.html` → `seed/team-gruppe`      |
| Teammitglied 1          | 300 × 300 px      | `ueber-uns.html` → `seed/team-maria`       |
| Teammitglied 2          | 300 × 300 px      | `ueber-uns.html` → `seed/team-thomas`      |
| Teammitglied 3          | 300 × 300 px      | `ueber-uns.html` → `seed/team-anna`        |
| News-Bild 1             | 800 × 500 px      | `aktuelles.html` → `seed/news-dachstuhl2024`|
| News-Bild 2             | 800 × 500 px      | `aktuelles.html` → `seed/news-ausbildung2025`|
| News-Bild 3             | 800 × 500 px      | `aktuelles.html` → `seed/news-scheune2025` |

---

## So ersetzen Sie ein Bild

1. Datei in diesen `assets/`-Ordner legen (z. B. `hero-start.jpg`)
2. Im HTML den `src`-Wert ändern:

   ```html
   <!-- Vorher (Platzhalter): -->
   <img src="https://picsum.photos/seed/zimmerei-hero/1600/900" … />

   <!-- Nachher (eigenes Bild): -->
   <img src="assets/hero-start.jpg" … />
   ```

3. Denken Sie daran, das `alt`-Attribut mit einer aussagekräftigen Bildbeschreibung zu befüllen.

---

## Empfohlene Bildformate

| Format   | Wann verwenden                                      |
|----------|-----------------------------------------------------|
| `.webp`  | Standard für alle Fotos – kleiner, qualitativ besser als JPEG |
| `.jpg`   | Fallback für Browser ohne WebP-Support              |
| `.png`   | Nur wenn Transparenz benötigt wird (z. B. Logo)     |
| `.svg`   | Icons, Logo, Vektorgrafiken                         |
| `.avif`  | Modernster Standard – sehr kleine Datei, noch nicht überall unterstützt |

**Tipp:** Verwenden Sie das `<picture>`-Element für moderne Formate mit Fallback:

```html
<picture>
  <source srcset="assets/hero.webp" type="image/webp" />
  <img src="assets/hero.jpg" alt="Zimmerer auf dem Dachstuhl" />
</picture>
```

---

## Favicon einbinden

Erstellen Sie ein SVG-Favicon (oder ICO) und binden Sie es im `<head>` jeder Seite ein.
Im Code ist dafür bereits ein auskommentierter Platzhalter vorhanden:

```html
<!-- <link rel="icon" type="image/svg+xml" href="assets/favicon.svg" /> -->
```

Entfernen Sie die Kommentarzeichen und passen Sie den Pfad an.

---

## Bildoptimierung (Empfehlung)

- **Tools:** Squoosh (kostenlos, browser-basiert), ImageOptim (Mac), ShortPixel
- **Hero-Bilder** sollten unter 200 KB liegen
- **Karten-Bilder** sollten unter 80 KB liegen
- Verwenden Sie `loading="lazy"` für alle Bilder unterhalb des ersten Sichtbereichs (bereits gesetzt)
- Verwenden Sie `loading="eager"` und `fetchpriority="high"` nur für das Hero-Bild (bereits gesetzt)
